import React, { useRef, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { useSettings } from '../../context/SettingsContext';
import { BOARD_THEMES } from '../../chess-engine/chessConstants';
import { getCustomPieces } from './PieceRenderer';
import styles from './ChessboardView.module.css';

export function ChessboardView({
  fen,
  orientation = 'white',
  onPieceDrop,
  onSquareClick,
  selectedSquare,
  possibleMoves = [],
  lastMove,
  inCheck,
  kingSquare,
  hint,
  boardWidth,
  arePiecesDraggable = true
}) {
  const { settings } = useSettings();
  const boardContainerRef = useRef(null);

  // Active board theme colors with real pop contrast
  const currentBoardTheme = useMemo(() => {
    return BOARD_THEMES.find((t) => t.id === settings.boardTheme) || BOARD_THEMES[0];
  }, [settings.boardTheme]);

  // Dynamic 2D / 3D Custom Pieces
  const customPieces = useMemo(() => {
    return getCustomPieces(settings.pieceStyle);
  }, [settings.pieceStyle]);

  // Animation duration
  const animationDuration = useMemo(() => {
    switch (settings.animationSpeed) {
      case 'slow': return 350;
      case 'fast': return 120;
      case 'instant': return 0;
      case 'normal':
      default: return 200;
    }
  }, [settings.animationSpeed]);

  // Compute custom square styles with real pop colors
  const customSquareStyles = useMemo(() => {
    const stylesMap = {};

    // 1. Last Move highlight: Real tournament pop yellow-green
    if (settings.highlightLastMove && lastMove) {
      stylesMap[lastMove.from] = {
        backgroundColor: 'rgba(247, 247, 105, 0.65)'
      };
      stylesMap[lastMove.to] = {
        backgroundColor: 'rgba(247, 247, 105, 0.72)'
      };
    }

    // 2. Selected Piece highlight: Crisp glowing pop yellow
    if (settings.highlightSelectedPiece && selectedSquare) {
      stylesMap[selectedSquare] = {
        backgroundColor: 'rgba(247, 247, 105, 0.82)',
        boxShadow: 'inset 0 0 0 2px rgba(186, 202, 68, 0.9)'
      };
    }

    // 3. Legal move indicators: Real crisp pop dots & capture rings
    if (settings.showLegalMoves && possibleMoves.length > 0) {
      possibleMoves.forEach((move) => {
        const isCapture = !!move.captured;

        if (isCapture && settings.showCaptureSquares) {
          // Capture target: punchy red ring
          stylesMap[move.to] = {
            ...stylesMap[move.to],
            background: 'radial-gradient(circle, transparent 52%, rgba(220, 38, 38, 0.8) 53%, rgba(220, 38, 38, 0.8) 72%, transparent 73%)',
            borderRadius: '50%'
          };
        } else {
          // Normal destination: classic centered dot
          stylesMap[move.to] = {
            ...stylesMap[move.to],
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.24) 25%, transparent 26%)'
          };
        }
      });
    }

    // 4. King in check highlight: Vibrant ruby red warning ring & pulse
    if (settings.checkWarning && inCheck && kingSquare) {
      stylesMap[kingSquare] = {
        ...stylesMap[kingSquare],
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.85) 0%, rgba(185, 28, 28, 0.7) 65%, transparent 70%)',
        boxShadow: 'inset 0 0 14px rgba(220, 38, 38, 0.9), 0 0 18px rgba(220, 38, 38, 0.7)'
      };
    }

    // 5. Engine Hint highlight: Clean vibrant emerald pop
    if (hint) {
      stylesMap[hint.from] = {
        ...stylesMap[hint.from],
        backgroundColor: 'rgba(83, 141, 78, 0.65)'
      };
      stylesMap[hint.to] = {
        ...stylesMap[hint.to],
        backgroundColor: 'rgba(83, 141, 78, 0.78)',
        boxShadow: '0 0 12px rgba(83, 141, 78, 0.85)'
      };
    }

    return stylesMap;
  }, [settings, lastMove, selectedSquare, possibleMoves, inCheck, kingSquare, hint]);

  // Custom arrows for engine hint
  const customArrows = useMemo(() => {
    if (hint && settings.moveSuggestions) {
      return [[hint.from, hint.to, 'rgb(83, 141, 78)']];
    }
    return [];
  }, [hint, settings.moveSuggestions]);

  return (
    <div className={styles.boardWrapper} ref={boardContainerRef}>
      <div className={styles.boardCard}>
        <Chessboard
          position={fen}
          boardOrientation={orientation}
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          customSquareStyles={customSquareStyles}
          customArrows={customArrows}
          customPieces={customPieces}
          showBoardCoordinates={settings.showCoordinates}
          animationDuration={animationDuration}
          arePiecesDraggable={arePiecesDraggable}
          customLightSquareStyle={{ backgroundColor: currentBoardTheme.light }}
          customDarkSquareStyle={{ backgroundColor: currentBoardTheme.dark }}
          boardWidth={boardWidth}
        />
      </div>
    </div>
  );
}