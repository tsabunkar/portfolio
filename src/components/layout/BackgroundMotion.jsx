import { useTheme } from "@/hooks/useTheme";
import styles from "./BackgroundMotion.module.css";

const BackgroundMotion = ({ isHomePage, zenMode }) => {
  const { dark } = useTheme();
  const themeClass = dark ? styles.dark : styles.light;

  // Background is always visible on Home page.
  // In articles, it respects the zenMode toggle.
  const isVisible = isHomePage || !zenMode;

  return (
    <div
      className={`${styles.background} ${themeClass}`}
      style={{
        opacity: isVisible ? 0.06 : 0,
        visibility: isVisible ? "visible" : "hidden",
        transition: "opacity 0.6s ease, visibility 0.6s",
      }}
      aria-hidden="true"
    >
      <img
        src="/assets/architect_sketch.png"
        className={styles.image}
        alt="Architect Sketch"
      />
    </div>
  );
};

export default BackgroundMotion;
