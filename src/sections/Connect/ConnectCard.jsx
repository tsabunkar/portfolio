/**
 * sections/Connect/ConnectCard.jsx
 */

import { memo } from 'react';
import { useReveal } from '@/hooks/useReveal';
import styles from './ConnectCard.module.css';

const ConnectCard = memo(function ConnectCard({ link, delayClass }) {
  const ref = useReveal();
  const { label, icon, accent, sub, url } = link;

  return (
    <a
      ref={ref}
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`reveal card ${delayClass} ${styles.card}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor  = `${accent}55`;
        e.currentTarget.style.transform    = 'translateY(-6px) scale(1.025)';
        e.currentTarget.style.boxShadow    = `0 18px 50px ${accent}14`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor  = '';
        e.currentTarget.style.transform    = '';
        e.currentTarget.style.boxShadow    = '';
      }}
    >
      <div
        className={styles.iconWrap}
        style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}
      >
        <span className={styles.icon} style={{ color: accent }}>{icon}</span>
      </div>
      <p className={styles.label}>{label}</p>
      <p className={styles.sub}>{sub}</p>
    </a>
  );
});

export default ConnectCard;
