/**
 * sections/Hero/index.jsx
 * Full-viewport hero with animated word-flip headline,
 * star field background (dark mode only), and CTA buttons.
 */

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import WordFlip from '@/components/ui/WordFlip';
import { STARS } from '@/assets/stars';
import styles from './Hero.module.css';

export default function HeroSection() {
  const { dark } = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(id);
  }, []);

  const heroBg = dark
    ? 'radial-gradient(ellipse 140% 90% at 50% 108%, rgba(42, 42, 42, 0.85) 0%, rgba(26, 26, 26, 0.8) 58%)'
    : 'radial-gradient(ellipse 140% 90% at 50% 108%, rgba(255, 249, 230, 0.85) 0%, rgba(245, 243, 237, 0.8) 58%)';

  return (
    <section
      id="work"
      className={styles.hero}
      style={{ backgroundColor: 'transparent', backgroundImage: heroBg }}
    >
      {/* Star field — rendered only in dark mode */}
      {dark && (
        <div className={styles.stars} aria-hidden="true">
          {STARS.map((s, i) => (
            <span
              key={i}
              className={styles.star}
              style={{
                left:             s.left,
                top:              s.top,
                width:            `${s.size}px`,
                height:           `${s.size}px`,
                opacity:          s.opacity,
                animationDuration: `${s.dur}s`,
                animationDelay:   `${s.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient glow orbs */}
      <div className={styles.orbs} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Eyebrow badge */}
        <div
          className={`${styles.badge} ${loaded ? styles.loaded : ''}`}
          style={{ transitionDelay: '0s' }}
        >
          <span className={styles.dot} />
          <span className={styles.badgeText}>
            SOLUTIONS ARCHITECT · OPEN TO OPPORTUNITIES
          </span>
        </div>

        {/* Primary headline */}
        <h1
          className={`${styles.headline} ${loaded ? styles.loaded : ''}`}
          style={{ transitionDelay: '0.08s' }}
        >
          I build systems through
        </h1>

        {/* Animated flip word */}
        <div
          className={`${styles.flipRow} ${loaded ? styles.loaded : ''}`}
          style={{ transitionDelay: '0.14s' }}
        >
          <WordFlip />
        </div>

        {/* Subtitle */}
        <p
          className={`${styles.sub} ${loaded ? styles.loaded : ''}`}
          style={{ transitionDelay: '0.2s' }}
        >
          Solutions Architect designing cloud platforms, integration patterns,
          and enterprise systems — turning complexity into clarity for
          organisations at scale.
        </p>

        {/* CTA buttons */}
        <div
          className={`${styles.ctas} ${loaded ? styles.loaded : ''}`}
          style={{ transitionDelay: '0.26s' }}
        >
          <a href="#case-studies" className="btn-primary">
            Explore My Work ↓
          </a>
          <a href="#connect" className="btn-ghost">
            Let's Connect
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollCue} aria-hidden="true">
        <div className={styles.scrollRing}>
          <div className={styles.scrollDot} />
        </div>
      </div>
    </section>
  );
}
