import styles from "../ui/SettingsVisuals.module.css";

const integrations = [
  { name: "Payments Gateway", env: "prod", health: "healthy", latency: "182ms" },
  { name: "CRM Sync", env: "prod", health: "degraded", latency: "1.2s" },
  { name: "Warehouse ERP", env: "stage", health: "healthy", latency: "264ms" },
  { name: "Analytics Export", env: "prod", health: "offline", latency: "-" }
];

export function IntegrationsPage() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Integration Connectors</h3>
        <span>Managed by settings provider</span>
      </div>
      <div className={styles.list}>
        {integrations.map((integration) => (
          <div key={integration.name} className={styles.row}>
            <div>
              <strong>{integration.name}</strong>
              <p>{integration.env.toUpperCase()}</p>
            </div>
            <div className={styles.rowRight}>
              <span className={`${styles.badge} ${healthClass(integration.health, styles)}`}>
                {integration.health}
              </span>
              <small>{integration.latency}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function healthClass(health: string, classes: Record<string, string>) {
  switch (health) {
    case "offline":
      return classes.offline;
    case "degraded":
      return classes.degraded;
    default:
      return classes.healthy;
  }
}

