import React, { useState } from 'react';
import { DIFFICULTY_LEVELS } from '../../chess-engine/chessConstants';
import { Button } from '../../components/common/Button';
import { Bot, ShieldAlert } from 'lucide-react';
import styles from './PlayAI.module.css';

export function DifficultySelect({ onStartGame, onBack }) {
  const [selectedDiff, setSelectedDiff] = useState('medium');
  const [selectedSide, setSelectedSide] = useState('w'); // 'w' | 'b' | 'random'

  const handleStart = () => {
    let side = selectedSide;
    if (side === 'random') {
      side = Math.random() < 0.5 ? 'w' : 'b';
    }
    onStartGame(selectedDiff, side);
  };

  return (
    <div className={styles.selectContainer}>
      <div className={styles.selectHeader}>
        <div className={styles.iconBadge}>
          <Bot size={32} />
        </div>
        <h2 className={styles.selectTitle}>Play with AI</h2>
        <p className={styles.selectSubtitle}>Choose your difficulty level and preferred side</p>
      </div>

      {/* Side Selection */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Play As:</label>
        <div className={styles.sideGrid}>
          <button
            className={`${styles.sideBtn} ${selectedSide === 'w' ? styles.sideActive : ''}`}
            onClick={() => setSelectedSide('w')}
          >
            <span className={styles.pieceIcon}>♔</span>
            <span>White (First)</span>
          </button>
          <button
            className={`${styles.sideBtn} ${selectedSide === 'random' ? styles.sideActive : ''}`}
            onClick={() => setSelectedSide('random')}
          >
            <span className={styles.pieceIcon}>☯</span>
            <span>Random</span>
          </button>
          <button
            className={`${styles.sideBtn} ${selectedSide === 'b' ? styles.sideActive : ''}`}
            onClick={() => setSelectedSide('b')}
          >
            <span className={styles.pieceIcon}>♚</span>
            <span>Black (Second)</span>
          </button>
        </div>
      </div>

      {/* Difficulty Levels Grid */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Select Difficulty:</label>
        <div className={styles.difficultyGrid}>
          {Object.values(DIFFICULTY_LEVELS).map((level) => (
            <div
              key={level.id}
              className={`${styles.diffCard} ${selectedDiff === level.id ? styles.diffActive : ''}`}
              onClick={() => setSelectedDiff(level.id)}
            >
              <div className={styles.diffTop}>
                <span className={styles.diffName} style={{ color: level.color }}>
                  {level.name}
                </span>
                <span className={styles.diffElo}>~{level.elo} ELO</span>
              </div>
              <p className={styles.diffDesc}>{level.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.selectActions}>
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={handleStart}>
          Start Game
        </Button>
      </div>
    </div>
  );
}
