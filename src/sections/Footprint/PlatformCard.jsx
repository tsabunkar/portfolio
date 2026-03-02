/**
 * sections/Footprint/PlatformCard.jsx
 */

import { memo } from 'react';
import { useReveal } from '@/hooks/useReveal';
import styles from './PlatformCard.module.css';

const PlatformCard = memo(function PlatformCard({ fp }) {
  const ref = useReveal();
  const isYT = fp.platform === 'YouTube';

  return (
    <a
      ref={ref}
      href={fp.url}
      target="_blank"
      rel="noreferrer"
      className={`reveal card ${styles.card}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${fp.accent}44`;
        e.currentTarget.style.transform   = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.transform   = '';
      }}
    >
      {/* Platform header */}
      <div className={styles.header}>
        <div
          className={styles.iconWrap}
          style={{ background: `${fp.accent}18`, border: `1px solid ${fp.accent}28` }}
        >
          <span
            className={styles.icon}
            style={{
              color:    fp.platform === 'Medium' ? 'var(--text-mid)' : fp.accent,
              fontSize: isYT ? 'clamp(14px,2vw,18px)' : 'clamp(16px,2.5vw,24px)',
            }}
          >
            {fp.icon}
          </span>
        </div>
        <div>
          <p className={styles.platform}>{fp.platform}</p>
          <p className={styles.handle}>{fp.handle}</p>
        </div>
      </div>

      <p className={styles.desc}>{fp.desc}</p>

      <div className={styles.footer}>
        <span className={`pill ${styles.stat}`}>{fp.stat}</span>
        <span className={styles.cta}>→ Visit</span>
      </div>
    </a>
  );
});

export default PlatformCard;
