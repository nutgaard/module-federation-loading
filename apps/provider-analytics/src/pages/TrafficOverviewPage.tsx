import styles from "../ui/AnalyticsVisuals.module.css";

const channels = [
  { label: "Organic", value: 72, accent: "var(--accent-a)" },
  { label: "Paid", value: 44, accent: "var(--accent-b)" },
  { label: "Email", value: 31, accent: "var(--accent-c)" },
  { label: "Referral", value: 18, accent: "var(--accent-d)" }
];

export function TrafficOverviewPage() {
  return (
    <div className={styles.stack}>
      <div className={styles.metricGrid}>
        <MetricCard label="Active Sessions" value="8,412" delta="+12.8%" />
        <MetricCard label="Bounce Rate" value="36.1%" delta="-4.2%" muted />
        <MetricCard label="Avg Session" value="04:28" delta="+0:18" />
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Channel Mix</h3>
          <span>Last 30 min</span>
        </div>
        <div className={styles.bars}>
          {channels.map((channel) => (
            <div key={channel.label} className={styles.barRow}>
              <div className={styles.barLabel}>
                <span>{channel.label}</span>
                <strong>{channel.value}%</strong>
              </div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${channel.value}%`, background: channel.accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  delta,
  muted = false
}: {
  label: string;
  value: string;
  delta: string;
  muted?: boolean;
}) {
  return (
    <div className={styles.metricCard}>
      <span className={styles.metricLabel}>{label}</span>
      <strong className={styles.metricValue}>{value}</strong>
      <span className={muted ? styles.metricDeltaMuted : styles.metricDelta}>{delta}</span>
    </div>
  );
}

