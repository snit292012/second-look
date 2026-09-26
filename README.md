# SusCheck — is this message a scam?

**Paste or share any DM, text or link. Get an instant verdict — ✅ No red flags · 🤨 Sus · 🚩 Scam — with the reasons in plain words and what to do next.**

Built by a 14-year-old in the UK for the scams that actually hit people my age: free Nitro / Robux / V-Bucks, fake Steam
"I reported you by accident" messages, look-alike links (`discorcl.gift`, `steamcommunnity.com`), fake parcel and HMRC texts,
"Hi Mum, new number", money-mule "easy money" offers, and sextortion threats.

- 🔒 **Private by design.** Every check runs on the phone. No server, no AI API, nothing is uploaded.
- 📤 **Share-to-check.** Long-press a message in Discord, WhatsApp or Messages → Share → SusCheck.
- 🛟 **Help, not just a score.** Threats to leak images go straight to a help screen: Childline (0800 1111), Report Remove and CEOP.
- 🧪 **Scam Lab.** A swipe game — scam or legit? — built on the same engine, so every answer teaches the real warning sign.

## How RevenueCat is used

Checking is **free forever** — a safety tool shouldn't have a paywall. RevenueCat powers **SusCheck Pro**:

| | |
|---|---|
| Entitlement | `pro` |
| Offering | `default` — monthly and annual subscriptions |
| Paywall | RevenueCat Paywall via `RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: 'pro' })` |
| Gated features | unlimited Scam Lab (3 free rounds a day), check history |
| Live status | `usePro()` hook: `getCustomerInfo` + `addCustomerInfoUpdateListener`, so features unlock the instant a purchase lands |
| Self-service | Customer Center (`presentCustomerCenter`) and Restore purchases |

For the hackathon build, purchases run on the **RevenueCat Test Store** (no Play Store listing needed).
Code: [`src/lib/purchases.ts`](src/lib/purchases.ts).

## How the checker works

[`src/engine`](src/engine) is plain TypeScript with no dependencies:

- **Links** ([`urls.ts`](src/engine/urls.ts)): finds links with or without `https://`, works out who really owns the domain
  (`discord.com.nitro-gift.ru` is owned by `nitro-gift.ru`), and catches look-alikes by squashing swapped letters
  (`rn→m`, `cl→d`, `0→o`, `1/i→l`) and measuring edit distance to real brand domains. It also flags punycode, bare IP
  addresses, link shorteners and throwaway endings like `.xyz`. Real Discord/Steam/Roblox/Royal Mail links are never flagged.
- **Messages** ([`rules.ts`](src/engine/rules.ts)): 15 scam scripts (free stuff, fake report, code stealing, gift cards,
  parcel fees, HMRC, crypto doubling, money mules, Hi Mum, vote scams, sextortion, pressure and secrecy, personal info).
- **Verdict** ([`check.ts`](src/engine/check.ts)): signals combine like independent warnings, so two medium signals add up
  but the score never passes 100. A bait message plus a link is treated as the classic combo.

The tests ([`check.test.ts`](src/engine/check.test.ts)) include real-style scams **and** normal messages that must stay
clear (`discord.gg` invites, homework links, real Royal Mail delivery texts, "that was easy money lol"), because false alarms
teach people to ignore warnings.

```bash
npm test
```

## Run it

Requirements: Node 20+, JDK 17, Android SDK (or a device with USB debugging).

```bash
npm install
cp .env.example .env        # add your RevenueCat Test Store API key
npx expo run:android
```

Without a key the app still works fully; only Pro purchases are disabled.

## Stack

Expo SDK 57 · React Native · Expo Router · react-native-purchases + react-native-purchases-ui · expo-share-intent · Vitest

## License

MIT — see [LICENSE](LICENSE).
