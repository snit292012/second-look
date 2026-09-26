// Link analysis: pull links out of a message and explain what is wrong with each one.
// Everything here runs on the phone. No network calls, no lookups.

export type LinkFinding = {
  url: string;
  host: string;
  weight: number; // how much this pushes the verdict towards "scam" (0-100)
  reason: string; // plain words, shown to the user
};

type Brand = { name: string; domains: string[] };

// Official domains for the brands scammers copy most when they target teens in the UK.
export const BRANDS: Brand[] = [
  { name: 'Discord', domains: ['discord.com', 'discord.gg', 'discord.gift', 'discordapp.com', 'discord.new', 'discord.media', 'discordapp.net'] },
  { name: 'Steam', domains: ['steamcommunity.com', 'steampowered.com', 'steamstatic.com', 'steam.tv'] },
  { name: 'Roblox', domains: ['roblox.com', 'rbxcdn.com'] },
  { name: 'Epic Games', domains: ['epicgames.com', 'fortnite.com', 'unrealengine.com'] },
  { name: 'Minecraft', domains: ['minecraft.net'] },
  { name: 'Instagram', domains: ['instagram.com'] },
  { name: 'Snapchat', domains: ['snapchat.com'] },
  { name: 'TikTok', domains: ['tiktok.com'] },
  { name: 'PayPal', domains: ['paypal.com', 'paypal.me'] },
  { name: 'Apple', domains: ['apple.com', 'icloud.com'] },
  { name: 'Google', domains: ['google.com', 'google.co.uk', 'youtube.com', 'youtu.be'] },
  { name: 'Microsoft', domains: ['microsoft.com', 'xbox.com', 'live.com', 'outlook.com'] },
  { name: 'PlayStation', domains: ['playstation.com'] },
  { name: 'Netflix', domains: ['netflix.com'] },
  { name: 'Amazon', domains: ['amazon.co.uk', 'amazon.com'] },
  { name: 'Royal Mail', domains: ['royalmail.com'] },
  { name: 'Evri', domains: ['evri.com'] },
  { name: 'DPD', domains: ['dpd.co.uk'] },
  { name: 'HMRC', domains: ['gov.uk'] },
];

// Words inside a domain that name a brand. Used to catch "discord-nitro-gift.com" style domains.
const BRAND_WORDS: Record<string, string> = {
  discord: 'Discord', steam: 'Steam', steamcommunity: 'Steam', roblox: 'Roblox', robux: 'Roblox', epicgames: 'Epic Games',
  fortnite: 'Epic Games', vbucks: 'Epic Games', minecraft: 'Minecraft', instagram: 'Instagram', snapchat: 'Snapchat',
  tiktok: 'TikTok', paypal: 'PayPal', apple: 'Apple', icloud: 'Apple', xbox: 'Microsoft', playstation: 'PlayStation',
  netflix: 'Netflix', amazon: 'Amazon', royalmail: 'Royal Mail', evri: 'Evri', hmrc: 'HMRC', nitro: 'Discord',
};

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'cutt.ly', 'is.gd', 'shorturl.at', 'rb.gy', 'goo.su', 'ow.ly', 'bl.ink', 'rebrand.ly', 't.ly', 'v.gd', 'tiny.cc', 'shorturl.gg',
]);

const RISKY_TLDS = new Set([
  'xyz', 'top', 'icu', 'click', 'gift', 'ru', 'tk', 'ml', 'ga', 'cf', 'gq', 'shop', 'monster', 'rest', 'zip', 'mov', 'cam', 'sbs', 'cfd', 'buzz', 'fun', 'live', 'best',
]);

const COMMON_TLDS = new Set(['com', 'net', 'org', 'uk', 'io', 'gg', 'me', 'co', 'app', 'dev', 'info', 'tv', 'us', 'eu', 'ly', 'be', 'at', 'to']);

// Two-part endings, so "royalmail.co.uk.parcel-fee.com" and "evri.co.uk" split correctly.
const TWO_PART_SUFFIXES = new Set(['co.uk', 'gov.uk', 'org.uk', 'ac.uk', 'me.uk', 'com.au', 'co.nz', 'com.br', 'co.in', 'co.za']);

