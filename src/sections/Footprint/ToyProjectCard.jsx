/**
 * sections/Footprint/ToyProjectCard.jsx
 * Individual toy project card with link to live project
 */

import styles from "./ToyProjectCard.module.css";

export default function ToyProjectCard({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className={styles.projectCard}
      title={`Visit ${project.name}`}
    >
      <div className={styles.projectContent}>
        <div className={styles.projectIcon}>
          <span className={styles.iconSymbol}>→</span>
        </div>

        <div className={styles.projectInfo}>
          <h3 className={styles.projectName}>{project.name}</h3>
          {/* <span className={styles.projectLink}>Live Project</span> */}
        </div>
      </div>
    </a>
  );
}
