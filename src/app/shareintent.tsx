import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';
import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { ResultView } from '../components/ResultView';
import { check } from '../engine/check';
import { addHistory } from '../lib/history';
import { usePro } from '../lib/purchases';
import { C } from '../lib/theme';

// Opened when someone shares a message or link to Second Look from another app.
export default function SharedResult() {
  const router = useRouter();
  const { shareIntent, resetShareIntent } = useShareIntentContext();
  const { pro } = usePro();
  const text = (shareIntent.text || shareIntent.webUrl || '').trim();
  const result = useMemo(() => check(text), [text]);

  useEffect(() => {
    if (pro && text) addHistory({ at: Date.now(), text, verdict: result.verdict, score: result.score });
  }, [pro, text, result]);

  if (!text)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: C.dim, fontSize: 16, textAlign: 'center' }}>Share some text or a link to check it.</Text>
      </View>
    );

  return (
    <ResultView
      text={text}
      result={result}
      onAgain={() => {
        resetShareIntent();
        router.replace('/');
      }}
    />
  );
}
