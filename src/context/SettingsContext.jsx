import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../utilities/storage';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings());

  // Apply theme attributes to <html>
  useEffect(() => {
    const root = document.documentElement;
    let activeTheme = settings.theme;

    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeTheme = prefersDark ? 'dark' : 'light';
    }

    root.setAttribute('data-theme', activeTheme);
    root.setAttribute('data-board-theme', settings.boardTheme);
    saveSettings(settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
  };

  const applyPreset = (preset) => {
    setSettings((prev) => {
      if (preset === 'beginner') {
        return {
          ...prev,
          assistancePreset: 'beginner',
          showLegalMoves: true,
          showCaptureSquares: true,
          showPieceAttackSquares: true,
          highlightSelectedPiece: true,
          highlightLastMove: true,
          checkWarning: true,
          checkmateAnimation: true,
          learningMode: true,
          moveSuggestions: true,
          pieceValueDisplay: true,
          showThreatenedSquares: true,
          showDefendedSquares: true,
          showCoordinates: true
        };
      } else if (preset === 'advanced') {
        return {
          ...prev,
          assistancePreset: 'advanced',
          showLegalMoves: false,
          showCaptureSquares: false,
          showPieceAttackSquares: false,
          highlightSelectedPiece: true,
          highlightLastMove: true,
          checkWarning: true,
          checkmateAnimation: true,
          learningMode: false,
          moveSuggestions: false,
          pieceValueDisplay: false,
          showThreatenedSquares: false,
          showDefendedSquares: false,
          showCoordinates: true
        };
      }
      return prev;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, applyPreset, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
