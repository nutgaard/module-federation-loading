import type { HomeWidgetRegistration } from "@mf-demo/contracts";

import type { ProviderRuntimeEntry } from "../mf/providerRegistryState";
import { ProviderStatusPanel } from "../components/ProviderStatusPanel";
import styles from "./OverviewPage.module.css";

interface OverviewPageProps {
  widgets: HomeWidgetRegistration[];
  providers: ProviderRuntimeEntry[];
}

export function OverviewPage({ widgets, providers }: OverviewPageProps) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Shell Overview</p>
          <h1>Federated modules load progressively</h1>
          <p className={styles.lead}>
            Provider apps contribute menu trees, dedicated routes, and dashboard widgets. The shell remains
            usable even when remotes are offline and keeps retrying in the background.
          </p>
        </div>
      </section>

      <div className={styles.grid}>
        <ProviderStatusPanel providers={providers} />
        <section className={styles.widgetPanel}>
          <div className={styles.header}>
            <h2>Provider Widgets</h2>
            <span>{widgets.length} loaded</span>
          </div>
          {widgets.length === 0 ? (
            <p className={styles.empty}>
              No widgets available yet. Start provider apps or wait for background retries to succeed.
            </p>
          ) : (
            <div className={styles.widgets}>
              {widgets.map((widget) => {
                const Widget = widget.component;
                return (
                  <section key={widget.id} className={`${styles.widgetCard} ${sizeClass(widget.size, styles)}`}>
                    <header className={styles.widgetHeader}>
                      <h3>{widget.title}</h3>
                      <span>{widget.size.toUpperCase()}</span>
                    </header>
                    <div className={styles.widgetBody}>
                      <Widget />
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function sizeClass(size: HomeWidgetRegistration["size"], classes: Record<string, string>) {
  switch (size) {
    case "lg":
      return classes.lg;
    case "md":
      return classes.md;
    default:
      return classes.sm;
  }
}

