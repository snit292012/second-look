import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { check } from '../engine/check';
import { DECK } from '../lab/deck';
import { unlockPro, usePro } from '../lib/purchases';
import { C, VERDICT } from '../lib/theme';

const FREE_ROUNDS = 3;
const todayKey = () => `secondlook.lab.${new Date().toISOString().slice(0, 10)}`;

function shuffled<T>(xs: T[]) {
  return [...xs].sort(() => Math.random() - 0.5);
}

export default function Lab() {
  const { pro } = usePro();
  const deck = useMemo(() => shuffled(DECK), []);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [playedToday, setPlayedToday] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(todayKey()).then((v) => setPlayedToday(Number(v ?? 0)));
  }, []);

  const card = deck[i % deck.length];
  // Lock only between rounds, so the explanation for the last free answer is still shown.
  const locked = !pro && playedToday >= FREE_ROUNDS && picked === null;
  const lesson = useMemo(() => check(card.text), [card]);

  const answer = async (saysScam: boolean) => {
    const right = saysScam === card.scam;
    setPicked(saysScam);
    setScore((x) => x + (right ? 1 : 0));
    setStreak((x) => (right ? x + 1 : 0));
    if (!pro) {
      const n = playedToday + 1;
      setPlayedToday(n);
      await AsyncStorage.setItem(todayKey(), String(n));
    }
  };

  const next = () => {
    setPicked(null);
    setI((x) => x + 1);
  };

  if (locked)
    return (
      <View style={s.center}>
        <Text style={s.big}>🧪</Text>
        <Text style={s.title}>That's today's 3 free rounds</Text>
        <Text style={s.sub}>
          Pro unlocks unlimited Scam Lab, your check history, and supports keeping Second Look free for everyone who just needs a quick check.
        </Text>
        <Pressable testID="unlock" style={[s.btn, { backgroundColor: C.accent, alignSelf: 'stretch' }]} onPress={unlockPro}>
          <Text style={s.btnText}>Unlock Scam Lab</Text>
        </Pressable>
        <Text style={s.small}>Score today: {score}</Text>
      </View>
    );

  const right = picked !== null && picked === card.scam;
  const v = VERDICT[card.scam ? lesson.verdict : 'clear'];

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <View style={s.stats}>
        <Text style={s.stat}>Score {score}</Text>
        <Text style={s.stat}>🔥 {streak}</Text>
        {!pro && <Text style={s.stat}>{Math.max(FREE_ROUNDS - playedToday, 0)} free left</Text>}
      </View>

      <View style={s.card}>
        <Text style={s.from}>{card.from}</Text>
        <Text style={s.msg}>{card.text}</Text>
      </View>

      {picked === null ? (
        <View style={s.row}>
          <Pressable testID="legit" style={[s.btn, s.half, { backgroundColor: '#1F7A4C' }]} onPress={() => answer(false)}>
            <Text style={s.btnText}>✅ Legit</Text>
          </Pressable>
          <Pressable testID="scam" style={[s.btn, s.half, { backgroundColor: '#B3263A' }]} onPress={() => answer(true)}>
            <Text style={s.btnText}>🚩 Scam</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <Text style={[s.title, { color: right ? '#2BD67B' : '#FF4D5E' }]}>{right ? 'Correct!' : 'Not quite'}</Text>
          <Text style={s.sub}>
            It's {card.scam ? 'a scam' : 'legit'}. {card.tip}
          </Text>
          {card.scam &&
            lesson.flags.slice(0, 2).map((f, k) => (
              <View key={k} style={[s.flag, { borderColor: v.color }]}>
                <Text style={s.flagText}>{f.reason}</Text>
              </View>
            ))}
          <Pressable testID="next" style={[s.btn, { backgroundColor: C.accent }]} onPress={next}>
            <Text style={s.btnText}>Next</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 20, gap: 16 },
  center: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 14 },
  big: { fontSize: 64 },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { color: C.dim, fontSize: 15, fontWeight: '700' },
  card: { backgroundColor: C.card, borderRadius: 22, padding: 20, gap: 10, borderWidth: 1, borderColor: C.line, minHeight: 170 },
  from: { color: C.accent, fontWeight: '800', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  msg: { color: C.text, fontSize: 19, lineHeight: 27 },
  row: { flexDirection: 'row', gap: 12 },
  btn: { borderRadius: 16, paddingVertical: 17, alignItems: 'center' },
  half: { flex: 1 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  title: { color: C.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  sub: { color: C.text, fontSize: 16, lineHeight: 23, textAlign: 'center' },
  flag: { borderLeftWidth: 4, backgroundColor: C.card, borderRadius: 10, padding: 12 },
  flagText: { color: C.text, fontSize: 14, lineHeight: 20 },
  small: { color: C.dim, fontSize: 13 },
});
