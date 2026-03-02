/**
 * components/ui/ThemeToggle/index.jsx
 * Accessible pill toggle that switches between dark and light themes.
 */

import { memo } from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle = memo(function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onToggle}
      className={styles.track}
      style={{ background: 'var(--toggle-track)' }}
    >
      <span className={`${styles.thumb} ${dark ? styles.thumbRight : styles.thumbLeft}`}>
        <span aria-hidden="true" className={styles.icon}>
          {dark ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  );
});

export default ThemeToggle;
