import React from 'react';
import { Modal } from '../common/Modal';
import { Download, Smartphone, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import styles from './DownloadModal.module.css';

export function DownloadModal({ isOpen, onClose }) {
  const handleDownloadApk = () => {
    // Trigger download
    const link = document.createElement('a');
    link.href = './LunarChess.apk';
    link.download = 'LunarChess.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Get Lunar Chess App">
      <div className={styles.modalContent}>
        <p className={styles.subtitle}>
          Choose your preferred download option below:
        </p>

        <div className={styles.optionsList}>
          {/* Option 1: Direct Android APK Download */}
          <div className={styles.optionCard} onClick={handleDownloadApk}>
            <div className={styles.iconWrapApk}>
              <Smartphone size={28} />
            </div>
            <div className={styles.optionInfo}>
              <div className={styles.optionTitleRow}>
                <span className={styles.optionTitle}>Direct Android APK</span>
                <span className={styles.badgeInstant}>Instant Download</span>
              </div>
              <p className={styles.optionDesc}>
                Download the standalone .apk installer directly to your phone or tablet.
              </p>
              <div className={styles.metaRow}>
                <span>v1.0.0</span>
                <span>•</span>
                <span>4.2 MB</span>
                <span>•</span>
                <span className={styles.safeTag}>
                  <ShieldCheck size={13} /> 100% Virus-Free
                </span>
              </div>
            </div>
            <button className={styles.downloadActionBtn} title="Download APK Now">
              <Download size={18} />
              <span>Download</span>
            </button>
          </div>

          {/* Option 2: Google Play Store (Coming Soon) */}
          <div className={`${styles.optionCard} ${styles.disabledCard}`}>
            <div className={styles.iconWrapPlay}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-1.428V3.242c0-.555.228-1.056.609-1.428zm11.602 11.602l2.368 2.368-12.01 6.864 9.642-9.232zm0-2.832L5.57 1.352l12.01 6.864-2.369 2.368zm1.414 1.416l3.52-2.012a1.5 1.5 0 0 1 0 2.618l-3.52 2.012-1.414-1.414 1.414-1.204z" />
              </svg>
            </div>
            <div className={styles.optionInfo}>
              <div className={styles.optionTitleRow}>
                <span className={styles.optionTitle}>Google Play Store</span>
                <span className={styles.badgeComingSoon}>Coming Soon</span>
              </div>
              <p className={styles.optionDesc}>
                Official release on the Google Play Store with automatic background updates.
              </p>
              <div className={styles.metaRow}>
                <span className={styles.playProtectTag}>
                  <CheckCircle size={13} /> Google Play Protect
                </span>
              </div>
            </div>
            <button className={styles.comingSoonBtn} disabled>
              <span>Coming Soon</span>
            </button>
          </div>
        </div>

        <div className={styles.footerNote}>
          <Sparkles size={14} className={styles.noteIcon} />
          <span>Both versions feature 100% offline gameplay, AI engine, and interactive lessons.</span>
        </div>
      </div>
    </Modal>
  );
}