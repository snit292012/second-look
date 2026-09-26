import { Stack, useRouter } from 'expo-router';
import { ShareIntentProvider } from 'expo-share-intent';
import { StatusBar } from 'expo-status-bar';
import { initPurchases } from '../lib/purchases';
import { C } from '../lib/theme';

initPurchases();

export default function Layout() {
  const router = useRouter();
  return (
    <ShareIntentProvider options={{ resetOnBackground: true, onResetShareIntent: () => router.replace('/') }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.bg },
          headerTintColor: C.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: C.bg },
          headerTitleStyle: { fontWeight: '800' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'SusCheck' }} />
        <Stack.Screen name="result" options={{ title: 'Result' }} />
        <Stack.Screen name="shareintent" options={{ title: 'Result' }} />
        <Stack.Screen name="lab" options={{ title: 'Scam Lab' }} />
        <Stack.Screen name="history" options={{ title: 'History' }} />
        <Stack.Screen name="pro" options={{ title: 'SusCheck Pro' }} />
      </Stack>
    </ShareIntentProvider>
  );
}
