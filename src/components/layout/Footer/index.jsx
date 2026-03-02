/**
 * components/layout/Footer/index.jsx
 */

import { memo } from "react";
import { CONNECT_LINKS } from "@/data";
import styles from "./Footer.module.css";

const Footer = memo(function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.logo}>&lt;Tejas Sabunkar /&gt;</span>

        <span className={styles.copy}>
          © 2025 · Solutions Architect · Built with React
        </span>

        <nav className={styles.links} aria-label="Footer social links">
          {CONNECT_LINKS.map(({ label, url, accent }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
              onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
});

export default Footer;
