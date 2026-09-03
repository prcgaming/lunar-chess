import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChessboardView } from '../../components/board/ChessboardView';
import { PromotionModal } from '../../components/board/PromotionModal';
import { GameOverModal } from '../../components/game/GameOverModal';
import { CapturedPieces } from '../../components/game/CapturedPieces';
import { MoveHistory } from '../../components/game/MoveHistory';
import { TimerDisplay } from '../../components/game/TimerDisplay';
import { SingleTurnClock } from '../../components/game/SingleTurnClock';
import { ReplayControls } from '../../components/replay/ReplayControls';
import { Button } from '../../components/common/Button';
import { DifficultySelect } from './DifficultySelect';
import { useChessGame } from '../../hooks/useChessGame';
import { useStockfish } from '../../hooks/useStockfish';
import { useChessTimer } from '../../hooks/useChessTimer';
import { useSound } from '../../context/SoundContext';
import { useSettings } from '../../context/SettingsContext';
import { DIFFICULTY_LEVELS } from '../../chess-engine/chessConstants';
import { saveActiveGame, clearActiveGame } from '../../utilities/storage';
import { RotateCcw, Lightbulb, Flag, Bot, User, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import styles from './PlayAI.module.css';

export function PlayAI({ onHome }) {
  const [inGame, setInGame] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [playerSide, setPlayerSide] = useState('w'); // 'w' | 'b'
  const [boardOrientation, setBoardOrientation] = useState('white');
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
    resign,
    timeOut
  } = useChessGame({
    onMoveMade: (move) => {
      handleMoveMade(move);
      const nextPlayer = move.color === 'w' ? 'b' : 'w';
      timerSwitchTurn(nextPlayer);
    },
    onGameOver: (res) => {
      handleGameOver(res);
      timerPause();
    },
    autoQueen: settings.autoQueenPromotion
  });

  const {
    whiteTime,
    blackTime,
    isRunning: timerIsRunning,
    start: timerStart,
    pause: timerPause,
    resume: timerResume,
    reset: timerReset,
    switchTurn: timerSwitchTurn,
    isUnlimited
  } = useChessTimer({
    initialSeconds: 600, // 10 minutes match clock
    onTimeOut: (loserColor) => {
      timeOut(loserColor);
      timerPause();
    }
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

  // Responsive board sizing: in fullscreen, fills the viewport
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
          calculated = Math.min(width - 8, window.innerHeight * 0.52);
        } else {
          calculated = Math.min(width - 32, 540);
        }
        setBoardWidth(Math.max(280, Math.floor(calculated)));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullScreen]);

  // Handle AI turn
  useEffect(() => {
    if (!inGame || isReplaying) return;

    if (turn !== playerSide && !gameOver && !isThinking) {
      requestAIMove(fen, difficulty).then((aiMove) => {
        if (aiMove) {
          onPieceDrop(aiMove.from, aiMove.to, aiMove.promotion);
        }
      });
    }
  }, [turn, inGame, isReplaying, playerSide, gameOver, fen, difficulty, isThinking, requestAIMove, onPieceDrop]);

  // Persist game state
  useEffect(() => {
    if (inGame && !gameOver) {
      saveActiveGame({
        fen,
        history,
        mode: 'ai',
        difficulty,
        playerSide,
        captured,
        gameOver: false
      });
    }
  }, [fen, history, inGame, gameOver, difficulty, playerSide, captured]);

  // Start new game
  const handleStartGame = (chosenDiff, chosenSide) => {
    setDifficulty(chosenDiff);
    setPlayerSide(chosenSide);
    setBoardOrientation(chosenSide === 'w' ? 'white' : 'black');
    setInGame(true);
    resetGame();
    clearHint();
    setIsReplaying(false);
    timerReset(600);
    timerStart('w');
  };

  const handleFlipOrientation = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  // Replay
  const handleEnterReplay = () => {
    setIsReplaying(true);
    setReplayIndex(history.length - 1);
  };

  const handleRematch = () => {
    stopCalculation();
    clearHint();
    resetGame();
    setIsReplaying(false);
    setBoardOrientation(playerSide === 'w' ? 'white' : 'black');
    timerReset(600);
    timerStart('w');
  };

  const handleHintClick = () => {
    if (hint) {
      clearHint();
    } else {
      requestHint(fen, difficulty);
    }
  };

  const handleUndoClick = () => {
    if (isThinking) return;
    clearHint();
    const stepsBack = turn === playerSide ? 2 : 1;
    undo(stepsBack);
  };

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

  const isAiTurn = turn !== playerSide;

  return (
    <div className={`${styles.gameContainer} ${isFullScreen ? styles.fullscreenMode : ''}`} ref={containerRef}>
      {/* Top Header in Fullscreen */}
      {isFullScreen ? (
        <div className={styles.fsHeader}>
          <SingleTurnClock
            turn={turn}
            whiteTime={whiteTime}
            blackTime={blackTime}
            isUnlimited={isUnlimited}
            isPaused={!timerIsRunning && !isUnlimited && !gameOver}
            gameOver={gameOver}
          />
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
      ) : null}

      {/* Top HUD: Opponent (AI) */}
      {!isFullScreen && (
        <div className={`${styles.hudCard} ${isAiTurn && !gameOver ? styles.activeHudCard : styles.inactiveHudCard}`}>
          <div className={styles.playerInfo}>
            <div className={styles.avatarWrap} style={{ background: currentDiffConfig.color }}>
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <div className={styles.playerName}>
                Lunar AI ({currentDiffConfig.name})
                {isAiTurn && !gameOver && (
                  <span className={styles.thinkingBadge}>{isThinking ? 'Thinking...' : 'Turn'}</span>
                )}
              </div>
              <CapturedPieces
                pieces={playerSide === 'w' ? captured.whiteCaptured : captured.blackCaptured}
                advantage={playerSide === 'w' ? -captured.advantage : captured.advantage}
              />
            </div>
          </div>

          <div className={styles.desktopTimerWrap}>
            <TimerDisplay
              seconds={playerSide === 'w' ? blackTime : whiteTime}
              isCurrentTurn={isAiTurn && !gameOver}
              isUnlimited={isUnlimited}
              label="AI Engine"
            />
          </div>
        </div>
      )}

      {/* Chessboard View (Maximized in Fullscreen) */}
      <div className={styles.boardArea}>
        <ChessboardView
          fen={isReplaying ? replayFen : fen}
          orientation={boardOrientation}
          onPieceDrop={isReplaying ? () => false : onPieceDrop}
          onSquareClick={isReplaying ? () => {} : onSquareClick}
          selectedSquare={isReplaying ? null : selectedSquare}
          possibleMoves={isReplaying ? [] : possibleMoves}
          lastMove={isReplaying ? replayLastMove : lastMove}
          inCheck={isReplaying ? false : inCheck}
          kingSquare={isReplaying ? null : kingInCheckSquare}
          hint={isReplaying ? null : hint}
          boardWidth={boardWidth}
          arePiecesDraggable={!isReplaying && turn === playerSide && !isThinking && !gameOver}
        />
      </div>

      {/* Bottom HUD: Player */}
      {!isFullScreen && (
        <div className={`${styles.hudCard} ${!isAiTurn && !gameOver ? styles.activeHudCard : styles.inactiveHudCard}`}>
          <div className={styles.playerInfo}>
            <div className={styles.avatarWrap} style={{ background: 'var(--accent-primary)' }}>
              <User size={22} color="#ffffff" />
            </div>
            <div>
              <div className={styles.playerName}>
                You ({playerSide === 'w' ? 'White' : 'Black'})
                {!isAiTurn && !gameOver && <span className={styles.turnBadge}>Your Turn</span>}
              </div>
              <CapturedPieces
                pieces={playerSide === 'w' ? captured.blackCaptured : captured.whiteCaptured}
                advantage={playerSide === 'w' ? captured.advantage : -captured.advantage}
              />
            </div>
          </div>

          <div className={styles.desktopTimerWrap}>
            <TimerDisplay
              seconds={playerSide === 'w' ? whiteTime : blackTime}
              isCurrentTurn={!isAiTurn && !gameOver}
              isUnlimited={isUnlimited}
              label="You"
            />
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
            {isFullScreen ? 'Exit' : 'Full Screen'}
          </Button>

          <Button
            variant="glass"
            size="sm"
            icon={RefreshCw}
            onClick={handleFlipOrientation}
            title="Flip Board Perspective"
          >
            Flip
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

          <Button variant="danger" size="sm" icon={Flag} onClick={() => resign(playerSide)}>
            Resign
          </Button>
        </div>
      )}

      {/* Replay Controls / Move History */}
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
        isOpen={gameOver}
        result={gameOverResult}
        playerSide={playerSide}
        history={history}
        onRematch={handleRematch}
        onReplay={handleEnterReplay}
        onHome={onHome}
      />
    </div>
  );
}