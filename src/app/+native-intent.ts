import { getShareExtensionKey } from 'expo-share-intent';

// When a message is shared into Second Look from another app, open the result screen straight away.
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    if (path.includes(`dataUrl=${getShareExtensionKey()}`)) return '/shareintent';
    return path;
  } catch {
    return '/';
  }
}
