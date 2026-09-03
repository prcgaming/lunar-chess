import React, { useState } from 'react';
import { Moon, Sun, Volume2, VolumeX, BookOpen, Bot, Users, Settings, ArrowLeft, Download } from 'lucide-react';
import { DownloadModal } from '../download/DownloadModal';
import { useSettings } from '../../context/SettingsContext';
import { useSound } from '../../context/SoundContext';
import { isNativeApp } from '../../utilities/platform';
import styles from './Header.module.css';

export function Header({ currentView, setView, showBack = false, onBack }) {
  const { settings, updateSetting } = useSettings();
  const { playSound } = useSound();
  const [downloadOpen, setDownloadOpen] = useState(false);

  const toggleSound = () => {
    playSound('click');
    updateSetting('soundEnabled', !settings.soundEnabled);
  };

  const toggleTheme = () => {
    playSound('click');
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSetting('theme', nextTheme);
  };

  const handleNav = (view) => {
    playSound('click');
    setView(view);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          {showBack ? (
            <button className={styles.backBtn} onClick={onBack || (() => handleNav('home'))} aria-label="Go Back">
              <ArrowLeft size={22} />
              <span className={styles.backText}>Back</span>
            </button>
          ) : (
            <button className={styles.brand} onClick={() => handleNav('home')}>
              <div className={styles.logoBadge}>
                <img src="./favicon.png" alt="Lunar Chess Logo" className={styles.logoImg} />
              </div>
              <div className={styles.brandText}>
                <span className={styles.title}>LUNAR CHESS</span>
                <span className={styles.subtitle}>Play & Learn</span>
              </div>
            </button>
          )}
        </div>

        {/* Desktop / Tablet Navigation */}
        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${currentView === 'play-ai' ? styles.active : ''}`}
            onClick={() => handleNav('play-ai')}
          >
            <Bot size={18} />
            <span>Play AI</span>
          </button>

          <button
            className={`${styles.navItem} ${currentView === 'play-pvp' ? styles.active : ''}`}
            onClick={() => handleNav('play-pvp')}
          >
            <Users size={18} />
            <span>2 Players</span>
          </button>

          <button
            className={`${styles.navItem} ${currentView === 'learn' ? styles.active : ''}`}
            onClick={() => handleNav('learn')}
          >
            <BookOpen size={18} />
            <span>Learn</span>
          </button>

          <button
            className={`${styles.navItem} ${currentView === 'settings' ? styles.active : ''}`}
            onClick={() => handleNav('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Quick Action Icons */}
        <div className={styles.actions}>
          {!isNativeApp() && (
            <button
              className={styles.downloadHeaderBtn}
              onClick={() => {
                playSound('click');
                setDownloadOpen(true);
              }}
              title="Download App"
            >
              <Download size={16} />
              <span className={styles.apkText}>App</span>
            </button>
          )}

          <button
            className={styles.actionBtn}
            onClick={toggleSound}
            aria-label={settings.soundEnabled ? 'Mute audio' : 'Unmute audio'}
            title={settings.soundEnabled ? 'Mute' : 'Unmute'}
          >
            {settings.soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} className={styles.muted} />}
          </button>

          <button
            className={styles.actionBtn}
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            title={settings.theme === 'light' ? 'Dark Theme' : 'Light Theme'}
          >
            {settings.theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
        </div>
      </div>

      <DownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </header>
  );
}