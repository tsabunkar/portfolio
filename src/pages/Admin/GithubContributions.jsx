import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./GithubContributions.module.css";

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const LEVEL_COLORS = ["#ebedf0", "#fdf6dd", "#fae8a8", "#f2c94c", "#c9951e"];

export default function GithubContributions() {
  const { authedFetch } = useAuth();
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await authedFetch("/github-contributions");
      const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
      if (!calendar) throw new Error("No contribution data found");
      setTotal(calendar.totalContributions || 0);
      setWeeks(calendar.weeks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authedFetch]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const monthLabels = useMemo(() => {
    if (!weeks.length) return [];
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week.contributionDays?.[0];
      if (!firstDay) return;
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: MONTH_LABELS[month], index: i });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  const levelIndex = (count) => {
    if (!count || count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  if (loading) return <div className={styles.box}><p className={styles.loading}>Loading contributions…</p></div>;
  if (error) return <div className={styles.box}><p className={styles.error}>{error}</p></div>;
  if (!weeks.length) return <div className={styles.box}><p className={styles.loading}>No data</p></div>;

  return (
    <div className={styles.box}>
      <h3 className={styles.title}>GitHub Contributions</h3>
      <p className={styles.subtitle}>{total.toLocaleString()} contributions in the last year</p>

      <div className={styles.graph}>
        <div className={styles.dayLabels}>
          {DAY_LABELS.map((l, i) => (
            <span key={i} className={styles.dayLabel}>{l}</span>
          ))}
        </div>

        <div className={styles.grid}>
          <div className={styles.monthRow}>
            {monthLabels.map((m) => (
              <span
                key={m.label}
                className={styles.monthLabel}
                style={{ left: m.index * 15 }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className={styles.weeks}>
            {weeks.map((week, wi) => (
              <div key={wi} className={styles.week}>
                {week.contributionDays.map((day) => (
                  <span
                    key={day.date}
                    className={styles.day}
                    style={{ background: LEVEL_COLORS[levelIndex(day.contributionCount)] }}
                    title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendLabel}>Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <span key={i} className={styles.legendDot} style={{ background: c }} />
          ))}
          <span className={styles.legendLabel}>More</span>
        </div>
      </div>
    </div>
  );
}
