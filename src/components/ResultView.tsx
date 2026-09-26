import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import type { CheckResult } from '../engine/check';
import { C, VERDICT } from '../lib/theme';

const HELP = [
  { label: 'Childline: call 0800 1111 (free)', url: 'tel:08001111' },
  { label: 'Report Remove: get images taken down', url: 'https://www.childline.org.uk/info-advice/bullying-abuse-safety/online-mobile-safety/remove-nude-image-shared-online/' },
  { label: 'Report to CEOP (police)', url: 'https://www.ceop.police.uk/Safety-Centre/' },
];

export function ResultView({ text, result, onAgain }: { text: string; result: CheckResult; onAgain: () => void }) {
  const v = VERDICT[result.verdict];

  const warnFriend = () =>
    Share.share({
      message:
        result.verdict === 'clear'
          ? 'I checked a message with SusCheck before replying. Check yours too.'
          : `Heads up: I got a ${v.label.toLowerCase()} message. ${result.flags[0]?.reason ?? ''} Don't click links like this. (Checked with SusCheck)`,
    });

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <View style={[s.hero, { backgroundColor: v.tint, borderColor: v.color }]} testID="verdict">
        <Text style={s.emoji}>{v.emoji}</Text>
        <Text style={[s.label, { color: v.color }]}>{v.label}</Text>
        <Text style={s.line}>{v.line}</Text>
        {result.verdict !== 'get-help' && (
          <View style={s.meter}>
            <View style={[s.fill, { width: `${Math.max(result.score, 4)}%`, backgroundColor: v.color }]} />
          </View>
        )}
        {result.verdict !== 'get-help' && <Text style={s.score}>Scam score {result.score}/100</Text>}
      </View>

      {result.verdict === 'get-help' &&
        HELP.map((h) => (
          <Pressable key={h.url} style={[s.btn, { backgroundColor: v.color }]} onPress={() => Linking.openURL(h.url)}>
            <Text style={s.btnText}>{h.label}</Text>
          </Pressable>
        ))}

      {result.flags.length > 0 && <Text style={s.h}>Why</Text>}
      {result.flags.map((f, i) => (
        <View key={i} style={s.card}>
          <Text style={s.reason}>{f.reason}</Text>
          {!!f.evidence && <Text style={s.evidence}>“{f.evidence}”</Text>}
        </View>
      ))}

      <Text style={s.h}>What to do</Text>
      {result.advice.map((a, i) => (
        <Text key={i} style={s.advice}>
          • {a}
        </Text>
      ))}

      <Text style={s.h}>The message</Text>
      <Text style={s.quote} numberOfLines={6}>
        {text}
      </Text>

      <View style={s.row}>
        <Pressable style={[s.btn, s.half, { backgroundColor: C.cardHi }]} onPress={onAgain}>
          <Text style={s.btnText}>Check another</Text>
        </Pressable>
        <Pressable style={[s.btn, s.half, { backgroundColor: C.accent }]} onPress={warnFriend}>
          <Text style={s.btnText}>Warn a friend</Text>
        </Pressable>
      </View>
      <Text style={s.small}>Checked on your phone. Your message was never uploaded anywhere.</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 48, gap: 10 },
  hero: { borderWidth: 2, borderRadius: 24, padding: 22, alignItems: 'center', gap: 6 },
  emoji: { fontSize: 56 },
  label: { fontSize: 38, fontWeight: '900', letterSpacing: 0.5 },
  line: { color: C.text, fontSize: 16, textAlign: 'center' },
  meter: { alignSelf: 'stretch', height: 10, borderRadius: 5, backgroundColor: '#00000055', marginTop: 10, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 5 },
  score: { color: C.dim, fontSize: 13 },
  h: { color: C.dim, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 14, gap: 6 },
  reason: { color: C.text, fontSize: 16, lineHeight: 22 },
  evidence: { color: C.dim, fontSize: 14, fontStyle: 'italic' },
  advice: { color: C.text, fontSize: 16, lineHeight: 23 },
  quote: { color: C.dim, fontSize: 14, backgroundColor: C.card, padding: 12, borderRadius: 12 },
  row: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { borderRadius: 16, paddingVertical: 15, paddingHorizontal: 16, alignItems: 'center' },
  half: { flex: 1 },
  btnText: { color: C.accentText, fontSize: 16, fontWeight: '800' },
  small: { color: C.dim, fontSize: 12, textAlign: 'center', marginTop: 8 },
});
