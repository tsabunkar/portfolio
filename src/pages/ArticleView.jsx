/**
 * pages/ArticleView.jsx
 */
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ARTICLES_CONTENT } from "@/data/articles";
import { useTheme } from "@/hooks/useTheme";
import SpeechPlayer from "@/components/SpeechPlayer/SpeechPlayer";
import styles from "./ArticleView.module.css";

export default function ArticleView() {
  const { slug } = useParams();
  const { zenMode, toggleZenMode } = useTheme();
  const article = ARTICLES_CONTENT.find((a) => a.slug === slug);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (article?.contentFile) {
      fetch(article.contentFile)
        .then((res) => res.text())
        .then((text) => setHtml(text));
    }
  }, [article]);

  if (!article) {
    return (
      <div className={styles.notFound}>
        <h1>Article Not Found</h1>
        <Link to="/" className="btn-primary">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <article className={styles.articlePage}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link to="/" className={styles.backLink}>
            ← Back to Portfolio
          </Link>
          <button
            onClick={toggleZenMode}
            className={`${styles.zenSwitch} ${zenMode ? styles.active : ""}`}
            title={zenMode ? "Disable Zen Mode" : "Enable Zen Mode"}
          >
            <span className={styles.zenLabel}>Zen Mode</span>
            <div className={styles.zenSlider}>
              <div className={styles.zenCircle}>{zenMode ? "🧘" : "💃"}</div>
            </div>
          </button>
        </div>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <span className={styles.date}>{article.date}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.readTime}>{article.readTime}</span>
        </div>


        {article.heroImage && (
          <img
            src={article.heroImage}
            alt={article.title}
            className={styles.heroImage}
          />
        )}
      </header>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <footer className={styles.footer}>
        <hr className={styles.divider} />
        <p>Thanks for reading.</p>
        <Link
          to="/#footprint"
          className="btn-primary"
          style={{ display: "inline-block", marginTop: "1rem" }}
        >
          Back to Articles
        </Link>
      </footer>

      {/* ── Floating TTS player — fixed overlay, draggable ── */}
      {html && <SpeechPlayer html={html} />}
    </article>
  );
}
