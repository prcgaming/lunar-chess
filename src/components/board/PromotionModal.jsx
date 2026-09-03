import React from 'react';
import { Modal } from '../common/Modal';
import styles from './PromotionModal.module.css';

export function PromotionModal({ isOpen, color = 'w', onSelect, onCancel }) {
  const pieces = [
    { type: 'q', name: 'Queen', value: '9 pts', symbol: color === 'w' ? '♕' : '♛' },
    { type: 'r', name: 'Rook', value: '5 pts', symbol: color === 'w' ? '♖' : '♜' },
    { type: 'b', name: 'Bishop', value: '3 pts', symbol: color === 'w' ? '♗' : '♝' },
    { type: 'n', name: 'Knight', value: '3 pts', symbol: color === 'w' ? '♘' : '♞' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Pawn Promotion" maxWidth="380px" showClose={false}>
      <p className={styles.subtitle}>Choose a piece to promote your pawn:</p>
      <div className={styles.grid}>
        {pieces.map((p) => (
          <button
            key={p.type}
            className={styles.pieceBtn}
            onClick={() => onSelect(p.type)}
            aria-label={`Promote to ${p.name}`}
          >
            <span className={styles.symbol}>{p.symbol}</span>
            <span className={styles.name}>{p.name}</span>
            <span className={styles.value}>{p.value}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
