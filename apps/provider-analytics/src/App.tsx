import { ConversionFunnelPage } from "./pages/ConversionFunnelPage";
import { TrafficOverviewPage } from "./pages/TrafficOverviewPage";
import { LiveVisitorsWidget } from "./widgets/LiveVisitorsWidget";
import styles from "./ui/AnalyticsShell.module.css";

export function App() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Provider App</p>
        <h1>Analytics Remote</h1>
        <p>
          Exposes <code>./registration</code> to the shell. Stop this server to simulate an offline provider,
          or set <code>VITE_PROVIDER_DELAY_MS</code> to demonstrate loading progression.
        </p>
      </header>
      <section className={styles.grid}>
        <div className={styles.panel}>
          <h2>Traffic Overview (route preview)</h2>
          <TrafficOverviewPage />
        </div>
        <div className={styles.panel}>
          <h2>Widget Preview</h2>
          <LiveVisitorsWidget />
        </div>
      </section>
      <section className={styles.panel}>
        <h2>Conversion Funnel (route preview)</h2>
        <ConversionFunnelPage />
      </section>
    </main>
  );
}

