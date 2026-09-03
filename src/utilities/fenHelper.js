import { PIECE_VALUES } from '../chess-engine/chessConstants';

export function calculateCapturedPieces(fen) {
  const defaultPieces = {
    p: 8, n: 2, b: 2, r: 2, q: 1
  };

  const currentWhitePieces = { p: 0, n: 0, b: 0, r: 0, q: 0 };
  const currentBlackPieces = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  const boardPart = fen.split(' ')[0];
  for (const char of boardPart) {
    const lower = char.toLowerCase();
    if (['p', 'n', 'b', 'r', 'q'].includes(lower)) {
      if (char === char.toUpperCase()) {
        currentWhitePieces[lower]++;
      } else {
        currentBlackPieces[lower]++;
      }
    }
  }

  // Pieces captured from White (Black captured them)
  const capturedFromWhite = [];
  // Pieces captured from Black (White captured them)
  const capturedFromBlack = [];

  ['p', 'n', 'b', 'r', 'q'].forEach((p) => {
    const missingWhite = Math.max(0, defaultPieces[p] - currentWhitePieces[p]);
    const missingBlack = Math.max(0, defaultPieces[p] - currentBlackPieces[p]);

    for (let i = 0; i < missingWhite; i++) {
      capturedFromWhite.push({ type: p, color: 'w', value: PIECE_VALUES[p] });
    }
    for (let i = 0; i < missingBlack; i++) {
      capturedFromBlack.push({ type: p, color: 'b', value: PIECE_VALUES[p] });
    }
  });

  // Calculate material difference
  const whiteTotalValue = Object.entries(currentWhitePieces).reduce(
    (acc, [piece, count]) => acc + count * PIECE_VALUES[piece], 0
  );
  const blackTotalValue = Object.entries(currentBlackPieces).reduce(
    (acc, [piece, count]) => acc + count * PIECE_VALUES[piece], 0
  );

  const whiteAdvantage = whiteTotalValue - blackTotalValue;

  return {
    whiteCaptured: capturedFromBlack, // Pieces taken by White
    blackCaptured: capturedFromWhite, // Pieces taken by Black
    whiteScore: whiteTotalValue,
    blackScore: blackTotalValue,
    advantage: whiteAdvantage // >0 means White is ahead, <0 means Black is ahead
  };
}

export function getKingSquare(game, color) {
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === color) {
        const file = String.fromCharCode('a'.charCodeAt(0) + c);
        const rank = 8 - r;
        return `${file}${rank}`;
      }
    }
  }
  return null;
}
