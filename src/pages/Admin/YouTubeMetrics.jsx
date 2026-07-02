import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./YouTubeMetrics.module.css";

export default function YouTubeMetrics() {
  const { authedFetch } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await authedFetch("/youtube-metrics");
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authedFetch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className={styles.box}><p className={styles.loading}>Loading YouTube metrics…</p></div>;
  if (error) return <div className={styles.box}><p className={styles.error}>{error}</p></div>;
  if (!data) return null;

  const formatNumber = (n) => parseInt(n).toLocaleString();

  return (
    <div className={styles.box}>
      <h3 className={styles.title}>YouTube Channel</h3>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatNumber(data.subscriberCount)}</span>
          <span className={styles.statLabel}>Subscribers</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatNumber(data.videoCount)}</span>
          <span className={styles.statLabel}>Videos</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatNumber(data.viewCount)}</span>
          <span className={styles.statLabel}>Total Views</span>
        </div>
      </div>
    </div>
  );
}
