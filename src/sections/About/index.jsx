/**
 * sections/About/index.jsx
 */

import { useReveal } from '@/hooks/useReveal';
import { TECH_STACK } from '@/data';
import styles from './About.module.css';

export default function AboutSection() {
  const leftRef  = useReveal();
  const rightRef = useReveal();

  return (
    <section id="about" className="section" style={{ background: 'var(--bg)' }}>
      <div className={`inner grid-2 ${styles.grid}`}>

        {/* ── Text column ── */}
        <div ref={leftRef} className="reveal slide-left">
          <p className={styles.eyebrow}>About Me</p>
          <h2 className={styles.heading}>
            Architecture is a craft,<br />not a checkbox.
          </h2>
          <p className={styles.body}>
            I'm a Solutions Architect with 10+ years of experience designing cloud
            platforms, enterprise integration patterns, and resilient distributed
            systems for organisations ranging from Series-B startups to global enterprises.
          </p>
          <p className={styles.body}>
            I teach architecture on YouTube, write deep-dives on Medium, and believe
            every great system starts with a great question — not a framework.
          </p>
          <div className={styles.actions}>
            <a href="#connect" className="btn-primary" style={{ background: '#30d158' }}>
              Let's Talk
            </a>
            <a href="#footprint" className="btn-ghost">
              See My Content
            </a>
          </div>
        </div>

        {/* ── Stack card ── */}
        <div ref={rightRef} className="reveal slide-right">
          <div className={`card ${styles.stackCard}`}>
            <p className={styles.cardLabel}>Toolbox</p>
            <div className={styles.tags}>
              {TECH_STACK.map((row, ri) => (
                <div key={ri} className={styles.tagRow}>
                  {row.map((tech) => (
                    <span key={tech} className={styles.tag}>{tech}</span>
                  ))}
                </div>
              ))}
            </div>

            <div className={styles.statusRow}>
              <p className={styles.cardLabel}>Status</p>
              <div className={styles.status}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>
                  Available for Architecture & Advisory roles
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
