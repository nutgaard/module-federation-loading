import type { ProviderRegistration } from "@mf-demo/contracts";
import { describe, expect, it } from "vitest";

import type { ProviderDefinition } from "./providers";
import {
  computeInitialProgress,
  createInitialProviderRegistryState,
  getFailedProviderIds,
  getLoadedRegistrations,
  reduceProviderRegistryState
} from "./providerRegistryState";

function Dummy() {
  return null;
}

const providers: ProviderDefinition[] = [
  {
    id: "analytics",
    displayName: "Analytics",
    entry: "http://localhost:4171/mf-manifest.json",
    remoteModule: "analytics/registration"
  },
  {
    id: "commerce",
    displayName: "Commerce",
    entry: "http://localhost:4172/mf-manifest.json",
    remoteModule: "commerce/registration"
  },
  {
    id: "settings",
    displayName: "Settings",
    entry: "http://localhost:4173/mf-manifest.json",
    remoteModule: "settings/registration"
  }
];

const analyticsProvider = providers[0];
const commerceProvider = providers[1];

function registration(providerId: "analytics" | "commerce"): ProviderRegistration {
  return {
    providerId,
    displayName: providerId,
    menu: [
      {
        type: "route",
        id: `${providerId}-route`,
        label: "Route",
        order: 1,
        path: `/${providerId}/route`,
        component: Dummy
      }
    ],
    homeWidgets: []
  };
}

describe("providerRegistryState", () => {
  it("tracks startup progress across success and error completions", () => {
    let state = createInitialProviderRegistryState(providers);
    expect(computeInitialProgress(state)).toMatchObject({ completed: 0, total: 3, percent: 0 });

    state = reduceProviderRegistryState(state, {
      type: "attempt-start",
      provider: analyticsProvider,
      at: 1
    });
    state = reduceProviderRegistryState(state, {
      type: "attempt-success",
      provider: analyticsProvider,
      registration: registration("analytics"),
      at: 2
    });
    state = reduceProviderRegistryState(state, {
      type: "attempt-start",
      provider: commerceProvider,
      at: 3
    });
    state = reduceProviderRegistryState(state, {
      type: "attempt-error",
      provider: commerceProvider,
      errorMessage: "offline",
      at: 4
    });

    const progress = computeInitialProgress(state);
    expect(progress.completed).toBe(2);
    expect(progress.total).toBe(3);
    expect(progress.isComplete).toBe(false);
  });

  it("collects loaded registrations and failed ids", () => {
    let state = createInitialProviderRegistryState(providers);

    state = reduceProviderRegistryState(state, {
      type: "attempt-success",
      provider: analyticsProvider,
      registration: registration("analytics"),
      at: 10
    });
    state = reduceProviderRegistryState(state, {
      type: "attempt-error",
      provider: commerceProvider,
      errorMessage: "manifest not reachable",
      at: 11
    });

    expect(getLoadedRegistrations(state).map((reg) => reg.providerId)).toEqual(["analytics"]);
    expect(getFailedProviderIds(state)).toContain("commerce");
  });

  it("supports error to recovery transitions", () => {
    let state = createInitialProviderRegistryState(providers);

    state = reduceProviderRegistryState(state, {
      type: "attempt-error",
      provider: analyticsProvider,
      errorMessage: "offline",
      at: 1
    });
    expect(state.providers["analytics"].status).toBe("error");

    state = reduceProviderRegistryState(state, {
      type: "attempt-start",
      provider: analyticsProvider,
      at: 2
    });
    expect(state.providers["analytics"].status).toBe("loading");

    state = reduceProviderRegistryState(state, {
      type: "attempt-success",
      provider: analyticsProvider,
      registration: registration("analytics"),
      at: 3
    });
    expect(state.providers["analytics"].status).toBe("loaded");
    expect(state.providers["analytics"].errorMessage).toBeUndefined();
  });
});
