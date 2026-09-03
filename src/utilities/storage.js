// LocalStorage Persistence Utilities

const SETTINGS_KEY = 'lunar_chess_settings';
const ACTIVE_GAME_KEY = 'lunar_chess_active_game';
const COMPLETED_LESSONS_KEY = 'lunar_chess_completed_lessons';

export const DEFAULT_SETTINGS = {
  // Appearance (Classic chess defaults)
  theme: 'classic', // 'classic' | 'dark' | 'light' | 'system'
  boardTheme: 'classic', // 'classic', 'emerald', 'wood', 'slate'
  pieceStyle: '3d-wood', // '2d-standard', '2d-alpha', '3d-wood', '3d-gold'
  animationSpeed: 'normal',
  showCoordinates: true,

  // Audio & Haptics
  soundEnabled: true,
  soundVolume: 0.7,
  moveSound: true,
  captureSound: true,
  checkSound: true,
  checkmateSound: true,
  victorySound: true,
  vibration: true,

  // Gameplay Assistance Switches
  showLegalMoves: true,
  showCaptureSquares: true,
  showPieceAttackSquares: false,
  highlightSelectedPiece: true,
  highlightLastMove: true,
  checkWarning: true,
  checkmateAnimation: true,
  learningMode: false,
  moveSuggestions: true,
  confirmBeforeMove: false,
  autoQueenPromotion: false,
  showThreatenedSquares: false,
  showDefendedSquares: false,
  pieceValueDisplay: true,
  assistancePreset: 'beginner'
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function saveActiveGame(gameState) {
  try {
    if (!gameState) {
      localStorage.removeItem(ACTIVE_GAME_KEY);
    } else {
      localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(gameState));
    }
  } catch (e) {
    console.warn('Failed to save active game:', e);
  }
}

export function loadActiveGame() {
  try {
    const raw = localStorage.getItem(ACTIVE_GAME_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load active game:', e);
    return null;
  }
}

export function clearActiveGame() {
  try {
    localStorage.removeItem(ACTIVE_GAME_KEY);
  } catch (e) {
    console.warn('Failed to clear active game:', e);
  }
}

export function getCompletedLessons() {
  try {
    const raw = localStorage.getItem(COMPLETED_LESSONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markLessonCompleted(lessonId) {
  try {
    const existing = getCompletedLessons();
    if (!existing.includes(lessonId)) {
      const updated = [...existing, lessonId];
      localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(updated));
      return updated;
    }
    return existing;
  } catch {
    return [];
  }
}