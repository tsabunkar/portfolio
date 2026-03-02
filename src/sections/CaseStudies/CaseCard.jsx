/**
 * sections/CaseStudies/CaseCard.jsx
 * Individual case study card with hover glow effect.
 */

import { memo } from 'react';
import { useReveal } from '@/hooks/useReveal';
import styles from './CaseCard.module.css';

const CaseCard = memo(function CaseCard({ cs, delayClass }) {
  const ref = useReveal();

  return (
    <article
      ref={ref}
      className={`reveal card ${delayClass} ${styles.card}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${cs.accent}44`;
        e.currentTarget.style.boxShadow   = `0 0 55px ${cs.accent}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow   = '';
      }}
    >
      {/* Tag + stat */}
      <header className={styles.header}>
        <span
          className={`pill ${styles.tag}`}
          style={{ background: `${cs.accent}18`, color: cs.accent }}
        >
          {cs.tag}
        </span>
        <div className={styles.stat}>
          <span className={styles.statNum} style={{ color: cs.accent }}>
            {cs.stat}
          </span>
          <span className={styles.statLabel}>{cs.statLabel}</span>
        </div>
      </header>

      <h3 className={styles.title}>{cs.title}</h3>
      <p className={styles.desc}>{cs.desc}</p>
    </article>
  );
});

export default CaseCard;
