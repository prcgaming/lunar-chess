import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChessboardView } from '../../components/board/ChessboardView';
import { PromotionModal } from '../../components/board/PromotionModal';
import { GameOverModal } from '../../components/game/GameOverModal';
import { CapturedPieces } from '../../components/game/CapturedPieces';
import { MoveHistory } from '../../components/game/MoveHistory';
import { ReplayControls } from '../../components/replay/ReplayControls';
import { Button } from '../../components/common/Button';
import { DifficultySelect } from './DifficultySelect';
import { useChessGame } from '../../hooks/useChessGame';
import { useStockfish } from '../../hooks/useStockfish';
import { useSound } from '../../context/SoundContext';
import { useSettings } from '../../context/SettingsContext';
import { DIFFICULTY_LEVELS } from '../../chess-engine/chessConstants';
import { saveActiveGame, clearActiveGame } from '../../utilities/storage';
import { RotateCcw, Lightbulb, Flag, Bot, User, Maximize2, Minimize2 } from 'lucide-react';
import styles from './PlayAI.module.css';

export function PlayAI({ onHome }) {
  const [inGame, setInGame] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [playerSide, setPlayerSide] = useState('w'); // 'w' | 'b'
  const [boardWidth, setBoardWidth] = useState(480);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const containerRef = useRef(null);
  const { settings } = useSettings();
  const { playSound } = useSound();

  const handleGameOver = useCallback((result) => {
    if (result.winner === 'draw') {
      playSound('check');
    } else if (result.winner === playerSide) {
      playSound('victory');
    } else {
      playSound('checkmate');
    }
    clearActiveGame();
  }, [playerSide, playSound]);

  const handleMoveMade = useCallback((move) => {
    if (move.captured) {
      playSound('capture');
    } else {
      playSound('move');
    }
  }, [playSound]);

  const {
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
    onPieceDrop,
    onSquareClick,
    confirmPromotion,
    cancelPromotion,
    undo,
    resetGame,
    resign
  } = useChessGame({
    onMoveMade: handleMoveMade,
    onGameOver: handleGameOver,
    autoQueen: settings.autoQueenPromotion
  });

  const {
    isThinking,
    hint,
    requestAIMove,
    requestHint,
    clearHint,
    stopCalculation
  } = useStockfish();

  // Toggle Full Screen Mode
  const toggleFullscreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullScreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullScreen(false);
    }
  };

  // Sync with browser native fullscreen exit
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Responsive Board Sizing (Fills entire screen in fullscreen!)
  useEffect(() => {
    const updateSize = () => {
      if (isFullScreen) {
        const availableW = window.innerWidth;
        const availableH = window.innerHeight;
        const maxSquare = Math.min(availableW - 6, availableH - 120);
        setBoardWidth(Math.max(280, Math.floor(maxSquare)));
      } else if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const isMobile = window.innerWidth <= 600;
        let calculated;
        if (isMobile) {
          calculated = Math.min(width - 4, window.innerHeight * 0.62);
        } else {
          calculated = Math.min(width - 16, window.innerHeight * 0.60, 520);
        }
        setBoardWidth(Math.max(280, Math.floor(calculated)));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [inGame, isFullScreen]);

  // Handle AI turn
  useEffect(() => {
    if (!inGame || gameOver || isReplaying) return;

    const isAITurn = turn !== playerSide;
    if (isAITurn && !isThinking) {
      requestAIMove(fen, difficulty).then((aiMove) => {
        if (aiMove) {
          onPieceDrop(aiMove.from, aiMove.to);
        }
      });
    }
  }, [inGame, turn, playerSide, fen, difficulty, gameOver, isThinking, isReplaying, requestAIMove, onPieceDrop]);

  // Save active game to LocalStorage
  useEffect(() => {
    if (inGame && !gameOver) {
      saveActiveGame({
        mode: 'ai',
        fen,
        difficulty,
        playerSide,
        history
      });
    }
  }, [inGame, gameOver, fen, difficulty, playerSide, history]);

  // Start game with selected difficulty
  const handleStartGame = (diff, side) => {
    setDifficulty(diff);
    setPlayerSide(side);
    resetGame();
    setIsReplaying(false);
    clearHint();
    setInGame(true);
  };

  const handleHintClick = () => {
    if (turn === playerSide && !hint) {
      requestHint(fen);
    } else {
      clearHint();
    }
  };

  const handleUndoClick = () => {
    if (isThinking) return;
    clearHint();
    undo(turn === playerSide ? 2 : 1);
  };

  const handleResign = () => {
    resign(playerSide);
  };

  const handleRematch = () => {
    resetGame();
    setIsReplaying(false);
    clearHint();
  };

  const handleEnterReplay = () => {
    setIsReplaying(true);
    setReplayIndex(history.length - 1);
  };

  // Replay board state
  const replayFen = React.useMemo(() => {
    if (!isReplaying || replayIndex === -1 || history.length === 0) {
      return isReplaying && replayIndex === -1 ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : fen;
    }
    const targetMove = history[replayIndex];
    return targetMove ? targetMove.after : fen;
  }, [isReplaying, replayIndex, history, fen]);

  const replayLastMove = React.useMemo(() => {
    if (!isReplaying || replayIndex === -1 || history.length === 0) return null;
    const target = history[replayIndex];
    return target ? { from: target.from, to: target.to } : null;
  }, [isReplaying, replayIndex, history]);

  const currentDiffConfig = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.medium;

  if (!inGame) {
    return <DifficultySelect onStartGame={handleStartGame} onBack={onHome} />;
  }

  return (
    <div className={`${styles.gameContainer} ${isFullScreen ? styles.fullscreenMode : ''}`} ref={containerRef}>
      {/* Top Header in Fullscreen */}
      {isFullScreen && (
        <div className={styles.fsHeader}>
          <div className={styles.playerInfo}>
            <span style={{ fontSize: '1.4rem' }}>{turn === playerSide ? '♔ Your Turn' : '♚ AI Thinking...'}</span>
          </div>
          <Button
            variant="glass"
            size="sm"
            icon={Minimize2}
            onClick={toggleFullscreen}
            title="Exit Fullscreen"
          >
            Exit
          </Button>
        </div>
      )}

      {/* Top HUD: Opponent (AI) - Hidden in Fullscreen for maximum board */}
      {!isFullScreen && (
        <div className={styles.hudCard}>
          <div className={styles.playerInfo}>
            <div className={styles.avatarWrap} style={{ background: currentDiffConfig.color }}>
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <div className={styles.playerName}>
                Lunar AI ({currentDiffConfig.name})
                {isThinking && <span className={styles.thinkingBadge}>Thinking...</span>}
              </div>
              <CapturedPieces
                pieces={playerSide === 'w' ? captured.whiteCaptured : captured.blackCaptured}
                advantage={playerSide === 'w' ? -captured.advantage : captured.advantage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chessboard View (Maximized in Fullscreen) */}
      <div className={styles.boardArea}>
        <ChessboardView
          fen={isReplaying ? replayFen : fen}
          orientation={playerSide === 'w' ? 'white' : 'black'}
          onPieceDrop={isReplaying ? () => false : onPieceDrop}
          onSquareClick={isReplaying ? () => {} : onSquareClick}
          selectedSquare={isReplaying ? null : selectedSquare}
          possibleMoves={isReplaying ? [] : possibleMoves}
          lastMove={isReplaying ? replayLastMove : lastMove}
          inCheck={isReplaying ? false : inCheck}
          kingSquare={isReplaying ? null : kingInCheckSquare}
          hint={isReplaying ? null : hint}
          boardWidth={boardWidth}
          arePiecesDraggable={!isReplaying && turn === playerSide && !isThinking}
        />
      </div>

      {/* Bottom HUD: Player - Hidden in Fullscreen for maximum board */}
      {!isFullScreen && (
        <div className={styles.hudCard}>
          <div className={styles.playerInfo}>
            <div className={styles.avatarWrap} style={{ background: 'var(--accent-primary)' }}>
              <User size={22} color="#ffffff" />
            </div>
            <div>
              <div className={styles.playerName}>You ({playerSide === 'w' ? 'White' : 'Black'})</div>
              <CapturedPieces
                pieces={playerSide === 'w' ? captured.blackCaptured : captured.whiteCaptured}
                advantage={playerSide === 'w' ? captured.advantage : -captured.advantage}
              />
            </div>
          </div>
        </div>
      )}

      {/* In-Game Action Buttons */}
      {!isReplaying && !gameOver && (
        <div className={styles.actionBtns}>
          <Button
            variant="glass"
            size="sm"
            icon={isFullScreen ? Minimize2 : Maximize2}
            onClick={toggleFullscreen}
            title={isFullScreen ? 'Exit Fullscreen' : 'Full Screen Board'}
          >
            {isFullScreen ? 'Exit Fullscreen' : 'Full Screen Board'}
          </Button>

          {settings.moveSuggestions && (
            <Button
              variant="glass"
              size="sm"
              icon={Lightbulb}
              onClick={handleHintClick}
              disabled={turn !== playerSide || isThinking}
              title="Get Best Move Hint"
            >
              {hint ? 'Hide' : 'Hint'}
            </Button>
          )}

          <Button
            variant="glass"
            size="sm"
            icon={RotateCcw}
            onClick={handleUndoClick}
            disabled={history.length === 0 || isThinking}
            title="Undo Last Move"
          >
            Undo
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={Flag}
            onClick={handleResign}
            title="Resign Game"
          >
            Resign
          </Button>
        </div>
      )}

      {/* Replay Controls / Move History (Hidden during active Fullscreen) */}
      {!isFullScreen && (
        isReplaying ? (
          <div className={styles.replayWrap}>
            <ReplayControls
              currentIndex={replayIndex}
              totalMoves={history.length}
              onGoToMove={setReplayIndex}
              isPlaying={isAutoPlaying}
              setIsPlaying={setIsAutoPlaying}
            />
            <Button variant="secondary" size="md" onClick={() => setIsReplaying(false)}>
              Back to Game Over Screen
            </Button>
          </div>
        ) : (
          <div className={styles.historyWrap}>
            <MoveHistory history={history} />
          </div>
        )
      )}

      {/* Promotion Modal */}
      <PromotionModal
        isOpen={!!pendingPromotion}
        color={playerSide}
        onSelect={confirmPromotion}
        onCancel={cancelPromotion}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameOver && !isReplaying}
        result={gameOverResult}
        playerColor={playerSide}
        isVsAI={true}
        onRematch={handleRematch}
        onReplay={handleEnterReplay}
        onHome={onHome}
      />
    </div>
  );
}