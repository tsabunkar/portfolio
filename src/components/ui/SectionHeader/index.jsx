/**
 * components/ui/SectionHeader/index.jsx
 * Reusable section header: eyebrow label + headline + optional sub-copy.
 */

import { memo } from 'react';
import { useReveal } from '@/hooks/useReveal';
import styles from './SectionHeader.module.css';

const SectionHeader = memo(function SectionHeader({
  eyebrow,
  title,
  sub,
  eyebrowColor = '#0071e3',
}) {
  const ref = useReveal();

  return (
    <div ref={ref} className={`reveal ${styles.wrapper}`}>
      <p className={styles.eyebrow} style={{ color: eyebrowColor }}>
        {eyebrow}
      </p>
      <h2
        className={styles.title}
        /* dangerouslySetInnerHTML used only for controlled <br/> line breaks in static data */
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
});

export default SectionHeader;
