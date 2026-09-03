import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, PlayCircle, Home } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import styles from './GameOverModal.module.css';

export function GameOverModal({
  isOpen,
  result, // { winner: 'w'|'b'|'draw', reason: string }
  playerColor = 'w',
  isVsAI = false,
  onRematch,
  onReplay,
  onHome
}) {
  useEffect(() => {
    if (isOpen && result) {
      const isVictory = result.winner === playerColor || (!isVsAI && result.winner !== 'draw');
      if (isVictory) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas not supported
        }
      }
    }
  }, [isOpen, result, playerColor, isVsAI]);

  if (!isOpen || !result) return null;

  const getOutcomeDetails = () => {
    if (result.winner === 'draw') {
      const reasonMap = {
        stalemate: 'Stalemate - No legal moves left',
        threefold: 'Threefold Repetition',
        insufficient: 'Insufficient Material to Checkmate',
        'fifty-move': '50-Move Rule Exceeded'
      };
      return {
        title: 'Draw!',
        subtitle: reasonMap[result.reason] || 'The game ended in a draw.',
        badgeColor: '#f59e0b',
        icon: Award
      };
    }

    if (isVsAI) {
      const userWon = result.winner === playerColor;
      return {
        title: userWon ? 'Victory!' : 'Defeat!',
        subtitle: `${result.winner === 'w' ? 'White' : 'Black'} won by ${result.reason}.`,
        badgeColor: userWon ? '#10b981' : '#ef4444',
        icon: Trophy
      };
    } else {
      const winnerName = result.winner === 'w' ? 'White' : 'Black';
      return {
        title: `${winnerName} Wins!`,
        subtitle: `Won by ${result.reason}.`,
        badgeColor: '#10b981',
        icon: Trophy
      };
    }
  };

  const { title, subtitle, badgeColor, icon: OutcomeIcon } = getOutcomeDetails();

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="" maxWidth="420px" showClose={false}>
      <div className={styles.container}>
        <div className={styles.iconBadge} style={{ backgroundColor: `${badgeColor}22`, color: badgeColor }}>
          <OutcomeIcon size={44} />
        </div>

        <h2 className={styles.title} style={{ color: badgeColor }}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.buttonGroup}>
          <Button variant="primary" size="lg" fullWidth icon={RotateCcw} onClick={onRematch}>
            Play Again
          </Button>

          <Button variant="secondary" size="md" fullWidth icon={PlayCircle} onClick={onReplay}>
            Review & Replay
          </Button>

          <Button variant="ghost" size="md" fullWidth icon={Home} onClick={onHome}>
            Return to Home
          </Button>
        </div>
      </div>
    </Modal>
  );
}
