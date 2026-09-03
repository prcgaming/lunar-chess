import { useState, useCallback, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import { calculateCapturedPieces, getKingSquare } from '../utilities/fenHelper';

export function useChessGame({ onMoveMade, onGameOver, autoQueen = false } = {}) {
  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [history, setHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);

  const [gameOver, setGameOver] = useState(false);
  const [gameOverResult, setGameOverResult] = useState(null); // { winner: 'w'|'b'|'draw', reason: string }

  const checkGameEnd = useCallback((game) => {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'b' : 'w';
      const result = { winner, reason: 'checkmate' };
      setGameOver(true);
      setGameOverResult(result);
      if (onGameOver) onGameOver(result);
      return true;
    }
    if (game.isStalemate()) {
      const result = { winner: 'draw', reason: 'stalemate' };
      setGameOver(true);
      setGameOverResult(result);
      if (onGameOver) onGameOver(result);
      return true;
    }
    if (game.isThreefoldRepetition()) {
      const result = { winner: 'draw', reason: 'threefold' };
      setGameOver(true);
      setGameOverResult(result);
      if (onGameOver) onGameOver(result);
      return true;
    }
    if (game.isInsufficientMaterial()) {
      const result = { winner: 'draw', reason: 'insufficient' };
      setGameOver(true);
      setGameOverResult(result);
      if (onGameOver) onGameOver(result);
      return true;
    }
    if (game.isDraw()) {
      const result = { winner: 'draw', reason: 'fifty-move' };
      setGameOver(true);
      setGameOverResult(result);
      if (onGameOver) onGameOver(result);
      return true;
    }
    return false;
  }, [onGameOver]);

  const executeMove = useCallback((moveData) => {
    try {
      const game = chessRef.current;
      const move = game.move(moveData);
      if (!move) return null;

      const newFen = game.fen();
      setFen(newFen);
      setHistory([...game.history({ verbose: true })]);
      setLastMove({ from: move.from, to: move.to });
      setSelectedSquare(null);
      setPossibleMoves([]);

      checkGameEnd(game);

      if (onMoveMade) {
        onMoveMade(move, newFen);
      }
      return move;
    } catch (e) {
      console.warn('Illegal move attempted:', e);
      return null;
    }
  }, [checkGameEnd, onMoveMade]);

  // Check if a move is a pawn promotion
  const isPromotionMove = useCallback((from, to) => {
    const game = chessRef.current;
    const piece = game.get(from);
    if (!piece || piece.type !== 'p') return false;
    const targetRank = to[1];
    return (piece.color === 'w' && targetRank === '8') || (piece.color === 'b' && targetRank === '1');
  }, []);

  const makeMove = useCallback((from, to, promotion = 'q') => {
    if (gameOver) return false;
    const move = executeMove({ from, to, promotion });
    return !!move;
  }, [gameOver, executeMove]);

  // Drag & drop drop handler
  const onPieceDrop = useCallback((sourceSquare, targetSquare) => {
    if (gameOver) return false;

    // Check if requires promotion dialog
    if (isPromotionMove(sourceSquare, targetSquare)) {
      if (autoQueen) {
        return !!executeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      } else {
        setPendingPromotion({ from: sourceSquare, to: targetSquare });
        return true;
      }
    }

    const move = executeMove({ from: sourceSquare, to: targetSquare });
    return !!move;
  }, [gameOver, isPromotionMove, autoQueen, executeMove]);

  // Tap-to-move square click handler
  const onSquareClick = useCallback((square) => {
    if (gameOver) return;
    const game = chessRef.current;

    // If square is already selected, unselect it
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    // If a piece is already selected, attempt to move to clicked square
    if (selectedSquare) {
      const isLegalDestination = possibleMoves.some((m) => m.to === square);
      if (isLegalDestination) {
        if (isPromotionMove(selectedSquare, square)) {
          if (autoQueen) {
            executeMove({ from: selectedSquare, to: square, promotion: 'q' });
          } else {
            setPendingPromotion({ from: selectedSquare, to: square });
          }
          return;
        }

        const move = executeMove({ from: selectedSquare, to: square });
        if (move) return;
      }
    }

    // Select new piece if it belongs to active player
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setPossibleMoves(moves);
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  }, [gameOver, selectedSquare, possibleMoves, isPromotionMove, autoQueen, executeMove]);

  const confirmPromotion = useCallback((pieceType = 'q') => {
    if (!pendingPromotion) return;
    executeMove({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: pieceType
    });
    setPendingPromotion(null);
  }, [pendingPromotion, executeMove]);

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  const undo = useCallback((steps = 1) => {
    const game = chessRef.current;
    let undone = false;
    for (let i = 0; i < steps; i++) {
      const res = game.undo();
      if (res) undone = true;
    }
    if (undone) {
      setFen(game.fen());
      const hist = game.history({ verbose: true });
      setHistory([...hist]);
      if (hist.length > 0) {
        const last = hist[hist.length - 1];
        setLastMove({ from: last.from, to: last.to });
      } else {
        setLastMove(null);
      }
      setSelectedSquare(null);
      setPossibleMoves([]);
      setGameOver(false);
      setGameOverResult(null);
    }
    return undone;
  }, []);

  const resetGame = useCallback((newFen) => {
    if (newFen) {
      chessRef.current = new Chess(newFen);
    } else {
      chessRef.current = new Chess();
    }
    setFen(chessRef.current.fen());
    setHistory([]);
    setLastMove(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setPendingPromotion(null);
    setGameOver(false);
    setGameOverResult(null);
  }, []);

  const resign = useCallback((playerColor) => {
    const winner = playerColor === 'w' ? 'b' : 'w';
    const result = { winner, reason: 'resignation' };
    setGameOver(true);
    setGameOverResult(result);
    if (onGameOver) onGameOver(result);
  }, [onGameOver]);

  const timeOut = useCallback((playerColor) => {
    const winner = playerColor === 'w' ? 'b' : 'w';
    const result = { winner, reason: 'timeout' };
    setGameOver(true);
    setGameOverResult(result);
    if (onGameOver) onGameOver(result);
  }, [onGameOver]);

  // Derived state
  const turn = chessRef.current.turn();
  const inCheck = chessRef.current.inCheck();
  const kingInCheckSquare = inCheck ? getKingSquare(chessRef.current, turn) : null;
  const captured = useMemo(() => calculateCapturedPieces(fen), [fen]);

  return {
    chess: chessRef.current,
    fen,
    turn,
    history,
    lastMove,
    selectedSquare,
    possibleMoves,
    pendingPromotion,
    gameOver,
    gameOverResult,
    inCheck,
    kingInCheckSquare,
    captured,
    makeMove,
    onPieceDrop,
    onSquareClick,
    confirmPromotion,
    cancelPromotion,
    undo,
    resetGame,
    resign,
    timeOut
  };
}
