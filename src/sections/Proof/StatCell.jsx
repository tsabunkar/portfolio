/**
 * sections/Proof/StatCell.jsx
 */

import { useReveal } from '@/hooks/useReveal';
import styles from './StatCell.module.css';

export default function StatCell({ num, label, delayClass }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${delayClass} ${styles.cell}`}>
      <span className={styles.num}>{num}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
