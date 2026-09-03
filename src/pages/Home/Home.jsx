import React, { useState, useEffect } from 'react';
import { Bot, Users, BookOpen, Settings, Play, Flame, Sparkles, Smartphone, Download } from 'lucide-react';
import { DownloadModal } from '../../components/download/DownloadModal';
import { loadActiveGame } from '../../utilities/storage';
import { useSound } from '../../context/SoundContext';
import { useSettings } from '../../context/SettingsContext';
import styles from './Home.module.css';

export function Home({ onNavigate }) {
  const { playSound } = useSound();
  const { settings, updateSetting } = useSettings();
  const [activeSavedGame, setActiveSavedGame] = useState(null);
  const [downloadOpen, setDownloadOpen] = useState(false);

  useEffect(() => {
    const saved = loadActiveGame();
    if (saved && !saved.gameOver) {
      setActiveSavedGame(saved);
    }
  }, []);

  const handleCardClick = (view) => {
    playSound('click');
    onNavigate(view);
  };

  const handleResume = () => {
    playSound('click');
    if (activeSavedGame) {
      onNavigate(activeSavedGame.mode === 'ai' ? 'play-ai' : 'play-pvp');
    }
  };

  const handleQuickTheme = (themeName) => {
    playSound('click');
    updateSetting('theme', themeName);
  };

  return (
    <div className={styles.container}>
      {/* Hero Header Section with King & Queen */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Professional Offline Chess Experience</span>
        </div>

        {/* Title row flanked by King and Queen */}
        <div className={styles.titleRow}>
          {/* King on the left */}
          <div className={`${styles.royalPiece} ${styles.royalKing}`} title="The King">
            <div className={styles.pieceAura} />
            <span className={styles.pieceGlyph}>♚</span>
            <div className={styles.pieceLabel}>King</div>
          </div>

          {/* Central Title */}
          <div className={styles.titleCenter}>
            <h1 className={styles.title}>
              LUNAR <span className={styles.highlight}>CHESS</span>
            </h1>
            <p className={styles.subtitle}>Play & Learn</p>
          </div>

          {/* Queen on the right */}
          <div className={`${styles.royalPiece} ${styles.royalQueen}`} title="The Queen">
            <div className={styles.pieceAura} />
            <span className={styles.pieceGlyph}>♛</span>
            <div className={styles.pieceLabel}>Queen</div>
          </div>
        </div>

        <p className={styles.description}>
          Master the royal game with intelligent Chess AI, 2D & 3D carved pieces, local multiplayer timers, and 23 interactive lessons.
        </p>

        {/* Quick Style Switcher Pills */}
        <div className={styles.stylePills}>
          <button
            className={`${styles.pillBtn} ${settings.theme === 'classic' ? styles.pillActive : ''}`}
            onClick={() => handleQuickTheme('classic')}
          >
            🏛️ Classic Wood
          </button>
          <button
            className={`${styles.pillBtn} ${settings.theme === 'dark' ? styles.pillActive : ''}`}
            onClick={() => handleQuickTheme('dark')}
          >
            🌙 Lunar Dark
          </button>
          <button
            className={`${styles.pillBtn} ${settings.theme === 'light' ? styles.pillActive : ''}`}
            onClick={() => handleQuickTheme('light')}
          >
            ☀️ Crisp Light
          </button>
        </div>

        {/* Download Now Button (Opens options modal) */}
        <div className={styles.downloadHeroWrap}>
          <button
            className={styles.downloadApkBtn}
            onClick={() => {
              playSound('click');
              setDownloadOpen(true);
            }}
            title="Download Lunar Chess"
          >
            <Smartphone size={19} />
            <span>Download Now</span>
            <Download size={16} />
          </button>
        </div>

        {/* Resume Banner */}
        {activeSavedGame && (
          <div className={styles.resumeBanner}>
            <div className={styles.resumeInfo}>
              <Flame size={20} className={styles.flameIcon} />
              <div>
                <strong>Unfinished Game Detected</strong>
                <p>Mode: {activeSavedGame.mode === 'ai' ? 'Vs AI Engine' : '2-Player Local'}</p>
              </div>
            </div>
            <button className={styles.resumeBtn} onClick={handleResume}>
              <Play size={16} fill="currentColor" />
              Resume Game
            </button>
          </div>
        )}
      </section>

      {/* Main Navigation Grid */}
      <section className={styles.grid}>
        {/* Play with AI Card */}
        <div className={`${styles.card} ${styles.aiCard}`} onClick={() => handleCardClick('play-ai')}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconWrap} ${styles.aiIcon}`}>
              <Bot size={28} />
            </div>
            <span className={styles.cardTag}>6 Difficulty Levels</span>
          </div>
          <h3 className={styles.cardTitle}>Play with AI</h3>
          <p className={styles.cardDesc}>
            Challenge the smart engine from Beginner (~400 ELO) to Grandmaster (~2400 ELO).
          </p>
          <div className={styles.cardFooter}>
            <span>Lunar Chess AI</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>

        {/* Play vs Player Card */}
        <div className={`${styles.card} ${styles.pvpCard}`} onClick={() => handleCardClick('play-pvp')}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconWrap} ${styles.pvpIcon}`}>
              <Users size={28} />
            </div>
            <span className={styles.cardTag}>Same Device</span>
          </div>
          <h3 className={styles.cardTitle}>Play vs Player</h3>
          <p className={styles.cardDesc}>
            Pass and play with a friend. Official chess rules, dual clocks (1m to 30m), and replay.
          </p>
          <div className={styles.cardFooter}>
            <span>Dual Chess Clocks</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>

        {/* Learn Chess Card */}
        <div className={`${styles.card} ${styles.learnCard}`} onClick={() => handleCardClick('learn')}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconWrap} ${styles.learnIcon}`}>
              <BookOpen size={28} />
            </div>
            <span className={styles.cardTag}>Academy</span>
          </div>
          <h3 className={styles.cardTitle}>Learn Chess</h3>
          <p className={styles.cardDesc}>
            23 comprehensive interactive lessons with practice boards, move verification, and mini-quizzes.
          </p>
          <div className={styles.cardFooter}>
            <span>23 Masterclasses</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>

        {/* Settings Card */}
        <div className={`${styles.card} ${styles.settingsCard}`} onClick={() => handleCardClick('settings')}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconWrap} ${styles.settingsIcon}`}>
              <Settings size={28} />
            </div>
            <span className={styles.cardTag}>2D / 3D Pieces</span>
          </div>
          <h3 className={styles.cardTitle}>Settings</h3>
          <p className={styles.cardDesc}>
            2D and 3D piece sets, Classic board styles, audio synthesizer, and 14 gameplay switches.
          </p>
          <div className={styles.cardFooter}>
            <span>Classic & Modern Themes</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>
      </section>

      {/* Download Options Modal (APK vs Google Play) */}
      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </div>
  );
}