// RevenueCat: one entitlement ("pro"), sold as monthly/annual subscriptions through the default offering,
// shown with a RevenueCat Paywall. Checking messages never needs Pro.
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, type CustomerInfo } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

export const ENTITLEMENT = 'pro';
const API_KEY = process.env.EXPO_PUBLIC_RC_API_KEY ?? '';

let configured = false;

export function initPurchases() {
  if (configured || !API_KEY || Platform.OS === 'web') return;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.INFO);
  Purchases.configure({ apiKey: API_KEY });
  configured = true;
}

export const purchasesReady = () => configured;

const isPro = (info: CustomerInfo | null) => !!info?.entitlements.active[ENTITLEMENT];

// Live Pro status. Updates the moment a purchase, restore or expiry happens.
export function usePro() {
  const [pro, setPro] = useState(false);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    let alive = true;
    const listener = (info: CustomerInfo) => alive && setPro(isPro(info));
    Purchases.getCustomerInfo()
      .then((info) => alive && setPro(isPro(info)))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      alive = false;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  return { pro, loading };
}

// Shows the paywall only if the user doesn't have Pro yet. Returns true if they have Pro afterwards.
export async function unlockPro(): Promise<boolean> {
  if (!configured) return false;
  const result = await RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: ENTITLEMENT });
  return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED || result === PAYWALL_RESULT.NOT_PRESENTED;
}

export async function manageSubscription() {
  if (configured) await RevenueCatUI.presentCustomerCenter();
}

export async function restore(): Promise<boolean> {
  if (!configured) return false;
  return isPro(await Purchases.restorePurchases());
}
