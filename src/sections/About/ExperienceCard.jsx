/**
 * sections/About/ExperienceCard.jsx
 * 3D animated experience card component
 */

import { useState, useCallback, memo } from "react";
import styles from "./ExperienceCard.module.css";

const ExperienceCard = memo(function ExperienceCard({ experience, index, cardId }) {
  const [expanded, setExpanded] = useState(false);
  const [activePosition, setActivePosition] = useState(0);

  const currentPosition = experience.positions[activePosition];

  const handleToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => !prev);
  }, []);

  const handleTabClick = useCallback((i, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePosition(i);
  }, []);

  return (
    <div
      className={`${styles.card} ${expanded ? styles.expanded : ""}`}
      style={{ "--card-index": index }}
      data-card-id={cardId}
      data-expanded={expanded ? "true" : "false"}
    >
      {/* Company header */}
      <div className={styles.header} onClick={(e) => e.stopPropagation()}>
        <div className={styles.logoCircle}>{experience.logo}</div>
        <div className={styles.companyInfo}>
          <h3 className={styles.company}>{experience.company}</h3>
          <p className={styles.totalDuration}>{experience.totalDuration}</p>
        </div>
        <button
          className={styles.expandBtn}
          onClick={handleToggle}
          aria-label={expanded ? `Collapse ${experience.company} details` : `Expand ${experience.company} details`}
          aria-expanded={expanded}
          aria-controls={`${cardId}-content`}
          type="button"
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {/* Positions - shown when expanded */}
      {expanded && (
        <div
          className={styles.content}
          id={`${cardId}-content`}
          role="region"
          aria-label={`${experience.company} position details`}
        >
          {/* Position tabs */}
          {experience.positions.length > 1 && (
            <div className={styles.tabs} role="tablist">
              {experience.positions.map((pos, i) => (
                <button
                  key={`${cardId}-tab-${i}`}
                  className={`${styles.tab} ${
                    activePosition === i ? styles.activeTab : ""
                  }`}
                  onClick={(e) => handleTabClick(i, e)}
                  type="button"
                  role="tab"
                  aria-selected={activePosition === i}
                  aria-controls={`${cardId}-panel-${i}`}
                  id={`${cardId}-tab-${i}`}
                >
                  {pos.role}
                </button>
              ))}
            </div>
          )}

          {/* Active position details */}
          <div
            className={styles.position}
            key={`${cardId}-pos-${activePosition}`}
            role="tabpanel"
            id={`${cardId}-panel-${activePosition}`}
            aria-labelledby={`${cardId}-tab-${activePosition}`}
          >
            <div className={styles.positionHeader}>
              <h4 className={styles.role}>{currentPosition.role}</h4>
              <span className={styles.period}>{currentPosition.period}</span>
            </div>

            <p className={styles.duration}>{currentPosition.duration}</p>
            <p className={styles.location}>
              {currentPosition.location} · {currentPosition.type}
            </p>

            <p className={styles.description}>{currentPosition.description}</p>

            {/* Skills */}
            <div className={styles.skills}>
              {currentPosition.skills.map((skill, skillIdx) => (
                <span key={`${cardId}-skill-${skillIdx}-${skill}`} className={styles.skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ExperienceCard;
