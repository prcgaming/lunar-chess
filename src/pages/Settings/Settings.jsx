import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSound } from '../../context/SoundContext';
import { Switch } from '../../components/common/Switch';
import { Button } from '../../components/common/Button';
import { BOARD_THEMES, PIECE_STYLES } from '../../chess-engine/chessConstants';
import {
  Palette,
  Volume2,
  Sparkles,
  Smartphone,
  Sliders,
  RotateCcw,
  Zap,
  Box,
  Crown
} from 'lucide-react';
import styles from './Settings.module.css';

export function Settings() {
  const { settings, updateSetting, applyPreset, resetSettings } = useSettings();
  const { playSound } = useSound();

  const handleTestSound = (event) => {
    playSound(event);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Sliders size={32} />
        </div>
        <h2 className={styles.title}>Settings & Customization</h2>
        <p className={styles.subtitle}>Fine-tune your chess board, 2D/3D pieces, soundscape, and gameplay assistance.</p>
      </div>

      {/* Quick Assistance Presets */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Zap size={20} className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Gameplay Assistance Presets</h3>
        </div>
        <p className={styles.sectionDesc}>
          Quickly toggle between comprehensive hints for learning or a clean tournament setup.
        </p>

        <div className={styles.presetGrid}>
          <button
            className={`${styles.presetBtn} ${settings.assistancePreset === 'beginner' ? styles.presetActive : ''}`}
            onClick={() => {
              applyPreset('beginner');
              playSound('click');
            }}
          >
            <strong>Beginner Assistance</strong>
            <span>Shows legal moves, capture rings, attack lines, piece values, and engine hints.</span>
          </button>

          <button
            className={`${styles.presetBtn} ${settings.assistancePreset === 'advanced' ? styles.presetActive : ''}`}
            onClick={() => {
              applyPreset('advanced');
              playSound('click');
            }}
          >
            <strong>Advanced / Tournament</strong>
            <span>Clean board with minimal distraction. No legal dots or suggestions.</span>
          </button>
        </div>
      </section>

      {/* 2D / 3D Piece Styles Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Box size={20} className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Chess Piece Styles (2D & 3D)</h3>
        </div>
        <p className={styles.sectionDesc}>
          Switch between clean tournament 2D vector pieces and high-detail 3D sculpted sets.
        </p>

        <div className={styles.pieceStyleGrid}>
          {PIECE_STYLES.map((ps) => {
            const is3D = ps.id.startsWith('3d');
            const isSelected = settings.pieceStyle === ps.id;
            return (
              <button
                key={ps.id}
                className={`${styles.pieceStyleCard} ${isSelected ? styles.pieceStyleActive : ''}`}
                onClick={() => {
                  updateSetting('pieceStyle', ps.id);
                  playSound('click');
                }}
              >
                <div className={styles.piecePreviewBadge}>
                  <span className={styles.pieceBadgeGlyph}>{is3D ? '♚' : '♔'}</span>
                  <span className={styles.dimensionTag}>{is3D ? '3D' : '2D'}</span>
                </div>
                <div className={styles.pieceStyleInfo}>
                  <strong>{ps.name}</strong>
                  <span>{is3D ? 'Sculpted lighting, depth & bevels' : 'Crisp minimalist flat vectors'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Theme & Visuals */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Palette size={20} className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Visual Appearance & Themes</h3>
        </div>

        {/* Theme mode: Classic, Dark, Light, System */}
        <div className={styles.settingRow}>
          <div className={styles.rowLabel}>
            <strong>Application Theme</strong>
            <p>Select your interface color palette.</p>
          </div>
          <div className={styles.themeGroup}>
            {[
              { id: 'classic', label: '🏛️ Classic Wood' },
              { id: 'dark', label: '🌙 Lunar Dark' },
              { id: 'light', label: '☀️ Crisp Light' },
              { id: 'system', label: '💻 System' }
            ].map((th) => (
              <button
                key={th.id}
                className={`${styles.themeOption} ${settings.theme === th.id ? styles.themeOptionActive : ''}`}
                onClick={() => updateSetting('theme', th.id)}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Board Theme Selection */}
        <div className={styles.settingRow}>
          <div className={styles.rowLabel}>
            <strong>Chess Board Theme</strong>
            <p>Custom square color scheme for the board.</p>
          </div>
          <div className={styles.boardGrid}>
            {BOARD_THEMES.map((bt) => (
              <button
                key={bt.id}
                className={`${styles.boardThemeCard} ${settings.boardTheme === bt.id ? styles.boardThemeActive : ''}`}
                onClick={() => updateSetting('boardTheme', bt.id)}
              >
                <div className={styles.colorPreview}>
                  <div style={{ backgroundColor: bt.light }} />
                  <div style={{ backgroundColor: bt.dark }} />
                  <div style={{ backgroundColor: bt.dark }} />
                  <div style={{ backgroundColor: bt.light }} />
                </div>
                <span>{bt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Animation Speed */}
        <div className={styles.settingRow}>
          <div className={styles.rowLabel}>
            <strong>Animation Speed</strong>
            <p>Speed of piece slide transitions.</p>
          </div>
          <div className={styles.themeGroup}>
            {[
              { id: 'slow', label: 'Slow (400ms)' },
              { id: 'normal', label: 'Normal (240ms)' },
              { id: 'fast', label: 'Fast (120ms)' },
              { id: 'instant', label: 'Instant (0ms)' }
            ].map((spd) => (
              <button
                key={spd.id}
                className={`${styles.themeOption} ${settings.animationSpeed === spd.id ? styles.themeOptionActive : ''}`}
                onClick={() => updateSetting('animationSpeed', spd.id)}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>

        <Switch
          checked={settings.showCoordinates}
          onChange={(val) => updateSetting('showCoordinates', val)}
          label="Show Board Coordinates"
          description="Display file letters (a-h) and rank numbers (1-8) along the edges."
        />
      </section>

      {/* Audio & Haptics */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Volume2 size={20} className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Sound & Audio Synthesizer</h3>
        </div>

        <Switch
          checked={settings.soundEnabled}
          onChange={(val) => updateSetting('soundEnabled', val)}
          label="Sound Effects Enabled"
          description="Synthesize offline audio clicks, chimes, and capture impacts."
        />

        {settings.soundEnabled && (
          <>
            <div className={styles.settingRow}>
              <div className={styles.rowLabel}>
                <strong>Master Volume ({Math.round(settings.soundVolume * 100)}%)</strong>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => updateSetting('soundVolume', parseFloat(e.target.value))}
                className={styles.volumeSlider}
              />
            </div>

            <div className={styles.switchesList}>
              <div className={styles.soundItem}>
                <Switch
                  checked={settings.moveSound}
                  onChange={(val) => updateSetting('moveSound', val)}
                  label="Move Sound"
                />
                <button className={styles.testBtn} onClick={() => handleTestSound('move')}>Test</button>
              </div>

              <div className={styles.soundItem}>
                <Switch
                  checked={settings.captureSound}
                  onChange={(val) => updateSetting('captureSound', val)}
                  label="Capture Sound"
                />
                <button className={styles.testBtn} onClick={() => handleTestSound('capture')}>Test</button>
              </div>

              <div className={styles.soundItem}>
                <Switch
                  checked={settings.checkSound}
                  onChange={(val) => updateSetting('checkSound', val)}
                  label="Check Sound"
                />
                <button className={styles.testBtn} onClick={() => handleTestSound('check')}>Test</button>
              </div>

              <div className={styles.soundItem}>
                <Switch
                  checked={settings.checkmateSound}
                  onChange={(val) => updateSetting('checkmateSound', val)}
                  label="Checkmate Sound"
                />
                <button className={styles.testBtn} onClick={() => handleTestSound('checkmate')}>Test</button>
              </div>

              <div className={styles.soundItem}>
                <Switch
                  checked={settings.victorySound}
                  onChange={(val) => updateSetting('victorySound', val)}
                  label="Victory Sound"
                />
                <button className={styles.testBtn} onClick={() => handleTestSound('victory')}>Test</button>
              </div>
            </div>
          </>
        )}

        <div className={styles.divider} />

        <div className={styles.sectionHeader}>
          <Smartphone size={20} className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Vibration & Haptics</h3>
        </div>
        <Switch
          checked={settings.vibration}
          onChange={(val) => updateSetting('vibration', val)}
          label="Haptic Feedback"
          description="Vibrate phone on moves, captures, and checks (Android / Mobile browsers)."
        />
      </section>

      {/* Gameplay Assistance Switches */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Sparkles size={20} className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Gameplay Assistance Switches</h3>
        </div>
        <p className={styles.sectionDesc}>
          Every assistance feature can be independently toggled ON or OFF:
        </p>

        <div className={styles.switchesList}>
          <Switch
            checked={settings.showLegalMoves}
            onChange={(val) => updateSetting('showLegalMoves', val)}
            label="Show Legal Moves"
            description="Highlight candidate squares where selected piece can move."
          />

          <Switch
            checked={settings.showCaptureSquares}
            onChange={(val) => updateSetting('showCaptureSquares', val)}
            label="Show Capture Squares"
            description="Display distinct red rings on enemy pieces that can be captured."
          />

          <Switch
            checked={settings.showPieceAttackSquares}
            onChange={(val) => updateSetting('showPieceAttackSquares', val)}
            label="Show Piece Attack Squares"
            description="Display the lines of fire and squares controlled by active piece."
          />

          <Switch
            checked={settings.highlightSelectedPiece}
            onChange={(val) => updateSetting('highlightSelectedPiece', val)}
            label="Highlight Selected Piece"
            description="Add glowing highlight to currently selected chess piece."
          />

          <Switch
            checked={settings.highlightLastMove}
            onChange={(val) => updateSetting('highlightLastMove', val)}
            label="Highlight Last Move"
            description="Highlight the origin and destination squares of the previous move."
          />

          <Switch
            checked={settings.checkWarning}
            onChange={(val) => updateSetting('checkWarning', val)}
            label="Check Warning"
            description="Glow the King square in bright red when under check."
          />

          <Switch
            checked={settings.checkmateAnimation}
            onChange={(val) => updateSetting('checkmateAnimation', val)}
            label="Checkmate Animation"
            description="Display animated victory confetti on winning the game."
          />

          <Switch
            checked={settings.learningMode}
            onChange={(val) => updateSetting('learningMode', val)}
            label="Learning Mode"
            description="Provide real-time positional insights during play."
          />

          <Switch
            checked={settings.moveSuggestions}
            onChange={(val) => updateSetting('moveSuggestions', val)}
            label="Move Suggestions (Engine Hint)"
            description="Enable 'Hint' button to suggest the best tactical move via engine."
          />

          <Switch
            checked={settings.confirmBeforeMove}
            onChange={(val) => updateSetting('confirmBeforeMove', val)}
            label="Confirm Before Move"
            description="Require a confirmation tap before finalizing each move."
          />

          <Switch
            checked={settings.autoQueenPromotion}
            onChange={(val) => updateSetting('autoQueenPromotion', val)}
            label="Auto Queen Promotion"
            description="Automatically promote pawns to Queens without asking."
          />

          <Switch
            checked={settings.showThreatenedSquares}
            onChange={(val) => updateSetting('showThreatenedSquares', val)}
            label="Show Threatened Squares"
            description="Highlight squares currently endangered by opponent forces."
          />

          <Switch
            checked={settings.showDefendedSquares}
            onChange={(val) => updateSetting('showDefendedSquares', val)}
            label="Show Defended Squares"
            description="Indicate squares protected by friendly pieces."
          />

          <Switch
            checked={settings.pieceValueDisplay}
            onChange={(val) => updateSetting('pieceValueDisplay', val)}
            label="Piece Value Display"
            description="Show material count advantages in the player HUD."
          />
        </div>
      </section>

      {/* Reset Defaults */}
      <div className={styles.resetWrap}>
        <Button variant="danger" size="md" icon={RotateCcw} onClick={resetSettings}>
          Reset All Settings to Default
        </Button>
      </div>
    </div>
  );
}