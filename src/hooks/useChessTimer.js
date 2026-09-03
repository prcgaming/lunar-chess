import { useState, useEffect, useRef, useCallback } from 'react';

export function useChessTimer({ initialSeconds = 600, onTimeOut, enabled = true }) {
  const [whiteTime, setWhiteTime] = useState(initialSeconds);
  const [blackTime, setBlackTime] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [activePlayer, setActivePlayer] = useState('w');

  const intervalRef = useRef(null);
  const initialSecondsRef = useRef(initialSeconds);

  // Synchronize when initialSeconds changes (only if value actually changed)
  useEffect(() => {
    if (initialSecondsRef.current !== initialSeconds) {
      initialSecondsRef.current = initialSeconds;
      setWhiteTime(initialSeconds);
      setBlackTime(initialSeconds);
      setIsRunning(false);
    }
  }, [initialSeconds]);

  const start = useCallback((player = 'w') => {
    if (!initialSeconds) return; // Unlimited
    setActivePlayer(player);
    setIsRunning(true);
  }, [initialSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (!initialSeconds) return;
    setIsRunning(true);
  }, [initialSeconds]);

  const reset = useCallback((seconds = initialSeconds) => {
    setIsRunning(false);
    setWhiteTime(seconds);
    setBlackTime(seconds);
    setActivePlayer('w');
  }, [initialSeconds]);

  const switchTurn = useCallback((nextPlayer) => {
    setActivePlayer(nextPlayer);
    if (initialSeconds) {
      setIsRunning(true); // Ensure clock keeps running on turn switch!
    }
  }, [initialSeconds]);

  useEffect(() => {
    if (!enabled || !isRunning || !initialSeconds) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (activePlayer === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (onTimeOut) onTimeOut('w');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (onTimeOut) onTimeOut('b');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [enabled, isRunning, activePlayer, initialSeconds, onTimeOut]);

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '∞';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    whiteTime,
    blackTime,
    isRunning,
    activePlayer,
    formatTime,
    start,
    pause,
    resume,
    reset,
    switchTurn,
    isUnlimited: initialSeconds === null
  };
}