// Message patterns: the scripts scammers reuse on teens (Discord, Steam, Roblox, texts, DMs).

export type Category =
  | 'free-stuff'
  | 'fake-report'
  | 'account-threat'
  | 'code-steal'
  | 'gift-cards'
  | 'parcel'
  | 'tax'
  | 'crypto'
  | 'easy-money'
  | 'money-mule'
  | 'hi-mum'
  | 'vote-scam'
  | 'sextortion'
  | 'pressure'
  | 'personal-info';

export type Rule = {
  id: Category;
  weight: number;
  test: RegExp[]; // any one match counts
  reason: string;
  advice: string;
};

export const RULES: Rule[] = [
  {
    id: 'free-stuff',
    weight: 45,
    test: [
      /free\s*(discord\s*)?nitro/i,
      /free\s*robux|robux\s*generator/i,
      /free\s*v[-\s]?bucks/i,
      /free\s*(skins?|knife|cs2?\s*skins?|gift\s*card)/i,
      /(claim|collect)\s+(your|the|this)\s+(free\s+)?(gift|reward|prize|nitro)/i,
      /you('ve|\s+have)\s+(won|been\s+selected)/i,
    ],
    reason: 'It promises free Nitro, Robux, V-Bucks, skins or a prize. That is the #1 bait for stealing accounts.',
    advice: "Don't click. Real gifts appear inside the app itself, not as links in DMs.",
  },
  {
    id: 'fake-report',
    weight: 55,
    test: [
      /(accident(al)?ly|by\s+(mistake|accident))\s+report(ed)?\s+(you|your)/i,
      /report(ed)?\s+you\s+by\s+(mistake|accident)/i,
      /(false|fake|wrong)\s+report/i,
      /your\s+account\s+(was|got|has\s+been)\s+(flagged|reported)/i,
      /(add|contact|message|dm)\s+(the\s+)?(steam|discord|valve|roblox|epic)?\s*(admin|support|moderator|mod|staff)\s+(on|in|via|at)\s+(discord|telegram|whatsapp|snap)/i,
    ],
    reason: 'The "I reported you by accident, talk to this admin" story is a known Steam/Discord scam to steal your account.',
    advice: 'Ignore it. No real admin will DM you to sort out a report. Check your account inside the real app.',
  },
  {
    id: 'account-threat',
    weight: 35,
    test: [
      /(account|profile)\s+(will|is\s+going\s+to)\s+be\s+(banned|suspended|deleted|locked|disabled)/i,
      /verify\s+(your\s+)?(account|identity|login)/i,
      /(banned|suspended|deleted)\s+(within|in)\s+\d+\s*(h|hours|minutes|mins)/i,
      /before\s+(you|your\s+account)\s+(get|gets|is)\s+(banned|deleted|locked|suspended)/i,
    ],
    reason: 'It threatens that your account will be banned or deleted unless you act.',
    advice: "Real companies warn you inside their app or official email. Don't log in through a link in a message.",
  },
  {
    id: 'code-steal',
    weight: 70,
    test: [
      /(send|give|tell|share|read)\s+(me\s+)?(the|your|that)\s+(\d-digit\s+)?(code|verification\s+code|login\s+code|2fa|otp|pin)/i,
      /code\s+(i|we)\s+(just\s+)?sent\s+(you|to\s+your)/i,
      /scan\s+(this|the)\s+qr/i,
    ],
    reason: 'It asks for a login code or to scan a QR code. That code IS your account. Whoever has it can log in as you.',
    advice: 'Never share a code or scan a login QR someone sends you, even if it looks like a friend.',
  },
  {
    id: 'gift-cards',
    weight: 55,
    test: [/(pay|send|buy|get)\b.{0,40}(gift\s*cards?|itunes\s*card|steam\s*card|google\s*play\s*card|apple\s*card|amazon\s*card)/i],
    reason: 'It asks you to pay with gift cards. No real company or person you can trust asks for this.',
    advice: 'Stop. Gift card payments are almost always scams and the money is gone once you send the code.',
  },
  {
    id: 'parcel',
    weight: 40,
    test: [
      /(royal\s*mail|evri|hermes|dpd|dhl|ups|parcel|package|delivery).{0,80}(fee|reschedul|failed|unpaid|held|missed|pay)/i,
      /(fee|reschedul|failed|unpaid|held|missed).{0,60}(parcel|package|delivery)/i,
    ],
    reason: 'A "your parcel is held, pay a small fee" text. Couriers use this story constantly in the UK.',
    advice: 'Check the real courier app or website yourself. Never pay a fee from a text link.',
  },
  {
    id: 'tax',
    weight: 40,
    test: [/hmrc|tax\s+refund|tax\s+rebate|council\s+tax\s+(refund|rebate)/i],
    reason: 'It mentions an HMRC or tax refund. HMRC never texts or emails you a link to claim money.',
    advice: 'Show an adult. Report it by forwarding the text to 7726.',
  },
  {
    id: 'crypto',
    weight: 50,
    test: [
      /(double|triple)\s+your\s+(crypto|bitcoin|btc|eth|money)/i,
      /(send|deposit)\s+.{0,20}(btc|eth|usdt|sol|crypto|bitcoin).{0,40}(back|return|double)/i,
      /guaranteed\s+(profit|returns?)/i,
    ],
    reason: 'It promises to multiply your money or crypto. Guaranteed profit is always a lie.',
    advice: "Don't send anything. Nobody doubles money for strangers.",
  },
  {
    id: 'easy-money',
    weight: 35,
    test: [
      /(earn|make)\s+£?\$?\d+\s*(k)?\s*(a|per|every)\s+(day|hour|week)/i,
      /(easy\s+money|quick\s+cash).{0,40}(job|dm|message|interested|opportunity|per|a\s+day|from\s+home)/i,
    ],
    reason: 'It offers easy money for little work. These "jobs" are how teens get pulled into scams.',
    advice: "If it sounds too easy, it is. Don't reply with any details.",
  },
  {
    id: 'money-mule',
    weight: 70,
    test: [
      /(use|borrow|lend)\s+(me\s+)?your\s+(bank\s+)?(account|card)/i,
      /receive\s+money\s+(into|in|to)\s+your\s+(bank\s+)?account/i,
      /(need|use)\s+.{0,20}your\s+bank\s+(account|details|card)/i,
    ],
    reason: 'Someone wants to use your bank account. That is how teens get tricked into being "money mules", which is a crime.',
    advice: 'Say no and tell a trusted adult. Letting someone move money through your account can get it closed and get you in legal trouble.',
  },
  {
    id: 'hi-mum',
    weight: 45,
    test: [/(hi|hey)\s+(mum|mom|dad)\b.{0,80}(new\s+number|lost\s+my\s+phone|broke\s+my\s+phone)/i, /(new\s+number|lost\s+my\s+phone).{0,60}(mum|dad|save\s+this)/i],
    reason: 'The "Hi Mum, this is my new number" message. Scammers pretend to be family, then ask for money.',
    advice: 'Call the person on the number you already have before doing anything.',
  },
  {
    id: 'vote-scam',
    weight: 40,
    test: [/vote\s+for\s+(me|my\s+(team|server|clan|friend))/i, /(check|rate)\s+(out\s+)?(my|this)\s+(skin|trade|inventory|server)/i, /trade\s+offer/i],
    reason: '"Vote for my team" or "check my trade" links lead to fake Steam or Discord logins.',
    advice: "Don't log in through the link. If it's real, your friend can show you in the actual app.",
  },
  {
    id: 'sextortion',
    weight: 90,
    test: [
      /i\s+(have|got|saved)\s+(your|ur)\s+(pics|photos|nudes|videos?)/i,
      /(send|post|share|leak|show)\s+(it|them|these|your\s+(pics|photos|nudes))\s+to\s+(all\s+)?(your\s+)?(friends|followers|family|school|parents)/i,
      /pay\s+(me\s+)?or\s+i('ll|\s+will)\s+(post|send|share|leak)/i,
    ],
    reason: 'Someone is threatening to share private images unless you pay or send more. This is a crime, and it is NOT your fault.',
    advice:
      "Don't pay and don't send anything else. Stop replying, but don't delete the chat. Tell a trusted adult now. Childline's Report Remove tool can get images taken down (childline.org.uk, or call 0800 1111). You can report to CEOP at ceop.police.uk.",
  },
  {
    id: 'pressure',
    weight: 15,
    test: [/\b(urgent|asap|immediately|right\s+now|act\s+now|last\s+chance|expires?\s+(today|soon|in))\b/i, /(don't|do\s+not)\s+tell\s+(anyone|your\s+(parents|mum|dad))/i],
    reason: 'It rushes you or tells you to keep it secret. Scammers do that so you don\'t stop and think.',
    advice: 'Slow down. Anything real can wait 10 minutes while you check.',
  },
  {
    id: 'personal-info',
    weight: 30,
    test: [/(what'?s|send\s+me|give\s+me)\s+your\s+(home\s+address|address|password|school|bank|card\s+number|full\s+name)/i],
    reason: 'It asks for private details like your password, address or school.',
    advice: 'Never share passwords. Only give personal details to people you know in real life.',
  },
];