const URL_RE =
  /\b((?:https?:\/\/)?(?:[a-z0-9¡-￿-]+\.)+[a-z¡-￿]{2,}(?::\d{2,5})?(?:[/?#][^\s<>"')\]]*)?)/gi;

export function extractUrls(text: string): string[] {
  const found = new Set<string>();
  for (const m of text.matchAll(URL_RE)) {
    const u = m[1].replace(/[.,!?;:]+$/, '');
    // "lol.idk" is not a link. Without https:// or www., only accept endings that websites really use.
    const explicit = /^(https?:\/\/|www\.)/i.test(u);
    const tld = hostOf(u).split('.').pop() ?? '';
    if (!explicit && !COMMON_TLDS.has(tld) && !RISKY_TLDS.has(tld)) continue;
    found.add(u);
  }
  return [...found];
}

export function hostOf(url: string): string {
  let rest = url.replace(/^https?:\/\//i, '');
  rest = rest.split(/[/?#]/)[0];
  if (rest.includes('@')) rest = rest.split('@').pop() ?? rest; // user:pass@host
  return rest.replace(/:\d+$/, '').toLowerCase().replace(/^www\./, '');
}

export function registrableDomain(host: string): string {
  const parts = host.split('.');
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join('.');
  if (TWO_PART_SUFFIXES.has(lastTwo)) return parts.slice(-3).join('.');
  return lastTwo;
}

// Squash characters scammers swap in: rn→m, vv→w, cl→d, 0→o, 1/i→l, 3→e, 5→s, 4→a. Hyphens vanish.
export function skeleton(label: string): string {
  return label
    .toLowerCase()
    .replace(/-/g, '')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/cl/g, 'd')
    .replace(/0/g, 'o')
    .replace(/[1i|!]/g, 'l')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/4/g, 'a');
}

// Damerau-Levenshtein (optimal string alignment) distance.
export function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

function officialBrand(host: string): Brand | undefined {
  const reg = registrableDomain(host);
  return BRANDS.find((b) => b.domains.some((d) => reg === d || host === d || host.endsWith('.' + d)));
}

function labelOf(domain: string): string {
  // "steamcommunnity.com" → "steamcommunnity", "evri.co.uk" → "evri"
  const parts = domain.split('.');
  const tail = TWO_PART_SUFFIXES.has(parts.slice(-2).join('.')) ? 2 : 1;
  return parts.slice(0, parts.length - tail).join('.');
}

function lookalikeOf(reg: string): { brand: string; real: string } | undefined {
  const label = labelOf(reg);
  const sk = skeleton(label);
  const tld = reg.split('.').pop();
  for (const b of BRANDS) {
    // Compare against the brand's domain with the same ending first, so "discorcl.gift" is shown next to "discord.gift".
    const domains = [...b.domains].sort((x, y) => Number(y.endsWith('.' + tld)) - Number(x.endsWith('.' + tld)));
    for (const d of domains) {
      const real = labelOf(d);
      if (real.length < 4 || label === real) continue;
      const realSk = skeleton(real);
      if (sk === realSk) return { brand: b.name, real: d };
      const limit = real.length >= 8 ? 2 : 1;
      if (editDistance(sk, realSk) <= limit) return { brand: b.name, real: d };
    }
  }
  return undefined;
}

export function analyseUrl(url: string): LinkFinding[] {
  const host = hostOf(url);
  const out: LinkFinding[] = [];
  const add = (weight: number, reason: string) => out.push({ url, host, weight, reason });

  if (!host) return out;
  const official = officialBrand(host);
  if (official) return out; // a real Discord/Steam/Roblox link: nothing to flag about the domain itself

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add(45, `${host} is a bare number address, not a real website name. Real companies never send these.`);
  if (host.split('.').some((p) => p.startsWith('xn--')))
    add(60, `${host} uses look-alike letters from other alphabets to pretend to be a site you know.`);
  if (/^https?:\/\/[^/]*@/i.test(url)) add(55, 'The link hides where it really goes using an "@" trick.');

  const reg = registrableDomain(host);
  const tld = host.split('.').pop() ?? '';

  const look = lookalikeOf(reg);
  if (look) add(85, `${reg} is NOT ${look.real}. It's a fake made to look like ${look.brand}.`);

  if (!look) {
    // Brand word inside a domain the brand doesn't own: "discord-nitro.gift", "steam-trade.com", or the
    // subdomain trick "discord.com.claim-gift.ru" where the real owner is the last part.
    const squashed = skeleton(host.replace(/\./g, '-'));
    const hit = Object.keys(BRAND_WORDS).find((w) => squashed.includes(skeleton(w)));
    if (hit) {
      const brand = BRAND_WORDS[hit];
      add(70, `This link uses the name ${brand}, but it goes to ${reg}, which ${brand} doesn't own.`);
    }
  }

  if (SHORTENERS.has(reg)) add(25, `${reg} is a link shortener, so you can't see where it really goes.`);
  if (RISKY_TLDS.has(tld)) add(20, `Websites ending in .${tld} are cheap and often used for scams.`);
  if (/^http:\/\//i.test(url)) add(10, 'The link is not secure (http, not https).');
  return out;
}
