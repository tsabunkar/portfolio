/**
 * sections/Footprint/PlatformCard.jsx
 */

import { memo } from "react";
import { useReveal } from "@/hooks/useReveal";
import styles from "./PlatformCard.module.css";

const PlatformCard = memo(function PlatformCard({ fp }) {
  const ref = useReveal();

  return (
    <a
      ref={ref}
      href={fp.url}
      target="_blank"
      rel="noreferrer"
      className={`reveal card ${styles.card}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${fp.accent}44`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.transform = "";
      }}
    >
      {/* Boarding Pass Header */}
      <div className={styles.boardingHeader}>
        <div className={styles.brandSection}>
          <span className={styles.logoIcon}>△</span>
          <span className={styles.brandName}>CRAFT</span>
        </div>
        <span className={styles.passLabel}>FREE ACCESS</span>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Barcode on left */}
        <div className={styles.barcode}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className={styles.barLine} />
          ))}
        </div>

        {/* Content Section */}
        <div className={styles.contentSection}>
          <h3 className={styles.platformTitle}>{fp.platform}</h3>
          <p className={styles.platformHandle}>{fp.handle}</p>
          <p className={styles.desc}>{fp.desc}</p>
        </div>

        {/* Icon Section */}
        <div className={styles.iconSection}>
          <div
            className={styles.iconWrap}
            style={{
              background: `${fp.accent}18`,
              border: `1px solid ${fp.accent}28`,
            }}
          >
            <span
              className={styles.icon}
              style={{
                color: fp.platform === "Medium" ? "var(--text-mid)" : fp.accent,
              }}
            >
              {fp.icon}
            </span>
          </div>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className={styles.separator}>
        <div className={styles.dashedLine} />
        <div className={styles.notchLeft} />
        <div className={styles.notchRight} />
      </div>

      {/* Footer with stat and CTA button */}
      <div className={styles.footer}>
        <span className={styles.stat}>{fp.stat}</span>
        <button
          className={styles.ctaButton}
          style={{
            background: fp.accent === "#e4405f" ? "#ffd60a" : "#ffd60a",
            color: "#000",
          }}
        >
          VISIT
        </button>
      </div>
    </a>
  );
});

export default PlatformCard;
