import React from 'react';
import styles from './Switch.module.css';

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id
}) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.info}>
        {label && <label htmlFor={switchId} className={styles.label}>{label}</label>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button
        id={switchId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`${styles.switch} ${checked ? styles.checked : ''}`}
        onClick={() => !disabled && onChange && onChange(!checked)}
        type="button"
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
}
