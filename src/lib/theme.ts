import type { Verdict } from '../engine/check';

export const C = {
  bg: '#0B0F1A',
  card: '#151B2B',
  cardHi: '#1E2640',
  text: '#F4F6FB',
  dim: '#9AA3B8',
  line: '#2A3350',
  accent: '#7C5CFF',
  accentText: '#FFFFFF',
};

export const VERDICT: Record<Verdict, { label: string; emoji: string; color: string; tint: string; line: string }> = {
  clear: { label: 'No red flags', emoji: '✅', color: '#2BD67B', tint: '#0F2A1E', line: "We didn't spot a scam pattern." },
  sus: { label: 'Sus', emoji: '🤨', color: '#FFB020', tint: '#2E2410', line: 'Something here is off. Be careful.' },
  scam: { label: 'Scam', emoji: '🚩', color: '#FF4D5E', tint: '#2E1116', line: "This looks like a scam. Don't click, don't reply." },
  'get-help': { label: 'Get help now', emoji: '🛟', color: '#4DA3FF', tint: '#0F1E33', line: "This is not your fault, and you're not alone." },
};
