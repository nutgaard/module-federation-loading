import type { ProviderRegistration } from "@mf-demo/contracts";
import { describe, expect, it } from "vitest";

import { buildCombinedMenu, collectRouteNodes, collectWidgets } from "./menuBuilder";

function Dummy() {
  return null;
}

describe("menuBuilder", () => {
  const registrations: ProviderRegistration[] = [
    {
      providerId: "analytics",
      displayName: "Analytics",
      menu: [
        {
          type: "group",
          id: "analytics-root",
          label: "Analytics",
          order: 20,
          children: [
            {
              type: "route",
              id: "analytics-trends",
              label: "Trends",
              order: 2,
              path: "/analytics/trends",
              component: Dummy
            },
            {
              type: "route",
              id: "analytics-overview",
              label: "Overview",
              order: 1,
              path: "/analytics/overview",
              component: Dummy
            }
          ]
        }
      ],
      homeWidgets: [
        {
          id: "analytics-widget",
          title: "Analytics Widget",
          order: 20,
          size: "sm",
          component: Dummy
        }
      ]
    },
    {
      providerId: "commerce",
      displayName: "Commerce",
      menu: [
        {
          type: "group",
          id: "commerce-root",
          label: "Commerce",
          order: 10,
          children: [
            {
              type: "route",
              id: "commerce-orders",
              label: "Orders",
              order: 1,
              path: "/commerce/orders",
              component: Dummy
            }
          ]
        }
      ],
      homeWidgets: [
        {
          id: "commerce-widget",
          title: "Commerce Widget",
          order: 10,
          size: "md",
          component: Dummy
        }
      ]
    }
  ];

  it("merges and sorts full provider menu trees", () => {
    const menu = buildCombinedMenu(registrations);
    expect(menu.map((node) => node.id)).toEqual(["commerce-root", "analytics-root"]);
    const analyticsGroup = menu[1];
    expect(analyticsGroup.type).toBe("group");
    if (analyticsGroup.type === "group") {
      expect(analyticsGroup.children.map((node) => node.id)).toEqual([
        "analytics-overview",
        "analytics-trends"
      ]);
    }
  });

  it("extracts route nodes from nested trees", () => {
    const routes = collectRouteNodes(registrations);
    expect(routes.map((route) => route.path)).toEqual([
      "/analytics/overview",
      "/analytics/trends",
      "/commerce/orders"
    ]);
  });

  it("sorts widgets by order", () => {
    const widgets = collectWidgets(registrations);
    expect(widgets.map((widget) => widget.id)).toEqual(["commerce-widget", "analytics-widget"]);
  });
});
