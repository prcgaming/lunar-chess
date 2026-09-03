import React from 'react';
import { Clock, Pause } from 'lucide-react';
import styles from './SingleTurnClock.module.css';

export function SingleTurnClock({
  turn = 'w', // 'w' | 'b'
  whiteTime,
  blackTime,
  isUnlimited = false,
  isPaused = false,
  gameOver = false
}) {
  const isWhite = turn === 'w';
  const activeSeconds = isWhite ? whiteTime : blackTime;

  const formatTime = (secs) => {
    if (isUnlimited || secs === null || secs === undefined) return '∞';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLowTime = !isUnlimited && activeSeconds !== null && activeSeconds <= 15;

  return (
    <div className={`${styles.singleClockContainer} ${isWhite ? styles.whiteTurn : styles.blackTurn} ${isLowTime ? styles.lowTime : ''}`}>
      {/* Active Player Indicator */}
      <div className={styles.playerBadge}>
        <span className={styles.pieceGlyph}>{isWhite ? '♔' : '♚'}</span>
        <div className={styles.playerMeta}>
          <div className={styles.turnRow}>
            <span className={styles.turnLabel}>{isWhite ? "White" : "Black"}</span>
            {!gameOver && !isPaused && <span className={styles.toMoveBadge}>To Move</span>}
          </div>
          <span className={styles.statusSub}>
            {gameOver ? 'Game Over' : isPaused ? 'Clock Paused' : 'Active Clock'}
          </span>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className={styles.timerDisplay}>
        {isPaused ? (
          <Pause size={18} className={styles.pauseIcon} />
        ) : (
          <Clock size={18} className={styles.clockIcon} />
        )}
        <span className={styles.timeDigits}>{formatTime(activeSeconds)}</span>
      </div>
    </div>
  );
}