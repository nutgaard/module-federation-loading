import styles from "../ui/AnalyticsVisuals.module.css";

const stages = [
  { label: "Landing", users: 5600, conversion: 100 },
  { label: "Product View", users: 3210, conversion: 57 },
  { label: "Add to Cart", users: 1460, conversion: 26 },
  { label: "Checkout", users: 880, conversion: 16 },
  { label: "Purchase", users: 602, conversion: 11 }
];

export function ConversionFunnelPage() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Conversion Funnel</h3>
        <span>Campaign: Spring launch</span>
      </div>
      <div className={styles.funnel}>
        {stages.map((stage) => (
          <div key={stage.label} className={styles.funnelRow}>
            <div className={styles.funnelMeta}>
              <strong>{stage.label}</strong>
              <span>{stage.users.toLocaleString()} users</span>
            </div>
            <div className={styles.funnelTrack}>
              <div className={styles.funnelFill} style={{ width: `${stage.conversion}%` }} />
            </div>
            <span className={styles.funnelPercent}>{stage.conversion}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

