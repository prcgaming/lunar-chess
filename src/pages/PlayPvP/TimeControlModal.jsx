import React, { useState } from 'react';
import { TIME_CONTROLS } from '../../chess-engine/chessConstants';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Users, Zap, Flame, Timer, Clock, Hourglass, Shield, Infinity as InfinityIcon } from 'lucide-react';
import styles from './PlayPvP.module.css';

const ICON_MAP = {
  Zap,
  Flame,
  Timer,
  Clock,
  Hourglass,
  Shield,
  Infinity: InfinityIcon
};

export function TimeControlModal({ isOpen, onSelectTime, onCancel }) {
  const [selected, setSelected] = useState('10m');
  const [autoFlip, setAutoFlip] = useState(false);

  const handleStart = () => {
    const found = TIME_CONTROLS.find((t) => t.id === selected) || TIME_CONTROLS[3];
    onSelectTime(found.seconds, autoFlip);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Two Player Game Setup" maxWidth="480px">
      <div className={styles.modalContent}>
        <p className={styles.modalDesc}>
          Select your clock time control for pass-and-play chess on this device:
        </p>

        <div className={styles.timeGrid}>
          {TIME_CONTROLS.map((tc) => {
            const IconComponent = ICON_MAP[tc.icon] || Clock;
            return (
              <button
                key={tc.id}
                className={`${styles.timeCard} ${selected === tc.id ? styles.timeActive : ''}`}
                onClick={() => setSelected(tc.id)}
                type="button"
              >
                <IconComponent size={24} className={styles.timeIcon} />
                <span className={styles.timeName}>{tc.name}</span>
              </button>
            );
          })}
        </div>

        {/* Auto Flip Board Toggle */}
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={autoFlip}
            onChange={(e) => setAutoFlip(e.target.checked)}
            className={styles.checkbox}
          />
          <span>Auto-flip board each turn (Pass & Play)</span>
        </label>

        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="lg" onClick={handleStart}>
            Start Match
          </Button>
        </div>
      </div>
    </Modal>
  );
}
