import { AccessPoliciesPage } from "./pages/AccessPoliciesPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { ComplianceWidget } from "./widgets/ComplianceWidget";
import styles from "./ui/SettingsShell.module.css";

export function App() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Provider App</p>
        <h1>Settings Remote</h1>
        <p>
          Contributes configuration and governance pages to the shell plus a compliance summary widget. Toggle
          delay/failure with environment variables to demo resilience.
        </p>
      </header>
      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2>Integrations (route preview)</h2>
          <IntegrationsPage />
        </section>
        <section className={styles.panel}>
          <h2>Compliance Widget Preview</h2>
          <ComplianceWidget />
        </section>
      </div>
      <section className={styles.panel}>
        <h2>Access Policies (route preview)</h2>
        <AccessPoliciesPage />
      </section>
    </main>
  );
}

