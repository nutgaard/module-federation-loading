import type { ProviderRegistration } from "@mf-demo/contracts";
import { sleep } from "@mf-demo/contracts";

import { AccessPoliciesPage } from "./pages/AccessPoliciesPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { ComplianceWidget } from "./widgets/ComplianceWidget";

export default async function getRegistration(): Promise<ProviderRegistration> {
  const delayMs = Number(import.meta.env.VITE_PROVIDER_DELAY_MS ?? "1200");
  const failMode = import.meta.env.VITE_PROVIDER_FAIL_MODE;
  await sleep(Number.isFinite(delayMs) ? Math.max(0, delayMs) : 0);

  if (failMode === "registration") {
    throw new Error("Simulated settings registration failure");
  }

  return {
    providerId: "settings",
    displayName: "Settings",
    version: "demo",
    menu: [
      {
        type: "group",
        id: "settings-root",
        label: "Settings",
        order: 40,
        children: [
          {
            type: "group",
            id: "settings-platform",
            label: "Platform",
            order: 10,
            children: [
              {
                type: "route",
                id: "settings-integrations",
                label: "Integrations",
                order: 10,
                path: "/settings/integrations",
                icon: "plug",
                component: IntegrationsPage
              }
            ]
          },
          {
            type: "route",
            id: "settings-policies",
            label: "Access Policies",
            order: 20,
            path: "/settings/access-policies",
            icon: "shield",
            component: AccessPoliciesPage
          }
        ]
      }
    ],
    homeWidgets: [
      {
        id: "settings-compliance-widget",
        title: "Compliance Snapshot",
        order: 30,
        size: "sm",
        component: ComplianceWidget
      }
    ]
  };
}

