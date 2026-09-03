// Vibration & Haptic feedback hook
export function vibrate(pattern = 20) {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof window.navigator.vibrate === 'function') {
    try {
      window.navigator.vibrate(pattern);
    } catch {
      // Ignore if device restricts vibration
    }
  }
}

export function useHaptics(vibrationEnabled = true) {
  const triggerHaptic = (type = 'light') => {
    if (!vibrationEnabled) return;
    switch (type) {
      case 'light':
        vibrate(15);
        break;
      case 'medium':
        vibrate(30);
        break;
      case 'heavy':
        vibrate([40, 20, 40]);
        break;
      case 'check':
        vibrate([30, 40, 60]);
        break;
      case 'checkmate':
        vibrate([80, 50, 80, 50, 150]);
        break;
      default:
        vibrate(20);
    }
  };

  return { triggerHaptic };
}
