/**
 * sections/Proof/index.jsx
 */

import SectionHeader from '@/components/ui/SectionHeader';
import StatCell from './StatCell';
import TestimonialCard from './TestimonialCard';
import { STATS, TESTIMONIALS } from '@/data';
import styles from './Proof.module.css';

const DELAYS = ['d1', 'd2', 'd3', 'd4'];

export default function ProofSection() {
  return (
    <section id="proof" className="section" style={{ background: 'var(--bg-alt)' }}>
      <div className="inner">
        <SectionHeader
          eyebrow="Proof"
          title="The numbers.<br/>The people."
          eyebrowColor="#ff9f0a"
        />

        {/* Stats grid */}
        <div className={styles.statsGrid}>
          {STATS.map((s, i) => (
            <StatCell
              key={s.label}
              num={s.num}
              label={s.label}
              delayClass={DELAYS[i] ?? ''}
            />
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid-3">
          {TESTIMONIALS.map((tm, i) => (
            <TestimonialCard key={tm.name} tm={tm} delayClass={DELAYS[i] ?? ''} />
          ))}
        </div>
      </div>
    </section>
  );
}
