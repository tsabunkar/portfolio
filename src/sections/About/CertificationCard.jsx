/**
 * sections/About/CertificationCard.jsx
 * Certification badge card component
 */

import { memo } from "react";
import styles from "./CertificationCard.module.css";

const CertificationCard = memo(function CertificationCard({
  certification,
  index,
  cardId,
}) {
  return (
    <a
      href={certification.credentialUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      style={{ "--card-index": index }}
      data-card-id={cardId}
      title={`View ${certification.name} credential on Credly`}
      aria-label={`${certification.name} - Click to view credential`}
    >
      {/* Badge image */}
      <div className={styles.badgeContainer}>
        <img
          src={certification.badgeImage}
          alt={certification.name}
          className={styles.badgeImage}
          loading="lazy"
        />
      </div>

      {/* Certification info */}
      <div className={styles.info}>
        <h3 className={styles.certName}>{certification.name}</h3>
        <p className={styles.issuer}>{certification.issuer}</p>
        <p className={styles.earnedDate}>Earned {certification.earnedDate}</p>
      </div>

      {/* External link indicator */}
      <div className={styles.linkIndicator} aria-hidden="true">
        ↗
      </div>
    </a>
  );
});

export default CertificationCard;
