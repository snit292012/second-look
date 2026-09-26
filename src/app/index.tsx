import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { usePro } from '../lib/purchases';
import { C } from '../lib/theme';

const EXAMPLES = [
  'bro free nitro before it runs out 🎁 discorcl.gift/n1tro',
  'Hey sorry I accidentally reported your account, add the steam admin on discord to fix it before you get banned',
  'Royal Mail: your parcel is held due to an unpaid fee of £1.45. Pay here: royalmail-reschedule.com',
];

export default function Home() {
  const router = useRouter();
  const { hasShareIntent } = useShareIntentContext();
  const { pro } = usePro();
  const [text, setText] = useState('');

  useEffect(() => {
    if (hasShareIntent) router.replace('/shareintent');
  }, [hasShareIntent, router]);

  const go = (t = text) => t.trim() && router.push({ pathname: '/result', params: { text: t.trim() } });
  const paste = async () => setText(await Clipboard.getStringAsync());

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Is this message a scam?</Text>
        <Text style={s.sub}>Paste a DM, text or link. Or share it straight to SusCheck from Discord, WhatsApp or Messages.</Text>

        <TextInput
          testID="input"
          style={s.input}
          multiline
          placeholder="Paste the message here…"
          placeholderTextColor={C.dim}
          value={text}
          onChangeText={setText}
        />
        <View style={s.row}>
          <Pressable style={[s.btn, s.ghost]} onPress={paste}>
            <Text style={s.btnText}>Paste</Text>
          </Pressable>
          <Pressable testID="check" style={[s.btn, s.main, !text.trim() && { opacity: 0.4 }]} onPress={() => go()}>
            <Text style={s.btnText}>Check it</Text>
          </Pressable>
        </View>
        <Text style={s.privacy}>🔒 Checked on your phone. Nothing is uploaded.</Text>

        <Text style={s.h}>Try a real scam</Text>
        {EXAMPLES.map((e) => (
          <Pressable key={e} style={s.example} onPress={() => go(e)}>
            <Text style={s.exampleText} numberOfLines={2}>
              {e}
            </Text>
          </Pressable>
        ))}

        <Text style={s.h}>Get sharper</Text>
        <Pressable style={[s.feature, { borderColor: C.accent }]} onPress={() => router.push('/lab')}>
          <Text style={s.featureTitle}>🧪 Scam Lab {pro ? '' : '· 3 free rounds'}</Text>
          <Text style={s.featureSub}>Swipe real scam patterns vs real messages. Learn to spot them before anyone has to.</Text>
        </Pressable>
        <View style={s.row}>
          <Pressable style={[s.feature, s.half]} onPress={() => router.push('/history')}>
            <Text style={s.featureTitle}>🕘 History</Text>
            <Text style={s.featureSub}>{pro ? 'Your past checks' : 'Pro'}</Text>
          </Pressable>
          <Pressable style={[s.feature, s.half]} onPress={() => router.push('/pro')}>
            <Text style={s.featureTitle}>{pro ? '⭐ Pro active' : '⭐ Go Pro'}</Text>
            <Text style={s.featureSub}>{pro ? 'Manage plan' : 'Checking stays free forever'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 48, gap: 12 },
  title: { color: C.text, fontSize: 30, fontWeight: '900', marginTop: 4 },
  sub: { color: C.dim, fontSize: 15, lineHeight: 21 },
  input: {
    minHeight: 130,
    backgroundColor: C.card,
    color: C.text,
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: C.line,
  },
  row: { flexDirection: 'row', gap: 10 },
  btn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  ghost: { flex: 1, backgroundColor: C.cardHi },
  main: { flex: 2, backgroundColor: C.accent },
  btnText: { color: C.accentText, fontSize: 17, fontWeight: '800' },
  privacy: { color: C.dim, fontSize: 13, textAlign: 'center' },
  h: { color: C.dim, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 10 },
  example: { backgroundColor: C.card, borderRadius: 14, padding: 14 },
  exampleText: { color: C.text, fontSize: 14 },
  feature: { backgroundColor: C.card, borderRadius: 18, padding: 16, gap: 4, borderWidth: 1, borderColor: C.line },
  half: { flex: 1 },
  featureTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  featureSub: { color: C.dim, fontSize: 13, lineHeight: 18 },
});
