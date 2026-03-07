import { useTheme } from '@/hooks/useTheme';
import styles from './BackgroundMotion.module.css';

const BackgroundMotion = () => {
  const { dark } = useTheme();
  const themeClass = dark ? styles.dark : styles.light;

  return (
    <div className={`${styles.background} ${themeClass}`} aria-hidden="true">
      <img src="/assets/architect_sketch.png" className={styles.image} alt="Architect Sketch" />
    </div>
  );
};

export default BackgroundMotion;
