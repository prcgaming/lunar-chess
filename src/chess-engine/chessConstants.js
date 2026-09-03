export const DIFFICULTY_LEVELS = {
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    elo: 400,
    depth: 1,
    description: 'Casual player learning the basics. Makes frequent blunders.',
    color: '#538d4e',
    blunderRate: 0.65,
    movetime: 200
  },
  easy: {
    id: 'easy',
    name: 'Easy',
    elo: 800,
    depth: 2,
    description: 'Understands basic captures and simple moves. Occasional mistakes.',
    color: '#0284c7',
    blunderRate: 0.35,
    movetime: 400
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    elo: 1200,
    depth: 4,
    description: 'Solid club player. Knows openings and simple tactical combinations.',
    color: '#3b82f6',
    blunderRate: 0.15,
    movetime: 600
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    elo: 1600,
    depth: 6,
    description: 'Advanced tournament player. Strong tactical and positional play.',
    color: '#8b5cf6',
    blunderRate: 0.04,
    movetime: 900
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    elo: 2000,
    depth: 8,
    description: 'Candidate Master level. Punishes any inaccuracy immediately.',
    color: '#d97706',
    blunderRate: 0.0,
    movetime: 1200
  },
  master: {
    id: 'master',
    name: 'Master',
    elo: 2400,
    depth: 12,
    description: 'Grandmaster strength engine. Relentless calculation and strategy.',
    color: '#dc2626',
    blunderRate: 0.0,
    movetime: 1600
  }
};

export const TIME_CONTROLS = [
  { id: '1m', name: '1 Min Bullet', seconds: 60, icon: 'Zap' },
  { id: '3m', name: '3 Min Blitz', seconds: 180, icon: 'Flame' },
  { id: '5m', name: '5 Min Blitz', seconds: 300, icon: 'Timer' },
  { id: '10m', name: '10 Min Rapid', seconds: 600, icon: 'Clock' },
  { id: '15m', name: '15 Min Rapid', seconds: 900, icon: 'Hourglass' },
  { id: '30m', name: '30 Min Classical', seconds: 1800, icon: 'Shield' },
  { id: 'unlimited', name: 'Unlimited', seconds: null, icon: 'Infinity' }
];

export const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

export const BOARD_THEMES = [
  { id: 'emerald', name: 'Tournament Green & Ivory (Pop)', light: '#eeeed2', dark: '#769656' },
  { id: 'classic', name: 'Walnut & Maple Wood (Pop)', light: '#f0d9b5', dark: '#b58863' },
  { id: 'wood', name: 'Warm Oak & Mahogany', light: '#e8d0aa', dark: '#9c663b' },
  { id: 'slate', name: 'Ocean Blue & Slate (Pop)', light: '#dee3e6', dark: '#4e79a7' }
];

export const PIECE_STYLES = [
  { id: '2d-standard', name: '2D Classic Tournament' },
  { id: '2d-alpha', name: '2D Modern Alpha' },
  { id: '3d-wood', name: '3D Carved Wood (3D)' },
  { id: '3d-gold', name: '3D Obsidian & Royal Gold (3D)' }
];