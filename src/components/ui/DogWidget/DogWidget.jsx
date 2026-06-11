/**
 * components/ui/DogWidget/DogWidget.jsx
 *
 * Animated dog mascot fixed at the bottom-right corner.
 * Clicking it triggers a resume.pdf download.
 */
import { useState, useRef } from "react";
import styles from "./DogWidget.module.css";
import dogImg from "/assets/dog-resume.png";

export default function DogWidget() {
  const [isWagging, setIsWagging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [fetching, setFetching] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    setIsWagging(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setIsWagging(false);
  };

  const handleClick = () => {
    if (fetching) return;
    setFetching(true);

    // Trigger wag burst animation
    setIsWagging(false);
    clearTimeout(timerRef.current);
    requestAnimationFrame(() => {
      setIsWagging(true);
    });

    // Create a hidden link and trigger download
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    timerRef.current = setTimeout(() => {
      setFetching(false);
    }, 1500);
  };

  return (
    <div
      id="dog-resume-widget"
      className={`${styles.wrapper} ${isWagging ? styles.wagging : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Download Resume"
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Tooltip */}
      <div
        className={`${styles.tooltip} ${showTooltip ? styles.tooltipVisible : ""}`}
        aria-hidden="true"
      >
        Hi, I am OZ! Grab my friends resume!
      </div>

      {/* Ripple ring on click */}
      <span
        className={`${styles.ring} ${fetching ? styles.ringActive : ""}`}
        aria-hidden="true"
      />

      {/* Dog image */}
      <img
        src={dogImg}
        alt="Cute dog holding resume"
        className={styles.dogImg}
        draggable={false}
      />

      {/* Paw-print shadow */}
      <span className={styles.shadow} aria-hidden="true" />
    </div>
  );
}
