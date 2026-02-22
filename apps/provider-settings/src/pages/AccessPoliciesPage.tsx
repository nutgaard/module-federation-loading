import styles from "../ui/SettingsVisuals.module.css";

const policyRows = [
  { area: "Admin Console", mode: "MFA Required", coverage: 94 },
  { area: "Support Tools", mode: "SSO + IP Allowlist", coverage: 81 },
  { area: "Data Export", mode: "Just-in-time approval", coverage: 67 }
];

export function AccessPoliciesPage() {
  return (
    <div className={styles.stack}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3>Policy Coverage</h3>
          <span>Tenant groups</span>
        </div>
        <div className={styles.progressStack}>
          {policyRows.map((row) => (
            <div key={row.area} className={styles.progressRow}>
              <div className={styles.progressMeta}>
                <div>
                  <strong>{row.area}</strong>
                  <p>{row.mode}</p>
                </div>
                <span>{row.coverage}%</span>
              </div>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${row.coverage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3>Recent Policy Events</h3>
          <span>Past 24h</span>
        </div>
        <ul className={styles.timeline}>
          <li>Role template “Ops Readonly” updated for 12 tenants</li>
          <li>Temporary exception expired for Data Export policy</li>
          <li>New SCIM group mapping synced from IdP</li>
        </ul>
      </div>
    </div>
  );
}

