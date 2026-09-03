import React from 'react';
import { Youtube, ExternalLink, Smartphone, Download } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.apkSection}>
            <a
              href="./LunarChess.apk"
              download="LunarChess.apk"
              className={styles.apkBtn}
              title="Download Android APK"
            >
              <Smartphone size={16} />
              <span>Download Android App (APK)</span>
              <Download size={14} />
            </a>
          </div>

          <div className={styles.brandGroup}>
            <span className={styles.madeByText}>Made by</span>
            <a
              href="https://www.youtube.com/@Prc_Gaming95"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ytBadge}
              title="Visit @Prc_Gaming95 on YouTube"
            >
              <Youtube size={18} className={styles.ytIcon} />
              <span className={styles.channelName}>@Prc_Gaming95</span>
              <ExternalLink size={12} className={styles.extIcon} />
            </a>
          </div>

          <p className={styles.copyright}>
            all copyright reserved by lunarchess
          </p>
        </div>
      </div>
    </footer>
  );
}