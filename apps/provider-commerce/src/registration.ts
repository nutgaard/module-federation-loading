import type { ProviderRegistration } from "@mf-demo/contracts";
import { sleep } from "@mf-demo/contracts";

import { CatalogHealthPage } from "./pages/CatalogHealthPage";
import { OrdersBoardPage } from "./pages/OrdersBoardPage";
import { RevenuePulseWidget } from "./widgets/RevenuePulseWidget";

export default async function getRegistration(): Promise<ProviderRegistration> {
  const delayMs = Number(import.meta.env.VITE_PROVIDER_DELAY_MS ?? "2400");
  const failMode = import.meta.env.VITE_PROVIDER_FAIL_MODE;
  await sleep(Number.isFinite(delayMs) ? Math.max(0, delayMs) : 0);

  if (failMode === "registration") {
    throw new Error("Simulated commerce registration failure");
  }

  return {
    providerId: "commerce",
    displayName: "Commerce",
    version: "demo",
    menu: [
      {
        type: "group",
        id: "commerce-root",
        label: "Commerce",
        order: 30,
        children: [
          {
            type: "group",
            id: "commerce-operations",
            label: "Operations",
            order: 10,
            children: [
              {
                type: "route",
                id: "commerce-orders",
                label: "Orders Board",
                order: 10,
                path: "/commerce/orders",
                icon: "orders",
                component: OrdersBoardPage
              }
            ]
          },
          {
            type: "route",
            id: "commerce-catalog",
            label: "Catalog Health",
            order: 20,
            path: "/commerce/catalog-health",
            icon: "catalog",
            component: CatalogHealthPage
          }
        ]
      }
    ],
    homeWidgets: [
      {
        id: "commerce-revenue-pulse",
        title: "Revenue Pulse",
        order: 10,
        size: "md",
        component: RevenuePulseWidget
      }
    ]
  };
}

