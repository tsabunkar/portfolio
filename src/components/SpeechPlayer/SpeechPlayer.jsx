/**
 * components/SpeechPlayer/SpeechPlayer.jsx
 *
 * Spotify-style floating text-to-speech player.
 *  • Fixed on screen – can be dragged anywhere (mouse + touch)
 *  • Shows play/pause/stop controls, a progress bar and live word highlight
 *  • Collapses the progress row when stopped/idle
 */

import { useSpeech }     from "@/hooks/useSpeech";
import { useDraggable }  from "@/hooks/useDraggable";
import styles            from "./SpeechPlayer.module.css";

/* ── Inline SVG icons ────────────────────────────────────────────── */
const PlayIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>;
const StopIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 6h12v12H6z"/></svg>;

/** Grip dots — the visual drag-handle indicator */
const GripIcon = () => (
  <svg viewBox="0 0 10 18" fill="currentColor" width="10" height="18" aria-hidden="true">
    {[0, 6, 12].map((cy) => (
      <g key={cy}>
        <circle cx="2" cy={cy + 3} r="1.5" opacity="0.5"/>
        <circle cx="8" cy={cy + 3} r="1.5" opacity="0.5"/>
      </g>
    ))}
  </svg>
);

/** Mic SVG */
const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 9v-2a7 7 0 0 0 0-14v2a5 5 0 0 1 0 10v2z"/>
  </svg>
);

/** Animated sound-wave bars */
function SoundWave({ active }) {
  return (
    <div className={`${styles.wave} ${active ? styles.waveActive : ""}`}>
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={styles.bar} style={{ "--i": i }} />
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function SpeechPlayer({ html }) {
  const { isPlaying, isPaused, progress, currentWord, isSupported, play, pause, stop } =
    useSpeech(html);

  const { ref, pos, isDragging, resetPos, dragHandlers } = useDraggable();

  if (!isSupported) return null;

  const handlePlayPause = () => (isPlaying ? pause() : play());
  const active          = isPlaying || isPaused;

  /* Inline style: only applied once user has dragged from the CSS default */
  const floatStyle = pos
    ? { left: pos.x, top: pos.y, bottom: "auto", transform: "none" }
    : undefined;

  return (
    <div
      ref={ref}
      style={floatStyle}
      className={[
        styles.player,
        isPlaying  ? styles.playing  : "",
        isPaused   ? styles.paused   : "",
        isDragging ? styles.dragging : "",
      ].join(" ")}
      role="region"
      aria-label="Text-to-speech player"
    >
      {/* ── Drag handle ────────────────────────────────────────────── */}
      <div
        className={styles.dragHandle}
        title="Drag to reposition"
        {...dragHandlers}  /* onPointerDown / Move / Up */
      >
        <GripIcon />
      </div>

      {/* ── Left: mic + wave + status ──────────────────────────────── */}
      <div className={styles.left} {...dragHandlers}>
        <div className={`${styles.micRing} ${isPlaying ? styles.micRingActive : ""}`}>
          <MicIcon />
        </div>
        <SoundWave active={isPlaying} />
        <div className={styles.info}>
          <span className={styles.status}>
            {isPlaying ? "Reading aloud" : isPaused ? "Paused" : "Listen to article"}
          </span>
          {currentWord && isPlaying && (
            <span className={styles.word}>{currentWord}</span>
          )}
          {!isPlaying && !isPaused && (
            <span className={styles.hint}>🎙 Female AI voice</span>
          )}
        </div>
      </div>

      {/* ── Centre: scrub / progress ───────────────────────────────── */}
      <div className={styles.progressZone} data-no-drag>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
          {/* Draggable thumb knob */}
          <div className={styles.thumb} style={{ left: `${progress}%` }} />
        </div>
        <span className={styles.pct}>{progress}%</span>
      </div>

      {/* ── Right: controls ────────────────────────────────────────── */}
      <div className={styles.controls} data-no-drag>
        {active && (
          <button
            className={`${styles.btn} ${styles.btnStop}`}
            onClick={stop}
            title="Stop"
            aria-label="Stop reading"
          >
            <StopIcon />
          </button>
        )}
        <button
          className={`${styles.btn} ${styles.btnPlay}`}
          onClick={handlePlayPause}
          title={isPlaying ? "Pause" : isPaused ? "Resume" : "Play"}
          aria-label={isPlaying ? "Pause reading" : "Start reading"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      {/* ── Reset-position pill (shows after user drags) ────────────── */}
      {pos && (
        <button
          className={styles.resetBtn}
          onClick={resetPos}
          title="Snap back to default position"
          data-no-drag
          aria-label="Reset player position"
        >
          ↩
        </button>
      )}
    </div>
  );
}
