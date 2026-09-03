import React from 'react';
import styles from './CapturedPieces.module.css';

const PIECE_SYMBOLS = {
  w: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕' },
  b: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛' }
};

export function CapturedPieces({ pieces = [], advantage = 0, showAdvantage = true }) {
  // Sort pieces by value
  const sorted = [...pieces].sort((a, b) => b.value - a.value);

  return (
    <div className={styles.container}>
      <div className={styles.pieceRow}>
        {sorted.map((item, index) => (
          <span key={index} className={styles.pieceSymbol}>
            {PIECE_SYMBOLS[item.color][item.type]}
          </span>
        ))}
      </div>
      {showAdvantage && advantage > 0 && (
        <span className={styles.advantage}>+{advantage}</span>
      )}
    </div>
  );
}
