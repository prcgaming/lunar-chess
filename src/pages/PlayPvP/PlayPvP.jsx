import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChessboardView } from '../../components/board/ChessboardView';
import { PromotionModal } from '../../components/board/PromotionModal';
import { GameOverModal } from '../../components/game/GameOverModal';
import { CapturedPieces } from '../../components/game/CapturedPieces';
import { MoveHistory } from '../../components/game/MoveHistory';
import { TimerDisplay } from '../../components/game/TimerDisplay';
import { SingleTurnClock } from '../../components/game/SingleTurnClock';
import { ReplayControls } from '../../components/replay/ReplayControls';
import { TimeControlModal } from './TimeControlModal';
import { Button } from '../../components/common/Button';
import { useChessGame } from '../../hooks/useChessGame';
import { useChessTimer } from '../../hooks/useChessTimer';
import { useSound } from '../../context/SoundContext';
import { useSettings } from '../../context/SettingsContext';
import { RotateCcw, Flag, RefreshCw, Play, Pause, Maximize2, Minimize2 } from 'lucide-react';
import styles from './PlayPvP.module.css';

export function PlayPvP({ onHome }) {
  const [setupOpen, setSetupOpen] = useState(true);
  const [timeControl, setTimeControl] = useState(600);
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
    playSound(result.winner === 'draw' ? 'check' : 'victory');
  }, [playSound]);

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
      switchTurn(nextPlayer);
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
    switchTurn,
    isUnlimited
  } = useChessTimer({
    initialSeconds: timeControl,
    onTimeOut: (loserColor) => {
      timeOut(loserColor);
    }
  });

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

  // Sync with browser native fullscreen exit (Escape / Android back)
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

  // Responsive board sizing: in fullscreen, fills the entire screen!
  useEffect(() => {
    const updateSize = () => {
      if (isFullScreen) {
        const availableW = window.innerWidth;
        const availableH = window.innerHeight;
        // Maximize board to fill viewport while keeping top clock & bottom controls visible
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
  }, [isFullScreen]);

  // Start match
  const handleStartMatch = (selectedSeconds, autoFlip) => {
    setTimeControl(selectedSeconds);
    setAutoFlipBoard(autoFlip);
    setBoardOrientation('white');
    resetGame();
    timerReset(selectedSeconds);
    setSetupOpen(false);
    setIsReplaying(false);
    if (selectedSeconds) {
      timerStart('w');
    }
  };

  const handleFlipOrientation = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  const handleRematch = () => {
    resetGame();
    timerReset(timeControl);
    setIsReplaying(false);
    setBoardOrientation('white');
    if (timeControl) {
      timerStart('w');
    }
  };

  const handleEnterReplay = () => {
    setIsReplaying(true);
    setReplayIndex(history.length - 1);
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

  return (
    <div className={`${styles.gameContainer} ${isFullScreen ? styles.fullscreenMode : ''}`} ref={containerRef}>
      {/* Time Control Setup Modal */}
      <TimeControlModal
        isOpen={setupOpen}
        onSelectTime={handleStartMatch}
        onCancel={onHome}
      />

      {/* Top Bar in Fullscreen vs Standard Mode */}
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
            className={styles.exitFsBtn}
            title="Exit Fullscreen"
          >
            Exit
          </Button>
        </div>
      ) : (
        !isReplaying && (
          <SingleTurnClock
            turn={turn}
            whiteTime={whiteTime}
            blackTime={blackTime}
            isUnlimited={isUnlimited}
            isPaused={!timerIsRunning && !isUnlimited && !gameOver}
            gameOver={gameOver}
          />
        )
      )}

      {/* Top Player HUD (Hidden in Fullscreen for maximum board space, visible in normal) */}
      {!isFullScreen && (
        <div className={`${styles.hudCard} ${turn === 'b' && !gameOver ? styles.activeHudCard : styles.inactiveHudCard}`}>
          <div className={styles.playerInfo}>
            <div className={styles.avatarBlack}>♚</div>
            <div>
              <div className={styles.playerName}>
                Black Player {turn === 'b' && !gameOver && <span className={styles.turnBadge}>Turn</span>}
              </div>
              <CapturedPieces pieces={captured.blackCaptured} advantage={-captured.advantage} />
            </div>
          </div>
          <div className={styles.desktopTimerWrap}>
            <TimerDisplay
              seconds={blackTime}
              isCurrentTurn={turn === 'b' && !gameOver}
              isUnlimited={isUnlimited}
              label="Black"
            />
          </div>
        </div>
      )}

      {/* Chessboard Area (Maximized in Fullscreen) */}
      <div className={styles.boardArea}>
        {/* Top Side Pieces Head (Black) */}
        <div className={`${styles.boardSideIndicator} ${turn === 'b' && !gameOver ? styles.activeBoardSide : ''}`}>
          <div className={styles.boardSideLeft}>
            <span className={styles.boardSidePiece}>♚</span>
            <span className={styles.boardSideName}>Black</span>
          </div>
          {turn === 'b' && !gameOver && <span className={styles.sideTurnPulse}>To Move</span>}
        </div>

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
          boardWidth={boardWidth}
          arePiecesDraggable={!isReplaying && !gameOver}
        />

        {/* Bottom Side Pieces Head (White) */}
        <div className={`${styles.boardSideIndicator} ${turn === 'w' && !gameOver ? styles.activeBoardSide : ''}`}>
          <div className={styles.boardSideLeft}>
            <span className={styles.boardSidePiece}>♔</span>
            <span className={styles.boardSideName}>White</span>
          </div>
          {turn === 'w' && !gameOver && <span className={styles.sideTurnPulse}>To Move</span>}
        </div>
      </div>

      {/* Bottom Player HUD (Hidden in Fullscreen for maximum board space, visible in normal) */}
      {!isFullScreen && (
        <div className={`${styles.hudCard} ${turn === 'w' && !gameOver ? styles.activeHudCard : styles.inactiveHudCard}`}>
          <div className={styles.playerInfo}>
            <div className={styles.avatarWhite}>♔</div>
            <div>
              <div className={styles.playerName}>
                White Player {turn === 'w' && !gameOver && <span className={styles.turnBadge}>Turn</span>}
              </div>
              <CapturedPieces pieces={captured.whiteCaptured} advantage={captured.advantage} />
            </div>
          </div>
          <div className={styles.desktopTimerWrap}>
            <TimerDisplay
              seconds={whiteTime}
              isCurrentTurn={turn === 'w' && !gameOver}
              isUnlimited={isUnlimited}
              label="White"
            />
          </div>
        </div>
      )}

      {/* Match Controls Bar */}
      {!isReplaying && !gameOver && (
        <div className={styles.controlsBar}>
          <Button
            variant="glass"
            size="sm"
            icon={isFullScreen ? Minimize2 : Maximize2}
            onClick={toggleFullscreen}
            title={isFullScreen ? 'Exit Fullscreen' : 'Full Screen Board'}
          >
            {isFullScreen ? 'Exit Fullscreen' : 'Full Screen Board'}
          </Button>

          <Button variant="glass" size="sm" icon={RefreshCw} onClick={handleFlipOrientation} title="Flip Board Perspective">
            Flip
          </Button>

          {!isUnlimited && (
            <Button
              variant="glass"
              size="sm"
              icon={timerIsRunning ? Pause : Play}
              onClick={timerIsRunning ? timerPause : timerResume}
            >
              {timerIsRunning ? 'Pause' : 'Resume'}
            </Button>
          )}

          <Button variant="glass" size="sm" icon={RotateCcw} onClick={() => undo(1)} disabled={history.length === 0}>
            Undo
          </Button>

          <Button variant="danger" size="sm" icon={Flag} onClick={() => resign(turn)}>
            Resign
          </Button>
        </div>
      )}

      {/* Replay Controls / Move History (Hidden during active Fullscreen to preserve massive board) */}
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
        color={turn}
        onSelect={confirmPromotion}
        onCancel={cancelPromotion}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameOver && !isReplaying}
        result={gameOverResult}
        isVsAI={false}
        onRematch={handleRematch}
        onReplay={handleEnterReplay}
        onHome={onHome}
      />
    </div>
  );
}