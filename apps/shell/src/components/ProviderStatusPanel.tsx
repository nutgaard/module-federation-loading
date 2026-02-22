import type { ProviderRuntimeEntry } from "../mf/providerRegistryState";
import styles from "./ProviderStatusPanel.module.css";

interface ProviderStatusPanelProps {
  providers: ProviderRuntimeEntry[];
}

export function ProviderStatusPanel({ providers }: ProviderStatusPanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2>Provider Status</h2>
        <span>{providers.length} configured</span>
      </div>
      <ul className={styles.list}>
        {providers.map((provider) => (
          <li key={provider.providerId} className={styles.item}>
            <div className={styles.row}>
              <strong>{provider.displayName}</strong>
              <span className={`${styles.badge} ${badgeClass(provider.status)}`}>{provider.status}</span>
            </div>
            <div className={styles.meta}>
              <span>Attempts: {provider.attempts}</span>
              {provider.lastAttemptAt ? (
                <span>Last try: {new Date(provider.lastAttemptAt).toLocaleTimeString()}</span>
              ) : (
                <span>Last try: never</span>
              )}
            </div>
            {provider.errorMessage ? <p className={styles.error}>{provider.errorMessage}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function badgeClass(status: ProviderRuntimeEntry["status"]): string {
  switch (status) {
    case "loaded":
      return styles.loaded;
    case "loading":
      return styles.loading;
    case "error":
      return styles.errorState;
    default:
      return styles.idle;
  }
}

