import styles from "../ui/AnalyticsVisuals.module.css";

const sparkline = [22, 28, 26, 34, 31, 39, 45, 42, 48, 51, 47, 56];

export function LiveVisitorsWidget() {
  return (
    <div className={styles.widget}>
      <div className={styles.widgetTop}>
        <div>
          <p className={styles.widgetLabel}>Visitors now</p>
          <h4 className={styles.widgetValue}>1,248</h4>
        </div>
        <span className={styles.pill}>+9.4%</span>
      </div>
      <div className={styles.sparkline} aria-hidden="true">
        {sparkline.map((value, index) => (
          <span key={`${index}-${value}`} style={{ height: `${value}%` }} />
        ))}
      </div>
    </div>
  );
}

