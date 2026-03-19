/**
 * components/SpeechPlayer/SpeechPlayer.jsx
 * A floating text-to-speech player bar for article pages.
 * Uses Web Speech API via the useSpeech hook.
 */

import { useSpeech } from "@/hooks/useSpeech";
import styles from "./SpeechPlayer.module.css";

/* ── SVG icons (inline, no dependency) ──────────────────────────── */
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M6 19h4V5H6zm8-14v14h4V5z" />
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 9v-2a7 7 0 0 0 0-14v2a5 5 0 0 1 0 10v2z" />
  </svg>
);

/* ── Sound-wave bars (animated when playing) ─────────────────────── */
function SoundWave({ active }) {
  return (
    <div className={`${styles.wave} ${active ? styles.waveActive : ""}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={styles.bar} style={{ "--i": i }} />
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function SpeechPlayer({ html, title }) {
  const { isPlaying, isPaused, progress, currentWord, isSupported, play, pause, stop } =
    useSpeech(html);

  if (!isSupported) return null; // silent if no API

  const handlePlayPause = () => {
    if (isPlaying) pause();
    else play();
  };

  const statusLabel = isPlaying
    ? "Reading aloud…"
    : isPaused
    ? "Paused"
    : "Listen to article";

  return (
    <div
      className={`${styles.player} ${isPlaying ? styles.playing : ""} ${
        isPaused ? styles.paused : ""
      }`}
      role="region"
      aria-label="Text-to-speech player"
    >
      {/* Left: mic icon + label */}
      <div className={styles.left}>
        <div className={styles.micWrapper}>
          <MicIcon />
          <SoundWave active={isPlaying} />
        </div>
        <div className={styles.info}>
          <span className={styles.statusLabel}>{statusLabel}</span>
          {currentWord && isPlaying && (
            <span className={styles.currentWord}>{currentWord}</span>
          )}
          {!isPlaying && !isPaused && (
            <span className={styles.voiceHint}>🎙️ Female AI Voice</span>
          )}
        </div>
      </div>

      {/* Center: progress bar */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressPct}>{progress}%</span>
      </div>

      {/* Right: controls */}
      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handlePlayPause}
          title={isPlaying ? "Pause" : isPaused ? "Resume" : "Play"}
          aria-label={isPlaying ? "Pause reading" : "Start reading"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        {(isPlaying || isPaused) && (
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={stop}
            title="Stop"
            aria-label="Stop reading"
          >
            <StopIcon />
          </button>
        )}
      </div>
    </div>
  );
}
