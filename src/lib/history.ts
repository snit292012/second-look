// Check history (a Pro feature). Stored only on this phone.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Verdict } from '../engine/check';

export type HistoryItem = { at: number; text: string; verdict: Verdict; score: number };

const KEY = 'secondlook.history.v1';
const MAX = 100;

export async function loadHistory(): Promise<HistoryItem[]> {
  try {
    return JSON.parse((await AsyncStorage.getItem(KEY)) ?? '[]');
  } catch {
    return [];
  }
}

export async function addHistory(item: HistoryItem) {
  const items = [item, ...(await loadHistory())].slice(0, MAX);
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function clearHistory() {
  await AsyncStorage.removeItem(KEY);
}
