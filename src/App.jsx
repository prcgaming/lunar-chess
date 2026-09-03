import React, { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { SoundProvider } from './context/SoundContext';
import { Header } from './components/navbar/Header';
import { Footer } from './components/footer/Footer';
import { Home } from './pages/Home/Home';
import { PlayAI } from './pages/PlayAI/PlayAI';
import { PlayPvP } from './pages/PlayPvP/PlayPvP';
import { LearnHub } from './pages/Learn/LearnHub';
import { Settings } from './pages/Settings/Settings';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Bot, Users, BookOpen, Settings as SettingsIcon, Home as HomeIcon } from 'lucide-react';
import styles from './App.module.css';

function MainApp() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'play-ai' | 'play-pvp' | 'learn' | 'settings'

  const navigateTo = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.appContainer}>
      <Header
        currentView={currentView}
        setView={navigateTo}
        showBack={currentView !== 'home'}
        onBack={() => navigateTo('home')}
      />

      <main className={styles.mainContent}>
        <ErrorBoundary onReset={() => navigateTo('home')}>
          {currentView === 'home' && <Home onNavigate={navigateTo} />}
          {currentView === 'play-ai' && <PlayAI onHome={() => navigateTo('home')} />}
          {currentView === 'play-pvp' && <PlayPvP onHome={() => navigateTo('home')} />}
          {currentView === 'learn' && <LearnHub />}
          {currentView === 'settings' && <Settings />}
        </ErrorBoundary>

        {/* Global Bottom Footer */}
        <Footer />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className={styles.bottomNav}>
        <button
          className={`${styles.bottomNavItem} ${currentView === 'home' ? styles.bottomNavActive : ''}`}
          onClick={() => navigateTo('home')}
        >
          <HomeIcon size={20} />
          <span>Home</span>
        </button>

        <button
          className={`${styles.bottomNavItem} ${currentView === 'play-ai' ? styles.bottomNavActive : ''}`}
          onClick={() => navigateTo('play-ai')}
        >
          <Bot size={20} />
          <span>AI</span>
        </button>

        <button
          className={`${styles.bottomNavItem} ${currentView === 'play-pvp' ? styles.bottomNavActive : ''}`}
          onClick={() => navigateTo('play-pvp')}
        >
          <Users size={20} />
          <span>2-Player</span>
        </button>

        <button
          className={`${styles.bottomNavItem} ${currentView === 'learn' ? styles.bottomNavActive : ''}`}
          onClick={() => navigateTo('learn')}
        >
          <BookOpen size={20} />
          <span>Learn</span>
        </button>

        <button
          className={`${styles.bottomNavItem} ${currentView === 'settings' ? styles.bottomNavActive : ''}`}
          onClick={() => navigateTo('settings')}
        >
          <SettingsIcon size={20} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <SoundProvider>
        <MainApp />
      </SoundProvider>
    </SettingsProvider>
  );
}