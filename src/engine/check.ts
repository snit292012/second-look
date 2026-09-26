import { RULES, type Category } from './rules';
import { analyseUrl, extractUrls, type LinkFinding } from './urls';

export type Verdict = 'clear' | 'sus' | 'scam' | 'get-help';

export type Flag = {
  kind: 'link' | 'message';
  id: string;
  weight: number;
  reason: string;
  advice?: string;
  evidence?: string; // the words or link that triggered it
};

export type CheckResult = {
  verdict: Verdict;
  score: number; // 0-100
  flags: Flag[];
  links: string[];
  advice: string[];
};

// Combine signals like independent warnings: two medium signals add up, but the score never passes 100.
function combine(weights: number[]): number {
  const keep = weights.reduce((p, w) => p * (1 - Math.min(w, 99) / 100), 1);
  return Math.round((1 - keep) * 100);
}

const clip = (s: string) => (s.length > 60 ? s.slice(0, 57).trimEnd() + '…' : s);

export function check(text: string): CheckResult {
  const input = text.normalize('NFKC');
  const flags: Flag[] = [];

  const links = extractUrls(input);
  const linkFlags: LinkFinding[] = links.flatMap(analyseUrl);
  for (const f of linkFlags) flags.push({ kind: 'link', id: f.host, weight: f.weight, reason: f.reason, evidence: f.url });

  const matched = new Set<Category>();
  for (const rule of RULES) {
    for (const re of rule.test) {
      const m = input.match(re);
      if (m) {
        matched.add(rule.id);
        flags.push({ kind: 'message', id: rule.id, weight: rule.weight, reason: rule.reason, advice: rule.advice, evidence: clip(m[0]) });
        break;
      }
    }
  }

  // A bait message plus any link is the classic combo: bump it so it can't hide as "sus".
  const bait = ['free-stuff', 'fake-report', 'account-threat', 'vote-scam', 'parcel', 'tax'].some((c) => matched.has(c as Category));
  const weights = flags.map((f) => f.weight);
  if (bait && links.length > 0) weights.push(40);

  const score = flags.length ? combine(weights) : 0;
  const verdict: Verdict = matched.has('sextortion') ? 'get-help' : score >= 70 ? 'scam' : score >= 30 ? 'sus' : 'clear';

  flags.sort((a, b) => b.weight - a.weight);
  const advice = [...new Set(flags.map((f) => f.advice).filter((a): a is string => !!a))];
  if (verdict !== 'clear' && linkFlags.length && !advice.length) advice.push("Don't open the link. If you already did, don't type your password there.");
  if (verdict === 'clear')
    advice.push("Nothing matched our scam patterns. That doesn't prove it's safe: if it asks for money, codes or passwords, stop and check with someone.");

  return { verdict, score, flags, links, advice };
}
