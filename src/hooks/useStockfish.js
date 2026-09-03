// Unified Chess AI Hook (Stockfish + Minimax Heuristics)
import { useState, useCallback, useRef } from 'react';
import { findBestMove } from '../chess-engine/engineFallback';
import { DIFFICULTY_LEVELS } from '../chess-engine/chessConstants';

export function useStockfish() {
  const [isThinking, setIsThinking] = useState(false);
  const [bestMove, setBestMove] = useState(null);
  const [hint, setHint] = useState(null);
  const cancelRef = useRef(false);

  const requestAIMove = useCallback((fen, difficulty = 'medium') => {
    setIsThinking(true);
    cancelRef.current = false;

    return new Promise((resolve) => {
      // Natural, visible pause (450ms - 600ms) so players can clearly see the turn change and move animation
      const delayMap = {
        beginner: 400,
        easy: 450,
        medium: 500,
        hard: 550,
        expert: 600,
        master: 650
      };
      const thinkDelay = delayMap[difficulty] || 500;

      setTimeout(() => {
        if (cancelRef.current) {
          setIsThinking(false);
          resolve(null);
          return;
        }

        try {
          const move = findBestMove(fen, difficulty);
          setIsThinking(false);
          setBestMove(move);
          resolve(move);
        } catch (error) {
          console.error('AI calculation error:', error);
          setIsThinking(false);
          resolve(null);
        }
      }, thinkDelay);
    });
  }, []);

  const requestHint = useCallback((fen) => {
    try {
      // Find optimal move for current player at high depth
      const optimalMove = findBestMove(fen, 'expert');
      setHint(optimalMove);
      return optimalMove;
    } catch (e) {
      console.error('Hint error:', e);
      return null;
    }
  }, []);

  const clearHint = useCallback(() => {
    setHint(null);
  }, []);

  const stopCalculation = useCallback(() => {
    cancelRef.current = true;
    setIsThinking(false);
  }, []);

  return {
    isThinking,
    bestMove,
    hint,
    requestAIMove,
    requestHint,
    clearHint,
    stopCalculation
  };
}
