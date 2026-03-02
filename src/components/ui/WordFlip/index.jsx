/**
 * components/ui/WordFlip/index.jsx
 * Cycles through an array of words with a 3-D flip transition.
 * Each word exits upward (wordOut) and the next enters from below (wordIn).
 */

import { useState, useEffect } from 'react';
import { FLIP_WORDS } from '@/data';
import styles from './WordFlip.module.css';

export default function WordFlip() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('in'); // 'in' | 'out'

  // Hold each word for 2.4 s then begin exit
  useEffect(() => {
    const id = setTimeout(() => setPhase('out'), 2400);
    return () => clearTimeout(id);
  }, [index]);

  // After exit animation completes (450 ms), advance to next word
  useEffect(() => {
    if (phase !== 'out') return;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % FLIP_WORDS.length);
      setPhase('in');
    }, 450);
    return () => clearTimeout(id);
  }, [phase]);

  return (
    <span className={styles.viewport}>
      <span
        key={index}
        className={`grad-text ${styles.word} ${phase === 'out' ? styles.exit : styles.enter}`}
      >
        {FLIP_WORDS[index]}
      </span>
    </span>
  );
}
