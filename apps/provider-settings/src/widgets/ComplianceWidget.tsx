import styles from "../ui/SettingsVisuals.module.css";

export function ComplianceWidget() {
  return (
    <div className={styles.widget}>
      <div className={styles.widgetTop}>
        <div>
          <p>Policy compliance</p>
          <h4>92%</h4>
        </div>
        <span className={styles.shield}>A</span>
      </div>
      <div className={styles.donutWrap}>
        <div className={styles.donut} style={{ ["--fill" as string]: "92%" }} />
        <div className={styles.legend}>
          <span>Controls passing</span>
          <strong>184 / 200</strong>
        </div>
      </div>
    </div>
  );
}

