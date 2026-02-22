import styles from "../ui/CommerceVisuals.module.css";

const checks = [
  { label: "Missing images", value: 12, severity: "warn" },
  { label: "Price mismatches", value: 3, severity: "danger" },
  { label: "Out-of-stock hidden", value: 96, severity: "ok" },
  { label: "SEO title coverage", value: 88, severity: "ok" }
];

export function CatalogHealthPage() {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h3>Catalog Quality Checks</h3>
        <span>SKU set: Spring 2026</span>
      </div>
      <div className={styles.checkGrid}>
        {checks.map((check) => (
          <div key={check.label} className={styles.checkCard}>
            <div className={styles.checkTop}>
              <strong>{check.label}</strong>
              <span className={`${styles.dot} ${severityDot(check.severity, styles)}`} />
            </div>
            <div className={styles.checkValue}>{check.value}</div>
          </div>
        ))}
      </div>
      <div className={styles.progressList}>
        <ProgressRow label="Attribute completeness" value={92} />
        <ProgressRow label="Variant consistency" value={84} />
        <ProgressRow label="Localized copy" value={63} />
      </div>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.progressRow}>
      <div className={styles.progressMeta}>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function severityDot(severity: string, classes: Record<string, string>) {
  switch (severity) {
    case "danger":
      return classes.dangerDot;
    case "warn":
      return classes.warnDot;
    default:
      return classes.okDot;
  }
}

