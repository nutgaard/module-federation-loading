import type { ProviderRegistration } from "@mf-demo/contracts";
import { sleep } from "@mf-demo/contracts";

import { ConversionFunnelPage } from "./pages/ConversionFunnelPage";
import { TrafficOverviewPage } from "./pages/TrafficOverviewPage";
import { LiveVisitorsWidget } from "./widgets/LiveVisitorsWidget";

export default async function getRegistration(): Promise<ProviderRegistration> {
  const delayMs = Number(import.meta.env.VITE_PROVIDER_DELAY_MS ?? "1800");
  const failMode = import.meta.env.VITE_PROVIDER_FAIL_MODE;
  await sleep(Number.isFinite(delayMs) ? Math.max(0, delayMs) : 0);

  if (failMode === "registration") {
    throw new Error("Simulated analytics registration failure");
  }

  return {
    providerId: "analytics",
    displayName: "Analytics",
    version: "demo",
    menu: [
      {
        type: "group",
        id: "analytics-root",
        label: "Analytics",
        order: 20,
        children: [
          {
            type: "route",
            id: "analytics-traffic",
            label: "Traffic Overview",
            order: 10,
            path: "/analytics/traffic",
            icon: "chart",
            component: TrafficOverviewPage
          },
          {
            type: "group",
            id: "analytics-insights",
            label: "Insights",
            order: 20,
            children: [
              {
                type: "route",
                id: "analytics-funnel",
                label: "Conversion Funnel",
                order: 10,
                path: "/analytics/funnel",
                icon: "funnel",
                component: ConversionFunnelPage
              }
            ]
          }
        ]
      }
    ],
    homeWidgets: [
      {
        id: "analytics-live-visitors",
        title: "Live Visitors",
        order: 20,
        size: "md",
        component: LiveVisitorsWidget
      }
    ]
  };
}

