import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ResultView } from '../components/ResultView';
import { check } from '../engine/check';
import { addHistory } from '../lib/history';
import { usePro } from '../lib/purchases';

export default function Result() {
  const { text = '' } = useLocalSearchParams<{ text: string }>();
  const router = useRouter();
  const { pro } = usePro();
  const result = useMemo(() => check(text), [text]);

  useEffect(() => {
    if (pro && text) addHistory({ at: Date.now(), text, verdict: result.verdict, score: result.score });
  }, [pro, text, result]);

  return <ResultView text={text} result={result} onAgain={() => router.back()} />;
}
