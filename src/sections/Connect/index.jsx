/**
 * sections/Connect/index.jsx
 */

import { useReveal } from "@/hooks/useReveal";
import ConnectCard from "./ConnectCard";
import { CONNECT_LINKS } from "@/data";
import styles from "./Connect.module.css";

const DELAYS = ["d1", "d2", "d3"];

export default function ConnectSection() {
  const headerRef = useReveal();

  return (
    <section
      id="connect"
      className={`section ${styles.section}`}
      style={{ background: "var(--bg)" }}
    >
      <div className={styles.inner}>
        {/* Header */}
        <div ref={headerRef} className={`reveal ${styles.header}`}>
          <p className={styles.eyebrow}>Connect</p>
          <h2 className={styles.heading}>
            Let's build something
            <br />
            remarkable.
          </h2>
          <p className={styles.sub}>
            New engagement, advisory, speaking, or just a great architecture
            discussion — I'm always interested.
          </p>
        </div>

        {/* Social cards */}
        <div className={`grid-3 ${styles.cards}`}>
          {CONNECT_LINKS.map((link, i) => (
            <ConnectCard
              key={link.label}
              link={link}
              delayClass={DELAYS[i] ?? ""}
            />
          ))}
        </div>

        {/* Email CTA */}
        <a href="mailto:tsabunkar@gmail.com" className={styles.emailBtn}>
          Send a Direct Email →
        </a>
      </div>
    </section>
  );
}
