import { CatalogHealthPage } from "./pages/CatalogHealthPage";
import { OrdersBoardPage } from "./pages/OrdersBoardPage";
import { RevenuePulseWidget } from "./widgets/RevenuePulseWidget";
import shellStyles from "./ui/CommerceShell.module.css";

export function App() {
  return (
    <main className={shellStyles.page}>
      <header className={shellStyles.hero}>
        <p className={shellStyles.eyebrow}>Provider App</p>
        <h1>Commerce Remote</h1>
        <p>
          Provides catalog and order management routes plus a revenue widget to the shell. Use
          <code> VITE_PROVIDER_DELAY_MS</code> to simulate slower remote startup.
        </p>
      </header>
      <div className={shellStyles.grid}>
        <section className={shellStyles.panel}>
          <h2>Orders Board (route preview)</h2>
          <OrdersBoardPage />
        </section>
        <section className={shellStyles.panel}>
          <h2>Revenue Widget Preview</h2>
          <RevenuePulseWidget />
        </section>
      </div>
      <section className={shellStyles.panel}>
        <h2>Catalog Health (route preview)</h2>
        <CatalogHealthPage />
      </section>
    </main>
  );
}

