/**
 * sections/Footprint/PlaylistCard.jsx
 * Individual YouTube playlist card with expand/collapse animation
 */

import { useState } from 'react';
import styles from './PlaylistCard.module.css';

export default function PlaylistCard({ playlist }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${styles.playlistCard} ${isExpanded ? styles.expanded : ''}`}>
      <button
        className={styles.playlistHeader}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className={styles.playlistIcon}>
          <span className={styles.iconSymbol}>{playlist.thumbnail}</span>
        </div>

        <div className={styles.playlistInfo}>
          <h3 className={styles.playlistTitle}>{playlist.title}</h3>
          <div className={styles.playlistMeta}>
            <span className={styles.videoCount}>{playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}</span>
            <span className={styles.divider}>•</span>
            <span className={styles.visibility}>{playlist.visibility}</span>
          </div>
        </div>

        <div className={styles.expandIcon}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={styles.chevron}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <div className={styles.playlistDetails}>
        <div className={styles.detailsContent}>
          <p className={styles.lastUpdated}>{playlist.lastUpdated}</p>
          <a
            href={playlist.url}
            target="_blank"
            rel="noreferrer"
            className={styles.viewPlaylistBtn}
            onClick={(e) => e.stopPropagation()}
          >
            View full playlist →
          </a>
        </div>
      </div>
    </div>
  );
}
