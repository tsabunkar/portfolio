import { useCallback, useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import styles from "./AwsCostDashboard.module.css";

export default function AwsCostDashboard() {
  const { authedFetch } = useAuth();
  const [dailyData, setDailyData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await authedFetch("/cost-explorer");

      const resultsByTime = data.ResultsByTime || [];
      const serviceMap = {};

      const daily = resultsByTime.map((entry) => {
        const date = entry.TimePeriod?.Start || "";
        const groups = entry.Groups || [];
        let total = 0;
        groups.forEach((g) => {
          const amount = parseFloat(g.Metrics?.UnblendedCost?.Amount || "0");
          total += amount;
          const service = (g.Keys || [])[0] || "Unknown";
          serviceMap[service] = (serviceMap[service] || 0) + amount;
        });
        return { date, cost: Math.round(total * 100) / 100 };
      });

      setDailyData(daily);

      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const thisMonthPrefix = todayStr.slice(0, 7);

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const weekStartStr = startOfWeek.toISOString().slice(0, 10);

      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().slice(0, 10);

      const thisMonthCost = daily
        .filter((d) => d.date.startsWith(thisMonthPrefix))
        .reduce((s, d) => s + d.cost, 0);

      const thisWeekCost = daily
        .filter((d) => d.date >= weekStartStr && d.date <= todayStr)
        .reduce((s, d) => s + d.cost, 0);

      const last2DaysCost = daily
        .filter((d) => d.date >= twoDaysAgoStr)
        .reduce((s, d) => s + d.cost, 0);

      const services = Object.entries(serviceMap)
        .map(([name, cost]) => ({ name, cost: Math.round(cost * 100) / 100 }))
        .sort((a, b) => b.cost - a.cost);

      setServiceData(services);

      const totalCost = daily.reduce((s, d) => s + d.cost, 0);
      const avgDaily = daily.length ? totalCost / daily.length : 0;
      setTotals({
        total: Math.round(totalCost * 100) / 100,
        avgDaily: Math.round(avgDaily * 100) / 100,
        days: daily.length,
        thisMonth: Math.round(thisMonthCost * 100) / 100,
        thisWeek: Math.round(thisWeekCost * 100) / 100,
        last2Days: Math.round(last2DaysCost * 100) / 100,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authedFetch]);

  useEffect(() => {
    fetchCosts();
  }, [fetchCosts]);

  if (loading) return <div className={styles.box}><p className={styles.loading}>Loading cost data…</p></div>;
  if (error) return <div className={styles.box}><p className={styles.error}>{error}</p></div>;

  const formatCurrency = (v) => `$${v.toFixed(2)}`;
  const CHART_BAR_HEIGHT = 36;
  const serviceChartHeight = Math.max(serviceData.length * CHART_BAR_HEIGHT + 60, 200);

  return (
    <div className={styles.box}>
      <h3 className={styles.title}>AWS Cost & Usage</h3>

      {totals && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCurrency(totals.total)}</span>
            <span className={styles.statLabel}>Total ({totals.days} days)</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCurrency(totals.avgDaily)}</span>
            <span className={styles.statLabel}>Daily Average</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCurrency(totals.thisMonth)}</span>
            <span className={styles.statLabel}>This Month</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCurrency(totals.thisWeek)}</span>
            <span className={styles.statLabel}>This Week</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCurrency(totals.last2Days)}</span>
            <span className={styles.statLabel}>Last 2 Days</span>
          </div>
        </div>
      )}

      <div className={styles.charts}>
        <div className={styles.chartSection}>
          <h4 className={styles.chartTitle}>Daily Cost</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailyData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, "Cost"]} />
              <Bar dataKey="cost" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartSection}>
          <h4 className={styles.chartTitle}>By Service</h4>
          <ResponsiveContainer width="100%" height={serviceChartHeight}>
            <BarChart data={serviceData} layout="vertical" margin={{ top: 8, right: 40, left: 180, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={170} tickMargin={4} />
              <Tooltip formatter={(v) => [`$${v}`, "Cost"]} />
              <Bar dataKey="cost" fill="var(--accent)" radius={[0, 3, 3, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
