import React from 'react';
import styles from './Button.module.css';

export function Button({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'glass' | 'danger' | 'ghost' | 'icon'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  fullWidth = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={styles.icon} size={size === 'lg' ? 22 : size === 'sm' ? 16 : 18} />}
      {children && <span>{children}</span>}
    </button>
  );
}
