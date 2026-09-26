import { describe, expect, it } from 'vitest';
import { check } from './check';
import { analyseUrl, editDistance, extractUrls, registrableDomain, skeleton } from './urls';

const verdict = (t: string) => check(t).verdict;

describe('scams teens actually get', () => {
  it.each([
    ['free nitro 🎁 claim here discorcl.gift/nitro-3m', 'scam'],
    ['bro get ur free nitro before it expires https://dlscord-nitro.com/claim', 'scam'],
    ['https://steamcommunnity.com/tradeoffer/new/?partner=1 check my trade', 'scam'],
    ['Hey sorry I accidentally reported your account, add the steam admin on discord to fix it before you get banned', 'scam'],
    ['FREE ROBUX GENERATOR 👉 robux-free.xyz', 'scam'],
    ['Royal Mail: your parcel is held due to an unpaid fee of £1.45. Pay here: royalmail-reschedule.com', 'scam'],
    ['HMRC: you are due a tax refund of £326.40, claim at hmrc-refund.top', 'scam'],
    ['Hi mum this is my new number, lost my phone. Can you send £200 for rent? Urgent', 'sus'],
    ['I just sent a 6-digit code to your phone by mistake, can you send me the code?', 'scam'],
    ['Earn £500 a day, easy money, just need to use your bank account', 'scam'],
    ['pls vote for my team in the tournament https://cs2-vote-team.shop', 'scam'],
    ['Your Instagram account will be deleted within 24 hours. Verify your account: lnstagram.com/verify', 'scam'],
    ['Visit discord.com.nitro-gift.ru to get it', 'scam'],
  ])('%s → %s', (text, expected) => {
    expect(verdict(text)).toBe(expected);
  });

  it('sextortion always goes to the help screen, with Childline and CEOP', () => {
    const r = check("I have your pics. Pay me £100 or I'll send them to all your followers");
    expect(r.verdict).toBe('get-help');
    expect(r.advice.join(' ')).toMatch(/Childline/);
    expect(r.advice.join(' ')).toMatch(/CEOP/);
  });
});

describe('normal messages stay clear (no false alarms)', () => {
  it.each([
    'yo are we still on for fortnite tonight?',
    'here is the homework link https://classroom.google.com/c/abc',
    'join our server https://discord.gg/minecraft',
    'check the new trailer https://www.youtube.com/watch?v=abc123',
    'Your Royal Mail parcel was delivered to your safe place. Track it at royalmail.com',
    'lol.idk what u mean',
    'Steam summer sale starts tomorrow: store.steampowered.com',
    'can you send me the homework answers pls',
    'nitro is so expensive now lol',
    'that was easy money lol',
    'my bank account is empty after that sale',
  ])('%s', (text) => {
    expect(verdict(text)).toBe('clear');
  });
});

describe('link tools', () => {
  it('finds links with and without https', () => {
    expect(extractUrls('go to discorcl.gift/x or https://bit.ly/abc.')).toEqual(['discorcl.gift/x', 'https://bit.ly/abc']);
  });
  it('splits UK domains properly', () => {
    expect(registrableDomain('track.evri.co.uk')).toBe('evri.co.uk');
    expect(registrableDomain('discord.com.nitro-gift.ru')).toBe('nitro-gift.ru');
  });
  it('sees through swapped letters', () => {
    expect(skeleton('discorcl')).toBe(skeleton('discord'));
    expect(skeleton('rnicrosoft')).toBe(skeleton('microsoft'));
    expect(skeleton('r0blox')).toBe('roblox');
    expect(editDistance('steamcommunnity', 'steamcommunity')).toBe(1);
  });
  it('never flags the real domains', () => {
    for (const u of ['https://discord.gift/abc', 'steamcommunity.com/id/me', 'www.roblox.com/games/1', 'https://evri.com/track']) {
      expect(analyseUrl(u)).toEqual([]);
    }
  });
  it('names the real site being copied', () => {
    expect(analyseUrl('discorcl.gift/x')[0].reason).toMatch(/NOT discord\.gift/);
    expect(analyseUrl('steamcommunnity.com/x')[0].reason).toMatch(/NOT steamcommunity\.com/);
  });
  it('flags a shortener but not as a full scam on its own', () => {
    expect(verdict('https://bit.ly/3xYz')).toBe('clear');
    expect(check('https://bit.ly/3xYz').flags.length).toBe(1);
  });
});
