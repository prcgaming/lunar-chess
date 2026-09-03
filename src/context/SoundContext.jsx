import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { soundSynthesizer } from '../sounds/soundSynthesizer';
import { useSettings } from './SettingsContext';
import { useHaptics } from '../hooks/useHaptics';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const { settings } = useSettings();
  const { triggerHaptic } = useHaptics(settings.vibration);

  useEffect(() => {
    soundSynthesizer.setVolume(settings.soundVolume);
    soundSynthesizer.setMuted(!settings.soundEnabled);
  }, [settings.soundVolume, settings.soundEnabled]);

  const playSound = useCallback((event) => {
    if (!settings.soundEnabled) return;

    switch (event) {
      case 'move':
        if (settings.moveSound) {
          soundSynthesizer.playMove();
          triggerHaptic('light');
        }
        break;
      case 'capture':
        if (settings.captureSound) {
          soundSynthesizer.playCapture();
          triggerHaptic('medium');
        }
        break;
      case 'check':
        if (settings.checkSound) {
          soundSynthesizer.playCheck();
          triggerHaptic('check');
        }
        break;
      case 'checkmate':
        if (settings.checkmateSound) {
          soundSynthesizer.playCheckmate();
          triggerHaptic('checkmate');
        }
        break;
      case 'victory':
        if (settings.victorySound) {
          soundSynthesizer.playVictory();
          triggerHaptic('heavy');
        }
        break;
      case 'click':
        soundSynthesizer.playClick();
        triggerHaptic('light');
        break;
      default:
        break;
    }
  }, [settings, triggerHaptic]);

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
