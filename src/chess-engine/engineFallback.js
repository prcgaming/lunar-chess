// High-Performance Classical Chess Engine
// Features Grandmaster Opening Book, Alpha-Beta Pruning, MVV-LVA Move Ordering & PST Evaluation
// Tuned for sub-300ms response time on mobile and desktop.

import { Chess } from 'chess.js';

// Material weights in centipawns
const PIECE_WEIGHTS = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece-Square Tables (PST) for positional evaluation
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
 -50,-40,-30,-30,-30,-30,-40,-50,
 -40,-20,  0,  0,  0,  0,-20,-40,
 -30,  0, 10, 15, 15, 10,  0,-30,
 -30,  5, 15, 20, 20, 15,  5,-30,
 -30,  0, 15, 20, 20, 15,  0,-30,
 -30,  5, 10, 15, 15, 10,  5,-30,
 -40,-20,  0,  5,  5,  0,-20,-40,
 -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
 -20,-10,-10,-10,-10,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5, 10, 10,  5,  0,-10,
 -10,  5,  5, 10, 10,  5,  5,-10,
 -10,  0, 10, 10, 10, 10,  0,-10,
 -10, 10, 10, 10, 10, 10, 10,-10,
 -10,  5,  0,  0,  0,  0,  5,-10,
 -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
 -20,-10,-10, -5, -5,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
   0,  0,  5,  5,  5,  5,  0, -5,
 -10,  5,  5,  5,  5,  5,  0,-10,
 -10,  0,  5,  0,  0,  0,  0,-10,
 -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE = [
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -20,-30,-30,-40,-40,-30,-30,-20,
 -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

// Grandmaster Opening Book for instant 0ms responses
const OPENING_BOOK = {
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': ['e2e4', 'd2d4', 'g1f3', 'c2c4'],
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1': ['e7e5', 'c7c5', 'e7e6', 'c7c6'],
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1': ['d7d5', 'g8f6', 'e7e6', 'c7c5'],
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': ['g1f3', 'f1c4', 'b1c3', 'f2f4'],
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': ['g1f3', 'b1c3', 'c2c3', 'd2d4'],
  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3': ['f1b5', 'f1c4', 'd2d4', 'b1c3'],
  'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3': ['g8f6', 'f8c5'],
  'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4': ['d2d3', 'd2d4', 'e1g1']
};

function getPstScore(type, square, isWhite) {
  const index = isWhite ? square : (63 - square);
  switch (type) {
    case 'p': return PAWN_TABLE[index];
    case 'n': return KNIGHT_TABLE[index];
    case 'b': return BISHOP_TABLE[index];
    case 'r': return ROOK_TABLE[index];
    case 'q': return QUEEN_TABLE[index];
    case 'k': return KING_TABLE[index];
    default: return 0;
  }
}

// Ultra-fast Board Evaluator: reads board grid directly, avoids heavy draw checking
export function evaluateBoard(game) {
  let score = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const sq = r * 8 + c;
        const val = PIECE_WEIGHTS[piece.type] + getPstScore(piece.type, sq, piece.color === 'w');
        score += piece.color === 'w' ? val : -val;
      }
    }
  }

  return score;
}

// MVV-LVA Move Ordering (Most Valuable Victim - Least Valuable Attacker)
function scoreMove(move) {
  let score = 0;
  if (move.captured) {
    score += PIECE_WEIGHTS[move.captured] * 10 - PIECE_WEIGHTS[move.piece];
  }
  if (move.promotion) {
    score += 800;
  }
  if (move.san && move.san.includes('+')) {
    score += 120;
  }
  return score;
}

function orderMoves(moves) {
  return moves.sort((a, b) => scoreMove(b) - scoreMove(a));
}

// Alpha-Beta Search with Branch Pruning
function minimax(game, depth, alpha, beta, isMaximizing, maxBranch) {
  if (depth === 0) {
    return evaluateBoard(game);
  }

  const rawMoves = game.moves({ verbose: true });
  if (rawMoves.length === 0) {
    if (game.inCheck()) return isMaximizing ? -99999 : 99999;
    return 0; // Stalemate
  }

  orderMoves(rawMoves);
  const moves = maxBranch && rawMoves.length > maxBranch ? rawMoves.slice(0, maxBranch) : rawMoves;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const ev = minimax(game, depth - 1, alpha, beta, false, maxBranch);
      game.undo();
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const ev = minimax(game, depth - 1, alpha, beta, true, maxBranch);
      game.undo();
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function findBestMove(fen, difficulty = 'medium') {
  const game = new Chess(fen);
  const rawMoves = game.moves({ verbose: true });
  if (rawMoves.length === 0) return null;

  // 1. Instant Grandmaster Opening Book Check (0ms response)
  if (OPENING_BOOK[fen]) {
    const bookUcis = OPENING_BOOK[fen];
    for (const uci of bookUcis) {
      const from = uci.substring(0, 2);
      const to = uci.substring(2, 4);
      const matched = rawMoves.find(m => m.from === from && m.to === to);
      if (matched) return matched;
    }
  }

  // 2. Beginner & Easy Blunder Logic
  if (difficulty === 'beginner' && Math.random() < 0.65) {
    return rawMoves[Math.floor(Math.random() * rawMoves.length)];
  }
  if (difficulty === 'easy' && Math.random() < 0.35) {
    return rawMoves[Math.floor(Math.random() * rawMoves.length)];
  }

  // 3. Difficulty Parameters (Balanced for instant speed & strategic strength)
  const configMap = {
    beginner: { depth: 1, candidates: 6,  branch: 4 },
    easy:     { depth: 1, candidates: 8,  branch: 5 },
    medium:   { depth: 2, candidates: 10, branch: 6 },
    hard:     { depth: 2, candidates: 12, branch: 8 },
    expert:   { depth: 2, candidates: 14, branch: 10 },
    master:   { depth: 3, candidates: 10, branch: 6 }
  };

  const config = configMap[difficulty] || configMap.medium;
  const isWhite = game.turn() === 'w';

  orderMoves(rawMoves);
  const candidates = rawMoves.slice(0, config.candidates);

  let bestMove = candidates[0];
  let bestEval = isWhite ? -Infinity : Infinity;

  for (const move of candidates) {
    game.move(move);
    const ev = minimax(game, config.depth - 1, -Infinity, Infinity, !isWhite, config.branch);
    game.undo();

    if (isWhite) {
      if (ev > bestEval) {
        bestEval = ev;
        bestMove = move;
      }
    } else {
      if (ev < bestEval) {
        bestEval = ev;
        bestMove = move;
      }
    }
  }

  return bestMove;
}