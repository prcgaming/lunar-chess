import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import confetti from 'canvas-confetti';
import { ChessboardView } from '../../components/board/ChessboardView';
import { Button } from '../../components/common/Button';
import { useSound } from '../../context/SoundContext';
import { CheckCircle, Lightbulb, RotateCcw, Target, Sparkles, AlertCircle } from 'lucide-react';
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
  const [boardWidth, setBoardWidth] = useState(360);

  const containerRef = useRef(null);
  const { playSound } = useSound();

  // Responsive board width calculation
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const target = Math.min(460, Math.max(280, containerWidth - 32));
        setBoardWidth(target);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
    if (isSuccess) return false;

    try {
      // Validate legal move first
      const move = chess.move({ from, to, promotion: 'q' });
      if (!move) {
        setErrorMessage('That move is not legal according to chess rules. Try again!');
        playSound('check');
        return false;
      }

      // Check if it satisfies the lesson target move
      const exp = practice.expectedMove;
      const matchesTarget = (!exp.from || exp.from === from) && exp.to === to;

      if (matchesTarget) {
        setFen(chess.fen());
        setLastMove({ from, to });
        setSelectedSquare(null);
        setPossibleMoves([]);
        setIsSuccess(true);
        setErrorMessage(null);
        playSound('victory');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch {}
        if (onComplete) onComplete();
        return true;
      } else {
        // Legal move, but NOT the targeted solution for this lesson drill
        chess.undo(); // Undo immediately so board stays in sync!
        playSound('check');
        setErrorMessage('Good move, but not the targeted move for this exercise. Try again or click "Show Hint"!');
        return false; // Snap back immediately in react-chessboard!
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
        const success = handleMoveAttempt(selectedSquare, square);
        if (success) {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
        return;
      }
    }

    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setPossibleMoves(moves);
      playSound('click');
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
    playSound('click');
  };

  const isWhiteTurn = chess.turn() === 'w';

  return (
    <div className={styles.practiceWrapper} ref={containerRef}>
      {/* Turn indicator & Mission */}
      <div className={styles.instructionBanner}>
        <div className={styles.instructionIcon}>
          <Target size={20} />
        </div>
        <div className={styles.instructionText}>
          <div className={styles.turnBadgeRow}>
            <span className={styles.instructionLabel}>Your Mission</span>
            <span className={styles.turnIndicator}>
              {isWhiteTurn ? '⚪ White to Play' : '⚫ Black to Play'}
            </span>
          </div>
          <p>{practice.instruction}</p>
        </div>
      </div>

      <div className={styles.boardBox}>
        <ChessboardView
          fen={fen}
          orientation={isWhiteTurn ? 'white' : 'black'}
          onPieceDrop={handleMoveAttempt}
          onSquareClick={onSquareClick}
          selectedSquare={selectedSquare}
          possibleMoves={possibleMoves}
          lastMove={lastMove}
          hint={showHint ? practice.expectedMove : null}
          boardWidth={boardWidth}
          arePiecesDraggable={!isSuccess}
        />
      </div>

      {/* Status Feedback */}
      {isSuccess && (
        <div className={styles.successBox}>
          <CheckCircle size={22} color="#538d4e" />
          <span>Brilliant! Move executed perfectly!</span>
        </div>
      )}

      {errorMessage && !isSuccess && (
        <div className={styles.errorBox}>
          <AlertCircle size={18} />
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
          <strong>💡 Hint: </strong>{practice.hint}
        </div>
      )}
    </div>
  );
}