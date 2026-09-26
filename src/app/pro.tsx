import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { manageSubscription, purchasesReady, restore, unlockPro, usePro } from '../lib/purchases';
import { C } from '../lib/theme';

const FREE = ['Unlimited message and link checks', 'Share-to-check from any app', 'Help screen for threats and sextortion'];
const PRO = ['Unlimited Scam Lab training', 'Check history on your phone', 'Keeps SusCheck free for everyone else'];

export default function Pro() {
  const { pro } = usePro();

  const onRestore = async () => {
    const ok = await restore();
    Alert.alert(ok ? 'Pro restored' : 'Nothing to restore', ok ? 'Welcome back!' : 'No Pro purchase found on this account.');
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.title}>{pro ? '⭐ You have Pro' : 'Checking is free. Forever.'}</Text>
      <Text style={s.sub}>
        Safety shouldn't be behind a paywall, so every check is free. Pro is for people who want to train up and keep a record.
      </Text>

      <View style={s.card}>
        <Text style={s.h}>Free</Text>
        {FREE.map((f) => (
          <Text key={f} style={s.item}>
            ✓ {f}
          </Text>
        ))}
      </View>
      <View style={[s.card, { borderColor: C.accent }]}>
        <Text style={[s.h, { color: C.accent }]}>Pro</Text>
        {PRO.map((f) => (
          <Text key={f} style={s.item}>
            ⭐ {f}
          </Text>
        ))}
      </View>

      {!purchasesReady() && <Text style={s.note}>Purchases aren't set up in this build.</Text>}
      {pro ? (
        <Pressable style={s.btn} onPress={manageSubscription}>
          <Text style={s.btnText}>Manage my plan</Text>
        </Pressable>
      ) : (
        <Pressable testID="go-pro" style={s.btn} onPress={unlockPro}>
          <Text style={s.btnText}>See Pro plans</Text>
        </Pressable>
      )}
      <Pressable onPress={onRestore}>
        <Text style={s.link}>Restore purchases</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 20, gap: 14 },
  title: { color: C.text, fontSize: 28, fontWeight: '900' },
  sub: { color: C.dim, fontSize: 15, lineHeight: 21 },
  card: { backgroundColor: C.card, borderRadius: 18, padding: 16, gap: 8, borderWidth: 1, borderColor: C.line },
  h: { color: C.dim, fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  item: { color: C.text, fontSize: 16 },
  btn: { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 17, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '900' },
  link: { color: C.dim, textAlign: 'center', fontSize: 14, padding: 8 },
  note: { color: '#FFB020', textAlign: 'center' },
});
