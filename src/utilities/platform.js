import { Capacitor } from '@capacitor/core';

export const isNativeApp = () => {
  try {
    if (typeof window !== 'undefined' && window.location.protocol === 'capacitor:') {
      return true;
    }
    return Capacitor.isNativePlatform();
  } catch (e) {
    return false;
  }
};