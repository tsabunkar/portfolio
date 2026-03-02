/**
 * sections/Proof/TestimonialCard.jsx
 */

import { memo } from 'react';
import { useReveal } from '@/hooks/useReveal';
import styles from './TestimonialCard.module.css';

const TestimonialCard = memo(function TestimonialCard({ tm, delayClass }) {
  const ref = useReveal();
  return (
    <blockquote ref={ref} className={`reveal card ${delayClass} ${styles.card}`}>
      <span className={styles.openQuote} aria-hidden="true">"</span>
      <p className={styles.quote}>{tm.quote}</p>
      <footer className={styles.author}>
        <div
          className={styles.avatar}
          style={{ background: `linear-gradient(${tm.grad})` }}
          aria-hidden="true"
        >
          {tm.initials}
        </div>
        <div>
          <cite className={styles.name}>{tm.name}</cite>
          <span className={styles.role}>{tm.role}</span>
        </div>
      </footer>
    </blockquote>
  );
});

export default TestimonialCard;
