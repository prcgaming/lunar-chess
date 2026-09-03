import React from 'react';
import { Clock } from 'lucide-react';
import styles from './TimerDisplay.module.css';

export function TimerDisplay({ seconds, isCurrentTurn, isUnlimited = false, label }) {
  const formatTime = (secs) => {
    if (isUnlimited || secs === null || secs === undefined) return '∞';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLowTime = !isUnlimited && seconds !== null && seconds <= 15;

  return (
    <div
      className={`${styles.container} ${isCurrentTurn ? styles.active : ''} ${isLowTime ? styles.lowTime : ''}`}
    >
      <div className={styles.topRow}>
        {label && <span className={styles.label}>{label}</span>}
        {isCurrentTurn && <span className={styles.toMoveBadge}>To Move</span>}
      </div>
      <div className={styles.timeBox}>
        <Clock size={15} className={styles.clockIcon} />
        <span className={styles.timeText}>{formatTime(seconds)}</span>
      </div>
    </div>
  );
}
