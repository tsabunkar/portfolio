/**
 * sections/About/index.jsx
 */

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { TECH_STACK, EDUCATION } from "@/data";
import styles from "./About.module.css";

export default function AboutSection() {
  const leftRef = useReveal();
  const rightRef = useReveal();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section id="about" className="section" style={{ background: "var(--bg)" }}>
      <div className={`inner grid-2 ${styles.grid}`}>
        {/* ── Text column ── */}
        <div ref={leftRef} className="reveal slide-left">
          <p className={styles.eyebrow}>About Me</p>
          <h2 className={styles.heading}>
            Architecture is a craft,
            <br />
            not a checkbox.
          </h2>
          <p className={styles.body}>
            I'm a Solutions Architect with 10+ years of experience designing
            cloud platforms, enterprise integration patterns, and resilient
            distributed systems for organisations ranging from Series-B startups
            to global enterprises.
          </p>
          <p className={styles.body}>
            I teach architecture on YouTube, write articles on Medium, and
            believe every great system starts with a great question — not a
            framework.
          </p>
          <div className={styles.actions}>
            <a
              href="#connect"
              className="btn-primary"
              style={{ background: "#30d158" }}
            >
              Let's Talk
            </a>
            <a href="#footprint" className="btn-ghost">
              See My Content
            </a>
          </div>
        </div>

        {/* ── Flip card: Toolbox / Education ── */}
        <div ref={rightRef} className="reveal slide-right">
          <div className={`${styles.flipContainer} ${isFlipped ? styles.flipped : ''}`}>
            <div className={styles.flipInner}>
              {/* Front: Toolbox */}
              <div className={styles.flipFront}>
                <div className={`card ${styles.stackCard}`}>
                  <p className={styles.cardLabel}>Toolbox</p>
                  <div className={styles.tags}>
                    {TECH_STACK.map((row, ri) => (
                      <div key={ri} className={styles.tagRow}>
                        {row.map((tech) => (
                          <span key={tech} className={styles.tag}>
                            {tech}
                          </span>
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

                  <button
                    className={styles.flipButton}
                    onClick={() => setIsFlipped(true)}
                    aria-label="View education"
                  >
                    <span className={styles.flipIcon}>🎓</span>
                    View Education
                  </button>
                </div>
              </div>

              {/* Back: Education */}
              <div className={styles.flipBack}>
                <div className={`card ${styles.educationContent}`}>
                  <p className={styles.cardLabel}>Education</p>

                  <h3 className={styles.institution}>{EDUCATION.institution}</h3>
                  <p className={styles.degree}>{EDUCATION.degree}</p>
                  <p className={styles.field}>{EDUCATION.field}</p>

                  <div className={styles.eduMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Duration</span>
                      <span className={styles.metaValue}>{EDUCATION.years}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Grade</span>
                      <span className={styles.metaValue}>{EDUCATION.grade}</span>
                    </div>
                  </div>

                  <button
                    className={styles.flipButton}
                    onClick={() => setIsFlipped(false)}
                    aria-label="View toolbox"
                  >
                    <span className={styles.flipIcon}>🔧</span>
                    View Toolbox
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
