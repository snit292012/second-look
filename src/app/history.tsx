import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { clearHistory, loadHistory, type HistoryItem } from '../lib/history';
import { unlockPro, usePro } from '../lib/purchases';
import { C, VERDICT } from '../lib/theme';

export default function History() {
  const { pro } = usePro();
  const [items, setItems] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory().then(setItems);
    }, []),
  );

  if (!pro)
    return (
      <View style={s.center}>
        <Text style={s.big}>🕘</Text>
        <Text style={s.title}>Keep a record of what you checked</Text>
        <Text style={s.sub}>Handy when you need to show a parent, teacher or the police what someone sent. Saved only on this phone.</Text>
        <Pressable style={[s.btn, { alignSelf: 'stretch' }]} onPress={unlockPro}>
          <Text style={s.btnText}>Unlock with Pro</Text>
        </Pressable>
      </View>
    );

  return (
    <FlatList
      contentContainerStyle={{ padding: 20, gap: 10 }}
      data={items}
      keyExtractor={(it) => String(it.at)}
      ListEmptyComponent={<Text style={s.sub}>No checks yet. Everything you check from now on shows up here.</Text>}
      ListFooterComponent={
        items.length ? (
          <Pressable onPress={() => clearHistory().then(() => setItems([]))}>
            <Text style={[s.sub, { marginTop: 12 }]}>Clear history</Text>
          </Pressable>
        ) : null
      }
      renderItem={({ item }) => {
        const v = VERDICT[item.verdict];
        return (
          <View style={[s.row, { borderLeftColor: v.color }]}>
            <Text style={[s.verdict, { color: v.color }]}>
              {v.emoji} {v.label} · {new Date(item.at).toLocaleString()}
            </Text>
            <Text style={s.text} numberOfLines={2}>
              {item.text}
            </Text>
          </View>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  center: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 14 },
  big: { fontSize: 64 },
  title: { color: C.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  sub: { color: C.dim, fontSize: 15, lineHeight: 21, textAlign: 'center' },
  btn: { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  row: { backgroundColor: C.card, borderRadius: 14, padding: 14, borderLeftWidth: 4, gap: 4 },
  verdict: { fontWeight: '800', fontSize: 13 },
  text: { color: C.text, fontSize: 15 },
});
