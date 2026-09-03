import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import styles from './ReplayControls.module.css';

export function ReplayControls({
  currentIndex,
  totalMoves,
  onGoToMove,
  isPlaying,
  setIsPlaying
}) {
  const [speed, setSpeed] = useState(1); // 0.5 | 1 | 2 | 4
  const playTimerRef = useRef(null);

  // Speed mappings in ms
  const getDelay = (s) => {
    switch (s) {
      case 0.5: return 2000;
      case 2: return 500;
      case 4: return 250;
      case 1:
      default: return 1000;
    }
  };

  // Autoplay effect
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        onGoToMove((prev) => {
          if (prev < totalMoves - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, getDelay(speed));
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, speed, totalMoves, onGoToMove, setIsPlaying]);

  const handleRewind = () => {
    setIsPlaying(false);
    onGoToMove(-1);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    onGoToMove((prev) => Math.max(-1, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    onGoToMove((prev) => Math.min(totalMoves - 1, prev + 1));
  };

  const handleFastForward = () => {
    setIsPlaying(false);
    onGoToMove(totalMoves - 1);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    onGoToMove(-1);
    setTimeout(() => setIsPlaying(true), 150);
  };

  const togglePlay = () => {
    if (currentIndex >= totalMoves - 1) {
      // If at the end, restart from beginning
      onGoToMove(-1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressRow}>
        <span className={styles.label}>Move {currentIndex + 1} of {totalMoves}</span>
        <input
          type="range"
          min={-1}
          max={totalMoves - 1}
          value={currentIndex}
          onChange={(e) => {
            setIsPlaying(false);
            onGoToMove(parseInt(e.target.value, 10));
          }}
          className={styles.slider}
        />
      </div>

      <div className={styles.controlsRow}>
        {/* Rewind to start */}
        <button className={styles.btn} onClick={handleRewind} title="First Move (Rewind)">
          <ChevronsLeft size={20} />
        </button>

        {/* Step back */}
        <button className={styles.btn} onClick={handlePrev} disabled={currentIndex <= -1} title="Previous Move">
          <ChevronLeft size={20} />
        </button>

        {/* Play/Pause */}
        <button className={`${styles.btn} ${styles.playBtn}`} onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        {/* Step next */}
        <button className={styles.btn} onClick={handleNext} disabled={currentIndex >= totalMoves - 1} title="Next Move">
          <ChevronRight size={20} />
        </button>

        {/* Fast forward to end */}
        <button className={styles.btn} onClick={handleFastForward} title="Last Move (Fast Forward)">
          <ChevronsRight size={20} />
        </button>

        {/* Restart Replay */}
        <button className={styles.btn} onClick={handleRestart} title="Restart Replay">
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Speed Selector */}
      <div className={styles.speedRow}>
        <span className={styles.speedLabel}>Speed:</span>
        {[0.5, 1, 2, 4].map((s) => (
          <button
            key={s}
            className={`${styles.speedBtn} ${speed === s ? styles.speedActive : ''}`}
            onClick={() => setSpeed(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
