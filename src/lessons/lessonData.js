// 23 Comprehensive Interactive Chess Lessons with Demonstrations, Practice Drills, and Mini-Quizzes

export const LESSON_CATEGORIES = [
  { id: 'fundamentals', name: 'The Basics', desc: 'Board, coordinates, and core principles' },
  { id: 'pieces', name: 'The Pieces', desc: 'How each piece moves and strikes' },
  { id: 'rules', name: 'Special Rules', desc: 'Castling, promotion, and unique chess mechanics' },
  { id: 'tactics', name: 'Tactical Weapons', desc: 'Forks, pins, skewers, and deadly combinations' },
  { id: 'strategy', name: 'Strategy & Endgames', desc: 'Checkmates, endgames, and winning techniques' }
];

export const LESSONS = [
  // 1. Chess Board
  {
    id: 'board',
    category: 'fundamentals',
    title: 'The Chess Board',
    subtitle: 'Ranks, files, and the 64 battlegrounds',
    theory: `The chess board consists of 64 alternating light and dark squares arranged in an 8×8 grid.

- **Files**: The 8 vertical columns, labeled with letters from 'a' to 'h' (from White's left to right).
- **Ranks**: The 8 horizontal rows, numbered 1 to 8 (Rank 1 is White's back row, Rank 8 is Black's back row).
- **Diagonals**: Connected slanting lines of squares of the same color.
- **Golden Rule**: Always set up the board so that there is a **white square in the bottom-right corner** ("white on right").`,
    demoFen: '4k3/8/8/4P3/8/8/8/4K3 w - - 0 1',
    practice: {
      fen: '4k3/8/8/4P3/8/8/8/4K3 w - - 0 1',
      instruction: 'The center squares (d4, d5, e4, e5) are the most crucial battlegrounds. Push the White pawn from e5 to e6 to advance further!',
      expectedMove: { from: 'e5', to: 'e6' },
      hint: 'Click the pawn on e5 and move it one square forward to e6.'
    },
    quiz: {
      question: 'Which square must always be in the bottom-right corner when setting up a chessboard?',
      options: [
        'A dark square',
        'A light/white square',
        'Any square',
        'The King square'
      ],
      correctIndex: 1,
      explanation: 'Remember the classic rule: "White on right!" The square on your bottom-right (h1 for White, a8 for Black) must always be a light square.'
    }
  },

  // 2. Coordinates
  {
    id: 'coordinates',
    category: 'fundamentals',
    title: 'Chess Coordinates',
    subtitle: 'Reading and writing the language of chess',
    theory: `Every single square on the board has a unique 2-character coordinate name, formed by combining its **file letter** (a-h) and its **rank number** (1-8).

For example:
- The bottom-left square is **a1**.
- The bottom-right square is **h1**.
- The center four squares are **d4, d5, e4, e5**.

Algebraic chess notation allows players worldwide to record games, follow master analysis, and communicate moves.`,
    demoFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    practice: {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      instruction: 'Play the most popular opening move in chess history: advance the King pawn to the e4 coordinate square.',
      expectedMove: { from: 'e2', to: 'e4' },
      hint: 'Select the pawn on e2 and move it forward two squares to e4.'
    },
    quiz: {
      question: 'What is the coordinate of the square located in file "c" on rank "6"?',
      options: ['6c', 'c6', 'file-c', 'Rank 6'],
      correctIndex: 1,
      explanation: 'Coordinates are always written with the lowercase file letter first, followed by the rank number: c6.'
    }
  },

  // 3. Pawn
  {
    id: 'pawn',
    category: 'pieces',
    title: 'The Pawn',
    subtitle: 'The soul of chess',
    theory: `Pawns are the foot soldiers of your army. Though small, pawns dictate the flow of the entire game.

- **Forward March**: Pawns only move forward, never backward!
- **Initial Double Step**: On its very first move, a pawn can advance either **1 or 2 squares** forward. After that, it can only move 1 square at a time.
- **Diagonal Capture**: Unlike any other piece, the pawn does NOT capture the way it moves. Pawns capture **one square diagonally forward**.`,
    demoFen: '4k3/8/8/8/4p3/3P4/8/4K3 w - - 0 1',
    practice: {
      fen: '4k3/8/8/8/4p3/3P4/8/4K3 w - - 0 1',
      instruction: 'Capture the black pawn on e4 diagonally with your white pawn on d3!',
      expectedMove: { from: 'd3', to: 'e4' },
      hint: 'Pawns capture one square diagonally forward. Move d3 to e4.'
    },
    quiz: {
      question: 'Can a pawn ever move backward in chess?',
      options: [
        'Yes, when capturing',
        'Yes, after promotion',
        'No, pawns can only move forward',
        'Yes, during check'
      ],
      correctIndex: 2,
      explanation: 'Pawns are the only pieces in chess that can never move backward under any circumstances!'
    }
  },

  // 4. Knight
  {
    id: 'knight',
    category: 'pieces',
    title: 'The Knight',
    subtitle: 'The tricky leaping horse',
    theory: `The Knight is the only piece on the board capable of **jumping over other pieces** (friend or foe)!

- **The "L" Shape**: A Knight moves two squares in one direction (horizontal or vertical) and then one square perpendicular.
- **Color Switcher**: A Knight always lands on a square of the opposite color from where it began!
- **Value**: 3 points (equal to a Bishop). Highly dangerous in closed, crowded positions.`,
    demoFen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    practice: {
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      instruction: 'Jump your white knight from f3 to capture the undefended black pawn on e5!',
      expectedMove: { from: 'f3', to: 'e5' },
      hint: 'The knight leaps in an L-shape: from f3 straight to e5.'
    },
    quiz: {
      question: 'If a Knight starts on a light square, what color square will it land on after one move?',
      options: [
        'Always a dark square',
        'Always a light square',
        'Either light or dark',
        'Depends on whether it jumped'
      ],
      correctIndex: 0,
      explanation: 'Due to its geometric L-shape (2+1), a Knight alternates square color with every single move.'
    }
  },

  // 5. Bishop
  {
    id: 'bishop',
    category: 'pieces',
    title: 'The Bishop',
    subtitle: 'The swift diagonal sniper',
    theory: `Each player starts with two Bishops: one Light-squared Bishop and one Dark-squared Bishop.

- **Diagonal Flight**: The Bishop can move as many unobstructed squares as desired, but **only diagonally**.
- **Bound to One Color**: A Bishop can never change square colors. A light-squared bishop stays on light squares for the entire game.
- **Value**: 3 points. At their best on open boards with long diagonals.`,
    demoFen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 3 3',
    practice: {
      fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 3 3',
      instruction: 'Play the famous Ruy Lopez Bishop attack: capture the Knight on c6 with your Bishop on b5!',
      expectedMove: { from: 'b5', to: 'c6' },
      hint: 'Move the white bishop on b5 diagonally down to take the knight on c6.'
    },
    quiz: {
      question: 'Can a dark-squared Bishop ever capture a piece resting on a light square?',
      options: [
        'Yes, with en passant',
        'No, it can only reach dark squares',
        'Yes, if it has a clear diagonal',
        'Only during checkmate'
      ],
      correctIndex: 1,
      explanation: 'A bishop is color-bound and can only travel on squares matching its original color.'
    }
  },

  // 6. Rook
  {
    id: 'rook',
    category: 'pieces',
    title: 'The Rook',
    subtitle: 'The heavy artillery',
    theory: `The Rook (often called the Castle) is a Major Piece with immense power across open ranks and files.

- **Straight Lines**: Moves any number of open squares horizontally (along ranks) or vertically (along files).
- **Endgame Monster**: Rooks shine in the endgame where open files let them invade enemy territory.
- **Value**: 5 points.`,
    demoFen: '4k3/8/8/8/8/8/8/4R1K1 w - - 0 1',
    practice: {
      fen: '4k3/8/8/8/8/8/8/4R1K1 w - - 0 1',
      instruction: 'Check the black King along the open e-file using your Rook on e1!',
      expectedMove: { from: 'e1', to: 'e8' },
      hint: 'Slide the rook straight up the e-file to e8 to deliver checkmate!'
    },
    quiz: {
      question: 'How many points is a Rook typically valued at?',
      options: ['3 points', '4 points', '5 points', '9 points'],
      correctIndex: 2,
      explanation: 'A Rook is worth 5 points, ranking above Knights and Bishops (3 points) and below Queens (9 points).'
    }
  },

  // 7. Queen
  {
    id: 'queen',
    category: 'pieces',
    title: 'The Queen',
    subtitle: 'The supreme ruler of the board',
    theory: `The Queen is your most formidable attacking force, combining the powers of both the **Rook and the Bishop**.

- **Omnidirectional**: Can move any number of vacant squares in any direction: horizontally, vertically, or diagonally.
- **Constraint**: Cannot jump over pieces (only the Knight can do that).
- **Value**: 9 points. Protect your Queen carefully!`,
    demoFen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
    practice: {
      fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
      instruction: 'Deliver Scholar\'s Mate! Deliver checkmate on f7 with your Queen from f3!',
      expectedMove: { from: 'f3', to: 'f7' },
      hint: 'Move your Queen to f7, protected by the bishop on c4. Checkmate!'
    },
    quiz: {
      question: 'Which piece powers are combined to make the Queen?',
      options: [
        'Knight and Bishop',
        'Rook and Bishop',
        'Rook and Knight',
        'King and Pawn'
      ],
      correctIndex: 1,
      explanation: 'The Queen combines the straight lines of the Rook with the diagonals of the Bishop.'
    }
  },

  // 8. King
  {
    id: 'king',
    category: 'pieces',
    title: 'The King',
    subtitle: 'The most important piece of all',
    theory: `The King is the heart of your army. If your King is checkmated, the game ends immediately.

- **One Square Reach**: The King can move exactly **one square** in any direction (horizontal, vertical, diagonal).
- **Danger Zone**: A King can NEVER move onto a square attacked by an enemy piece.
- **King Separation**: Two Kings may never stand on adjacent squares touching each other.
- **Value**: Priceless! (Infinity).`,
    demoFen: '8/8/8/3k4/4P3/8/4K3/8 b - - 0 1',
    practice: {
      fen: '8/8/8/3k4/4P3/8/4K3/8 b - - 0 1',
      instruction: 'Your black King is in check from the white pawn on e4. Step your King forward to e4 to capture the attacker!',
      expectedMove: { from: 'd5', to: 'e4' },
      hint: 'The white pawn on e4 is undefended. Use your king to take it!'
    },
    quiz: {
      question: 'Can two Kings ever stand on adjacent squares right next to each other?',
      options: [
        'Yes, in the endgame',
        'No, they must always be separated by at least one square',
        'Yes, if both players agree',
        'Only when capturing'
      ],
      correctIndex: 1,
      explanation: 'Because a King can never move into check, two Kings can never touch or stand next to one another.'
    }
  },

  // 9. Capturing
  {
    id: 'capturing',
    category: 'pieces',
    title: 'Capturing Pieces',
    subtitle: 'Taking enemy troops off the board',
    theory: `In chess, capturing occurs by moving your piece onto an occupied enemy square and removing their piece from the game.

- **Replacement**: Your piece takes the square where the opponent stood.
- **Pawn Exception**: Pawns move straight forward but capture diagonally forward.
- **No Self-Capture**: You can never capture your own pieces.
- **Capturing is Optional**: Unlike checkers, capturing is NEVER mandatory in chess.`,
    demoFen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    practice: {
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      instruction: 'Capture the black pawn on e5 with your knight on f3!',
      expectedMove: { from: 'f3', to: 'e5' },
      hint: 'Leap your knight from f3 onto the e5 square to capture the black pawn.'
    },
    quiz: {
      question: 'Is capturing an opponent\'s piece mandatory in chess when possible?',
      options: [
        'Yes, you must capture if able',
        'No, capturing is always optional',
        'Only pawns are forced to capture',
        'Only when giving check'
      ],
      correctIndex: 1,
      explanation: 'Capturing is always a strategic choice in chess; you are never forced to capture unless it is your only legal escape from check.'
    }
  },

  // 10. Check
  {
    id: 'check',
    category: 'rules',
    title: 'Check',
    subtitle: 'The King under attack',
    theory: `When an enemy piece directly attacks your King, you are in **Check**.

You MUST escape check on your very next turn. There are only three ways to escape (Remember **CPR**):
1. **C - Capture**: Capture the attacking piece.
2. **P - Protect / Block**: Place a piece between your King and the attacker (cannot block against a Knight!).
3. **R - Run**: Move your King to an unattacked square.`,
    demoFen: '4k3/8/8/8/8/8/8/4R1K1 b - - 0 1',
    practice: {
      fen: '4k3/8/8/8/8/8/8/4R1K1 b - - 0 1',
      instruction: 'Your black King is in check from the white Rook on e1. Run to safety by moving your King to d8!',
      expectedMove: { from: 'e8', to: 'd8' },
      hint: 'Move the King on e8 to the safe d8 square.'
    },
    quiz: {
      question: 'Which of the following is NOT one of the 3 ways (CPR) to escape a check?',
      options: [
        'Capture the attacking piece',
        'Block the attack with another piece',
        'Castle out of check',
        'Run to an unattacked square'
      ],
      correctIndex: 2,
      explanation: 'You can never castle while currently in check!'
    }
  },

  // 11. Checkmate
  {
    id: 'checkmate',
    category: 'rules',
    title: 'Checkmate',
    subtitle: 'The ultimate victory',
    theory: `**Checkmate** is the ultimate goal in chess. It happens when:
1. The King is in **Check** (under attack).
2. The player has **no legal moves** to escape (cannot Capture, Protect, or Run).

When Checkmate occurs, the game ends **instantly**. You do not capture the King; the King is trapped, and victory is yours!`,
    demoFen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
    practice: {
      fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
      instruction: 'Deliver the classic "Back Rank Mate"! Move your Rook from a1 to a8 to deliver checkmate!',
      expectedMove: { from: 'a1', to: 'a8' },
      hint: 'Advance the rook all the way to a8. The enemy king is trapped behind his own pawns!'
    },
    quiz: {
      question: 'What happens immediately when checkmate is delivered?',
      options: [
        'The King is physically removed from the board',
        'The game immediately ends and the checking player wins',
        'The opponent gets one final turn to counterattack',
        'A tiebreaker blitz match begins'
      ],
      correctIndex: 1,
      explanation: 'Checkmate concludes the game on the spot. The King is never taken off the board.'
    }
  },

  // 12. Draw
  {
    id: 'draw',
    category: 'rules',
    title: 'Draw',
    subtitle: 'When neither side can win',
    theory: `A chess game can end in a peaceful tie called a **Draw**.

Common ways a draw occurs:
- **Mutual Agreement**: Both players consent to a draw.
- **Threefold Repetition**: The exact same board position occurs 3 times.
- **50-Move Rule**: 50 consecutive moves occur without any pawn moves or piece captures.
- **Insufficient Material**: Neither side has enough pieces to checkmate (e.g., King vs King, King+Bishop vs King, King+Knight vs King).`,
    demoFen: '8/8/8/4k3/8/8/4K3/8 w - - 0 1',
    practice: {
      fen: '8/8/8/4k3/8/8/4K3/8 w - - 0 1',
      instruction: 'With only two Kings remaining, checkmate is impossible! Move your King to e3 to confirm the draw.',
      expectedMove: { from: 'e2', to: 'e3' },
      hint: 'Move e2 to e3. The game is an automatic draw by insufficient material.'
    },
    quiz: {
      question: 'Which of the following scenarios is an automatic draw due to insufficient checkmating material?',
      options: [
        'King + Queen vs King',
        'King + Rook vs King',
        'King + single Bishop vs King',
        'King + 2 Pawns vs King'
      ],
      correctIndex: 2,
      explanation: 'A King and a single Bishop cannot checkmate a lone King because the bishop cannot control both square colors.'
    }
  },

  // 13. Stalemate
  {
    id: 'stalemate',
    category: 'rules',
    title: 'Stalemate',
    subtitle: 'The tragic blunder and brilliant escape',
    theory: `**Stalemate** is a special type of draw that happens when:
1. The player whose turn it is has **NO legal moves**.
2. Their King is **NOT in check**.

Even if you have a Queen, two Rooks, and 5 Pawns ahead, if you leave your opponent with no legal moves while not putting them in check, the game instantly ends as a **DRAW (½ - ½)**! Always watch out for stalemate!`,
    demoFen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1',
    practice: {
      fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1',
      instruction: 'Avoid stalemate! Instead of trapping the King without check, deliver checkmate: move Queen from h1 to a8!',
      expectedMove: { from: 'h1', to: 'a8' },
      hint: 'Fly your Queen along the diagonal to a8 to deliver checkmate!'
    },
    quiz: {
      question: 'If a player has no legal moves and their King is NOT in check, what is the result?',
      options: [
        'The player loses the game',
        'The game is a Stalemate (Draw)',
        'The player must pass their turn',
        'The player gets a bonus minute on the clock'
      ],
      correctIndex: 1,
      explanation: 'Stalemate results in a draw (half point each), regardless of how much material advantage the other side has.'
    }
  },

  // 14. Castling
  {
    id: 'castling',
    category: 'rules',
    title: 'Castling',
    subtitle: 'The double move for King safety',
    theory: `**Castling** is the only move in chess where you move **two pieces in a single turn** (King and Rook).

- **Kingside Castling (O-O)**: The King moves 2 squares toward the Rook (e1 to g1 for White), and the Rook hops over to f1.
- **Queenside Castling (O-O-O)**: The King moves 2 squares (e1 to c1), and the Rook hops over to d1.

**Requirements**:
1. Neither the King nor the chosen Rook have ever moved.
2. All squares between them are completely empty.
3. The King is NOT currently in check.
4. The King does NOT pass through or land on an attacked square.`,
    demoFen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
    practice: {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
      instruction: 'Protect your white King! Castle kingside by moving your King from e1 to g1.',
      expectedMove: { from: 'e1', to: 'g1' },
      hint: 'Drag or click the King on e1 to g1. The rook on h1 will automatically jump to f1!'
    },
    quiz: {
      question: 'Can you castle if your King is currently in check?',
      options: [
        'Yes, it is the best way to escape check',
        'No, you cannot castle while in check',
        'Only on the Queenside',
        'Only if the Rook is protected'
      ],
      correctIndex: 1,
      explanation: 'You cannot castle while in check, nor can the King castle through or into a square attacked by an enemy piece.'
    }
  },

  // 15. En Passant
  {
    id: 'enpassant',
    category: 'rules',
    title: 'En Passant',
    subtitle: 'Capturing in passing',
    theory: `**En Passant** (French for "in passing") is a special pawn capture rule created in the 15th century.

When an enemy pawn uses its initial two-square sprint to land directly beside your pawn on the 5th rank (for White) or 4th rank (for Black), you may capture that pawn as if it had only moved forward one square!

- **Now or Never**: You must make the en passant capture **immediately on the very next move**. If you play any other move, you forfeit the right forever.`,
    demoFen: 'rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3',
    practice: {
      fen: 'rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3',
      instruction: 'Black just played f7-f5 adjacent to your pawn on e5. Capture en passant by moving e5 to f6!',
      expectedMove: { from: 'e5', to: 'f6' },
      hint: 'Move your e5 pawn diagonally into f6 to capture the f5 pawn en passant!'
    },
    quiz: {
      question: 'When can you execute an En Passant capture?',
      options: [
        'Any time during the game',
        'Only on the very next move immediately after the opponent advances 2 squares',
        'Only when the opponent has 3 pawns left',
        'Whenever a Knight attacks your pawn'
      ],
      correctIndex: 1,
      explanation: 'En passant must be played immediately on the turn right after the two-square pawn advance, or the right is lost.'
    }
  },

  // 16. Promotion
  {
    id: 'promotion',
    category: 'rules',
    title: 'Pawn Promotion',
    subtitle: 'Transforming a foot soldier into royalty',
    theory: `When a pawn journeys all the way to the other end of the board (the 8th rank for White, or the 1st rank for Black), it immediately transforms into:
- **Queen** (most popular, 99% of the time)
- **Rook**
- **Bishop**
- **Knight** (sometimes useful for an instant fork or check!)

A pawn can NEVER promote to a King or remain a pawn. You can promote as many pawns as you wish; having two or three Queens on the board is completely legal!`,
    demoFen: '8/4P3/8/8/8/8/8/4K2k w - - 0 1',
    practice: {
      fen: '8/4P3/8/8/8/8/8/4K2k w - - 0 1',
      instruction: 'Advance your pawn on e7 to e8 and promote to a Queen!',
      expectedMove: { from: 'e7', to: 'e8' },
      hint: 'Move e7 to e8 to trigger promotion to Queen.'
    },
    quiz: {
      question: 'Which piece can a pawn NOT be promoted into?',
      options: ['Queen', 'Knight', 'King', 'Rook'],
      correctIndex: 2,
      explanation: 'You can never promote a pawn into a King or keep it as a pawn.'
    }
  },

  // 17. Opening Principles
  {
    id: 'openings',
    category: 'strategy',
    title: 'Opening Principles',
    subtitle: 'The 3 commandments of a great start',
    theory: `Every great chess game starts with a solid foundation. Follow these 3 golden principles in the opening:

1. **Control the Center**: Occupy or influence the central squares (d4, d5, e4, e5) with pawns and pieces.
2. **Develop Minor Pieces**: Bring your Knights and Bishops into active squares quickly. (Knights before Bishops is standard wisdom).
3. **King Safety**: Castle early to tuck your King into safety and connect your Rooks.

**What NOT to do**: Don't bring your Queen out too early, and avoid moving the same piece multiple times in the opening.`,
    demoFen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
    practice: {
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
      instruction: 'Develop your Kingside Knight to f3 to attack Black\'s center pawn on e5!',
      expectedMove: { from: 'g1', to: 'f3' },
      hint: 'Develop the knight: g1 to f3.'
    },
    quiz: {
      question: 'Why is it usually a mistake to bring your Queen out on move 2 or 3?',
      options: [
        'The Queen is not allowed to move until turn 5',
        'Enemy pieces will develop with tempo by constantly attacking your Queen',
        'Queens move too slowly',
        'The rules say Bishops must move first'
      ],
      correctIndex: 1,
      explanation: 'Early Queen attacks are easily chased away by developing minor pieces, causing you to lose time while your opponent builds a huge developmental lead.'
    }
  },

  // 18. Fork
  {
    id: 'fork',
    category: 'tactics',
    title: 'The Fork',
    subtitle: 'Double trouble with a single strike',
    theory: `A **Fork** is a tactical tactic where a single piece attacks **two or more enemy pieces simultaneously**.

- **The Knight Fork**: Knights are the deadliest forkers because they jump and can attack Queens and Kings without being captured in return.
- **Pawn Fork**: Even a humble pawn can fork two minor pieces!
- Since your opponent can only respond to one threat per move, you are guaranteed to capture the second target!`,
    demoFen: 'r1bqk2r/pppp1ppp/8/4n3/1b2P3/2N5/PPPP1PPP/R1BQKB1R w KQkq - 0 5',
    practice: {
      fen: 'r1bqk2r/pppp1ppp/8/4n3/1b2P3/2N5/PPPP1PPP/R1BQKB1R w KQkq - 0 5',
      instruction: 'Spot the royal fork! Jump your Knight from c3 to d5 to fork the Black Queen and Bishop!',
      expectedMove: { from: 'c3', to: 'd5' },
      hint: 'Move the knight on c3 to d5. It attacks both the queen on d8 and bishop on b4!'
    },
    quiz: {
      question: 'Which piece is universally recognized as the most frequent and dangerous at delivering surprise forks?',
      options: ['Rook', 'Bishop', 'Knight', 'King'],
      correctIndex: 2,
      explanation: 'The Knight\'s unique jumping L-move makes it the master of deceptive forks that cannot be blocked.'
    }
  },

  // 19. Pin
  {
    id: 'pin',
    category: 'tactics',
    title: 'The Pin',
    subtitle: 'Paralyzing enemy forces',
    theory: `A **Pin** occurs when an attacking piece targets an enemy piece that cannot move without exposing a more valuable piece behind it.

- **Absolute Pin**: The piece pinned is protecting the **King**. Moving it would be illegal!
- **Relative Pin**: The piece pinned protects a Queen or Rook. Moving it is legal, but will cause catastrophic material loss.
- Only long-range sliders can create pins: **Bishops, Rooks, and Queens**.`,
    demoFen: '4k3/8/8/4r3/8/8/8/4R1K1 w - - 0 1',
    practice: {
      fen: '4k3/8/8/4r3/8/8/8/4R1K1 w - - 0 1',
      instruction: 'The black rook on e5 is in an absolute pin to its King! Capture it with your Rook on e1!',
      expectedMove: { from: 'e1', to: 'e5' },
      hint: 'The black rook cannot move away because it would expose the King. Take it: e1 to e5!'
    },
    quiz: {
      question: 'What is an "Absolute Pin" in chess?',
      options: [
        'A pin where the piece behind is the King, making moving the pinned piece completely illegal',
        'A pin that lasts for 10 turns',
        'A pin performed by a Knight',
        'A pin involving two Queens'
      ],
      correctIndex: 0,
      explanation: 'In an absolute pin, moving the pinned piece would put the King in check, which violates the fundamental rules of chess.'
    }
  },

  // 20. Skewer
  {
    id: 'skewer',
    category: 'tactics',
    title: 'The Skewer',
    subtitle: 'The reverse pin',
    theory: `A **Skewer** (often called an x-ray attack) is like a pin in reverse:

1. A high-value piece (like the King or Queen) is in front under direct attack.
2. When the high-value piece is forced to move out of danger, it exposes a less valuable piece behind it to capture!

Skewers are devastating weapons in endgames with Rooks and Queens along open files and ranks.`,
    demoFen: '8/8/8/8/8/8/4K3/R3k2r w - - 0 1',
    practice: {
      fen: '8/8/8/8/8/8/4K3/R3k2r w - - 0 1',
      instruction: 'The enemy King and Rook are on the same 1st rank. Deliver a skewer: move Rook to a1 to check the King on e1!',
      expectedMove: { from: 'a1', to: 'e1' },
      hint: 'Wait, skewer along rank 1: Rook on a1 takes e1? If King moves, Rook behind on h1 falls!'
    },
    quiz: {
      question: 'How does a Skewer differ from a Pin?',
      options: [
        'In a skewer, the more valuable piece is in the front and must move, exposing the piece behind',
        'Pins only happen in the opening, skewers in the endgame',
        'Skewers can only be made by pawns',
        'There is no difference'
      ],
      correctIndex: 0,
      explanation: 'In a pin, the valuable piece is in the back. In a skewer, the valuable piece is in the front and forced to flee.'
    }
  },

  // 21. Discovered Attack
  {
    id: 'discovered',
    category: 'tactics',
    title: 'Discovered Attack',
    subtitle: 'The ambush from behind',
    theory: `A **Discovered Attack** occurs when you move one piece out of the way, unmasking an attack from a friendly piece hiding behind it!

- It is an ambush: the piece that moves creates one threat, while the revealed piece creates a second threat!
- **Discovered Check**: If the revealed piece checks the enemy King, the opponent MUST respond to the check, allowing your moving piece to capture almost anything with impunity!`,
    demoFen: '3qk3/8/8/3B4/8/8/8/3R2K1 w - - 0 1',
    practice: {
      fen: '3qk3/8/8/3B4/8/8/8/3R2K1 w - - 0 1',
      instruction: 'Unmask the ambush! Move your Bishop to c6 with check, discovering an attack on the Black Queen with your Rook on d1!',
      expectedMove: { from: 'd5', to: 'c6' },
      hint: 'Step your bishop from d5 to c6 with check. Black must deal with check, leaving the Queen on d8 for your rook!'
    },
    quiz: {
      question: 'What makes a Discovered Check so lethal?',
      options: [
        'The opponent loses all their pawns instantly',
        'The moving piece can attack whatever it wants because the opponent is forced to answer the check',
        'It awards 5 bonus points',
        'It cannot be defended'
      ],
      correctIndex: 1,
      explanation: 'Because the King is checked by the unmasked piece, the opponent must spend their move answering check, letting your moving piece wreak havoc.'
    }
  },

  // 22. Double Check
  {
    id: 'doublecheck',
    category: 'tactics',
    title: 'Double Check',
    subtitle: 'The check you cannot block',
    theory: `A **Double Check** happens when TWO of your pieces check the enemy King at the same time (one moving piece + one discovered piece).

**The Unique Rule of Double Check**:
- You CANNOT block two pieces with one move!
- You CANNOT capture two pieces with one move!
- Therefore, **the King is FORCED to move!**

If the King has no safe flight squares, it is instantly Checkmate!`,
    demoFen: '4k3/8/8/4N3/8/8/8/4R1K1 w - - 0 1',
    practice: {
      fen: '4k3/8/8/4N3/8/8/8/4R1K1 w - - 0 1',
      instruction: 'Deliver a double check! Leap your Knight to c6. Both the Knight and the Rook check the King simultaneously!',
      expectedMove: { from: 'e5', to: 'c6' },
      hint: 'Move e5 to c6. Double check! The King is forced to flee.'
    },
    quiz: {
      question: 'When a player is placed in Double Check, how can they escape?',
      options: [
        'They can block the more powerful piece',
        'They must move their King; blocking and capturing are impossible',
        'They can capture both attackers',
        'They can castle'
      ],
      correctIndex: 1,
      explanation: 'A single move cannot eliminate or block two separate checking pieces simultaneously. The King must run!'
    }
  },

  // 23. Basic Endgames
  {
    id: 'endgames',
    category: 'strategy',
    title: 'Basic Endgames',
    subtitle: 'Sealing the victory with King & Queen vs King',
    theory: `Having an extra Queen or Rook does not win the game automatically—you must know the technique to deliver checkmate!

- **King + Queen vs King**:
  1. Use your Queen like a shrinking box to push the enemy King to the edge of the board.
  2. Bring your own King up to support the Queen.
  3. Deliver checkmate on the edge. **Beware of stalemate!**
- **King + Rook vs King**:
  1. Cut off the enemy King along ranks or files.
  2. Use your King to achieve "Opposition" (facing the enemy King with one square between).
  3. Deliver the final blow along the edge.`,
    demoFen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1',
    practice: {
      fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1',
      instruction: 'Finish the game! Queen and King corner the lonely black King. Deliver checkmate with Queen to a8 or b7!',
      expectedMove: { from: 'h1', to: 'a8' },
      hint: 'Fly your Queen to a8 for checkmate!'
    },
    quiz: {
      question: 'What is the most dangerous pitfall to avoid when checkmating with King and Queen against a lone King?',
      options: [
        'Running out of pawns',
        'Accidental Stalemate by taking away all the enemy King\'s moves without check',
        'Losing your King',
        'Threefold repetition on move 1'
      ],
      correctIndex: 1,
      explanation: 'Stalemate is the #1 beginner heartbreak! Always make sure the enemy King has either a legal square or is currently in check.'
    }
  }
];
