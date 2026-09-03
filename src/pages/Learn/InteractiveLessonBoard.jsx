import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import confetti from 'canvas-confetti';
import { ChessboardView } from '../../components/board/ChessboardView';
import { Button } from '../../components/common/Button';
import { useSound } from '../../context/SoundContext';
import { CheckCircle, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import styles from './Learn.module.css';

export function InteractiveLessonBoard({ practice, onComplete }) {
  const [fen, setFen] = useState(practice.fen);
  const [chess, setChess] = useState(() => new Chess(practice.fen));
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { playSound } = useSound();

  // Reset when practice changes
  useEffect(() => {
    const fresh = new Chess(practice.fen);
    setChess(fresh);
    setFen(fresh.fen());
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
    setIsSuccess(false);
    setShowHint(false);
    setErrorMessage(null);
  }, [practice]);

  const handleMoveAttempt = (from, to) => {
    try {
      // Validate legal move first
      const move = chess.move({ from, to, promotion: 'q' });
      if (!move) {
        setErrorMessage('That move is not legal according to chess rules. Try again!');
        return false;
      }

      setFen(chess.fen());
      setLastMove({ from, to });
      setSelectedSquare(null);
      setPossibleMoves([]);

      // Check if it satisfies the lesson target move
      const exp = practice.expectedMove;
      const matchesTarget = (!exp.from || exp.from === from) && exp.to === to;

      if (matchesTarget) {
        setIsSuccess(true);
        setErrorMessage(null);
        playSound('victory');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch {}
        if (onComplete) onComplete();
        return true;
      } else {
        // Legal move, but not the intended solution for this lesson drill
        playSound('move');
        setErrorMessage('Good move, but not the targeted move for this exercise. Try again or check the hint!');
        // Automatically reset board after 1.5s
        setTimeout(() => {
          const resetInstance = new Chess(practice.fen);
          setChess(resetInstance);
          setFen(resetInstance.fen());
          setLastMove(null);
        }, 1200);
        return true;
      }
    } catch {
      setErrorMessage('Invalid move. Try again!');
      return false;
    }
  };

  const onSquareClick = (square) => {
    if (isSuccess) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    if (selectedSquare) {
      const isTarget = possibleMoves.some((m) => m.to === square);
      if (isTarget) {
        handleMoveAttempt(selectedSquare, square);
        return;
      }
    }

    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const legal = chess.moves({ square, verbose: true });
      setPossibleMoves(legal);
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const handleReset = () => {
    const fresh = new Chess(practice.fen);
    setChess(fresh);
    setFen(fresh.fen());
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div className={styles.practiceContainer}>
      <div className={styles.instructionBanner}>
        <Sparkles size={18} className={styles.sparkleIcon} />
        <span>{practice.instruction}</span>
      </div>

      <div className={styles.boardBox}>
        <ChessboardView
          fen={fen}
          orientation={chess.turn() === 'b' ? 'black' : 'white'}
          onPieceDrop={handleMoveAttempt}
          onSquareClick={onSquareClick}
          selectedSquare={selectedSquare}
          possibleMoves={possibleMoves}
          lastMove={lastMove}
          hint={showHint ? practice.expectedMove : null}
          boardWidth={360}
          arePiecesDraggable={!isSuccess}
        />
      </div>

      {/* Status Feedback */}
      {isSuccess && (
        <div className={styles.successBox}>
          <CheckCircle size={22} color="#10b981" />
          <span>Brilliant! You completed this exercise!</span>
        </div>
      )}

      {errorMessage && !isSuccess && (
        <div className={styles.errorBox}>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Action Controls */}
      <div className={styles.practiceActions}>
        <Button
          variant="glass"
          size="sm"
          icon={Lightbulb}
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={RotateCcw}
          onClick={handleReset}
        >
          Reset Board
        </Button>
      </div>

      {showHint && practice.hint && (
        <div className={styles.hintBox}>
          <strong>Hint: </strong>{practice.hint}
        </div>
      )}
    </div>
  );
}
