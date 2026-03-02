/**
 * sections/Footprint/index.jsx
 */

import { useReveal } from '@/hooks/useReveal';
import SectionHeader from '@/components/ui/SectionHeader';
import PlatformCard from './PlatformCard';
import { FOOTPRINT, ARTICLES } from '@/data';
import styles from './Footprint.module.css';

export default function FootprintSection() {
  const tableRef = useReveal();

  return (
    <section id="footprint" className="section" style={{ background: 'var(--bg-alt)' }}>
      <div className="inner">
        <SectionHeader
          eyebrow="Digital Footprint"
          title="Sharing the craft."
          sub="Architecture knowledge delivered at the depth it deserves."
          eyebrowColor="#bf5af2"
        />

        {/* Platform cards */}
        <div className={`grid-3 ${styles.platforms}`}>
          {FOOTPRINT.map((fp) => (
            <PlatformCard key={fp.platform} fp={fp} />
          ))}

          {/* Articles table — spans full width */}
          <div
            ref={tableRef}
            className={`reveal card d3 ${styles.articlesCard}`}
          >
            <p className={styles.tableLabel}>Recent Articles on Medium</p>
            {ARTICLES.map((a, i) => (
              <a
                key={a.title}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className={`${styles.articleRow} ${i < ARTICLES.length - 1 ? styles.divided : ''}`}
              >
                <span className={styles.articleTitle}>{a.title}</span>
                <span className={styles.articleMeta}>
                  <span className={styles.reads}>{a.reads}</span>
                  <span className={styles.date}>{a.date}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
