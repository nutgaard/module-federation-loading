import styles from "../ui/CommerceVisuals.module.css";

const hourlyRevenue = [12, 17, 14, 19, 23, 20, 27, 25, 31, 29];

export function RevenuePulseWidget() {
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <div>
          <p>Revenue (today)</p>
          <h4>$128,420</h4>
        </div>
        <span className={styles.revenueBadge}>+18.2%</span>
      </div>
      <div className={styles.minichart}>
        {hourlyRevenue.map((value, index) => (
          <span key={`${index}-${value}`} style={{ height: `${value * 2}px` }} />
        ))}
      </div>
      <div className={styles.widgetFooter}>
        <span>Avg order: $76</span>
        <span>Refunds: 0.8%</span>
      </div>
    </div>
  );
}

