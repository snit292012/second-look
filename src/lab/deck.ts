// Scam Lab cards: realistic messages, some scams, some completely normal. The lesson for each comes from the
// same engine the checker uses, plus a one-line tip written for this card.
export type Card = { from: string; text: string; scam: boolean; tip: string };

export const DECK: Card[] = [
  { from: 'Discord DM', text: 'yo free nitro for 3 months, they are giving it out for the anniversary 👉 discord-nitro.gift/claim', scam: true, tip: 'Discord gifts live at discord.gift only. "discord-nitro.gift" is someone else\'s site.' },
  { from: 'Discord DM', text: 'wanna play later? join https://discord.gg/minecraft', scam: false, tip: 'discord.gg is Discord\'s real invite link.' },
  { from: 'Steam chat', text: 'Hey man sorry, I accidentally reported your account. Message the Steam admin on Discord or you get banned', scam: true, tip: 'Steam staff never DM you on Discord. This story is built to make you panic.' },
  { from: 'Text', text: 'Royal Mail: We could not deliver your parcel. A £1.99 redelivery fee is due: royalmail.parcel-fee.com', scam: true, tip: 'The real site is royalmail.com. The last part before the ending is the owner: parcel-fee.com.' },
  { from: 'Text', text: 'Your Royal Mail parcel was delivered to your safe place. Details at royalmail.com', scam: false, tip: 'No fee, no pressure, and the real domain.' },
  { from: 'Instagram DM', text: 'Your account will be deleted within 24 hours for copyright. Verify now: lnstagram-support.com', scam: true, tip: 'lnstagram starts with a lowercase L, not an i. Instagram warns you in the app, not in DMs.' },
  { from: 'Snapchat', text: 'I just sent a code to your phone by mistake, can you send me the code?', scam: true, tip: 'That code logs into YOUR account. Anyone asking for it is trying to steal it.' },
  { from: 'WhatsApp', text: 'Hi mum, this is my new number, lost my phone. Can you send £150 for something urgent?', scam: true, tip: 'Call the old number first. Real family can wait 2 minutes.' },
  { from: 'Roblox', text: 'FREE ROBUX GENERATOR 100% WORKING robux-free.xyz', scam: true, tip: 'There is no Robux generator. Robux only come from Roblox itself.' },
  { from: 'Text', text: 'HMRC: you are due a tax refund of £326.40. Claim before midnight: hmrc-gov-refund.top', scam: true, tip: 'HMRC never texts links to claim money. Forward scam texts to 7726.' },
  { from: 'Friend', text: 'did you do the maths homework? its on classroom.google.com', scam: false, tip: 'Normal message, real Google domain, nothing asked of you.' },
  { from: 'Discord DM', text: 'pls vote for my team in the cs2 tournament, we need 5 more votes https://cs2-vote-team.shop', scam: true, tip: '"Vote for my team" pages ask you to log in with Steam, and that fake login steals the account.' },
  { from: 'Instagram DM', text: 'Easy money 💰 earn £500 a day from home, just need to use your bank account for payments', scam: true, tip: 'This is money mule recruitment. Moving money for someone else is a crime, even if you keep none of it.' },
  { from: 'Epic Games email', text: 'Your Fortnite purchase of 1,000 V-Bucks was successful. View receipts at epicgames.com/account', scam: false, tip: 'A normal receipt on the real epicgames.com. No link to "claim" anything.' },
  { from: 'Discord DM', text: 'check out my new skin trade, rate it pls steamcommunnity.com/tradeoffer/new', scam: true, tip: 'Count the n\'s: steamcommunnity has two. One letter is all a scam needs.' },
];
