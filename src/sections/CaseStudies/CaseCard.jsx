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
    >
      {/* Barcode decoration */}
      <div className="barcode" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Boarding pass header */}
      <div className={styles.boardingHeader}>
        <span className={styles.boardingLabel}>PROJECT BRIEF</span>
        <span className={styles.boardingTag}>CASE STUDY</span>
      </div>

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
