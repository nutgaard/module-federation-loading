import type { MenuRouteNode } from "@mf-demo/contracts";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Link, Outlet, useRoutes } from "react-router-dom";

import { LoadingBar } from "./components/LoadingBar";
import { ProviderRegistryProvider, useProviderRegistrySnapshot } from "./mf/ProviderRegistryProvider";
import {
  computeInitialProgress as computeShellInitialProgress,
  getLoadedRegistrations
} from "./mf/providerRegistryState";
import { MenuTree } from "./navigation/MenuTree";
import { buildCombinedMenu, collectRouteNodes, collectWidgets } from "./navigation/menuBuilder";
import { OverviewPage } from "./pages/OverviewPage";
import styles from "./App.module.css";

export function App() {
  return (
    <ProviderRegistryProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "#e2e8f0",
              border: "1px solid rgba(148, 163, 184, 0.25)"
            }
          }}
        />
        <RoutedShell />
      </BrowserRouter>
    </ProviderRegistryProvider>
  );
}

function RoutedShell() {
  const snapshot = useProviderRegistrySnapshot();
  const registrations = getLoadedRegistrations(snapshot);
  const menuNodes = buildCombinedMenu(registrations);
  const routeNodes = collectRouteNodes(registrations);
  const widgets = collectWidgets(registrations);
  const providerEntries = Object.values(snapshot.providers);
  const progress = computeShellInitialProgress(snapshot);

  const routes = [
    {
      path: "/",
      element: (
        <ShellLayout
          menuNodes={menuNodes}
          progressPercent={progress.percent}
          progressLabel={`Loading provider modules (${progress.completed}/${progress.total})`}
          showLoadingBar={!progress.isComplete}
        />
      ),
      children: [
        {
          index: true,
          element: <OverviewPage widgets={widgets} providers={providerEntries} />
        },
        ...routeNodes.map((routeNode) => ({
          path: routeNode.path.slice(1),
          element: <RemoteRoutePanel routeNode={routeNode} />
        })),
        {
          path: "*",
          element: (
            <div className={styles.routeWrap}>
              <h2>Route not found</h2>
              <p>This route may belong to a provider that is currently offline.</p>
              <Link to="/">Back to overview</Link>
            </div>
          )
        }
      ]
    }
  ];

  return useRoutes(routes);
}

function ShellLayout({
  menuNodes,
  progressPercent,
  progressLabel,
  showLoadingBar
}: {
  menuNodes: Parameters<typeof MenuTree>[0]["nodes"];
  progressPercent: number;
  progressLabel: string;
  showLoadingBar: boolean;
}) {
  return (
    <div className={styles.appShell}>
      <LoadingBar visible={showLoadingBar} progress={progressPercent} label={progressLabel} />
      <div className={styles.frame}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <h1>Module Federation Shell</h1>
            <p>
              Menu trees and pages are contributed by provider apps. Bring providers online/offline to see
              the shell recover.
            </p>
          </div>
          <section className={styles.navBlock}>
            <h2 className={styles.sectionTitle}>Home</h2>
            <MenuTree
              nodes={[
                {
                  type: "route",
                  id: "shell-home",
                  label: "Overview",
                  order: -1,
                  path: "/",
                  component: () => null
                },
                ...menuNodes
              ]}
            />
          </section>
        </aside>
        <main className={styles.main}>
          <div className={styles.panel}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function RemoteRoutePanel({ routeNode }: { routeNode: MenuRouteNode }) {
  const RouteComponent = routeNode.component;
  return (
    <div className={styles.routeWrap}>
      <div className={styles.pageHeader}>
        <h2>{routeNode.label}</h2>
        <Link to="/">Overview</Link>
      </div>
      <RouteComponent />
      <p className={styles.footerNote}>Provider route: {routeNode.path}</p>
    </div>
  );
}
