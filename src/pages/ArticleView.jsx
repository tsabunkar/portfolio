/**
 * pages/ArticleView.jsx
 */
import { useParams, Link } from "react-router-dom";
import { ARTICLES_CONTENT } from "@/data/articles";
import styles from "./ArticleView.module.css";

export default function ArticleView() {
  const { slug } = useParams();
  const article = ARTICLES_CONTENT.find((a) => a.slug === slug);

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
        <Link to="/" className={styles.backLink}>
          ← Back to Portfolio
        </Link>
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
        dangerouslySetInnerHTML={{ __html: article.content }}
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
    </article>
  );
}
