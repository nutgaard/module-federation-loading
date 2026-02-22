import type { ProviderRegistration, ProviderStatusState } from "@mf-demo/contracts";

import type { ProviderDefinition } from "./providers";

export interface ProviderRuntimeEntry extends ProviderStatusState {
  attempts: number;
  initialAttemptFinished: boolean;
  registration?: ProviderRegistration;
}

export interface ProviderRegistryState {
  providers: Record<string, ProviderRuntimeEntry>;
  initialTotal: number;
}

export type ProviderRegistryAction =
  | {
      type: "attempt-start";
      provider: ProviderDefinition;
      at: number;
    }
  | {
      type: "attempt-success";
      provider: ProviderDefinition;
      registration: ProviderRegistration;
      at: number;
    }
  | {
      type: "attempt-error";
      provider: ProviderDefinition;
      errorMessage: string;
      at: number;
    };

export function createInitialProviderRegistryState(
  providers: ProviderDefinition[]
): ProviderRegistryState {
  const records: Record<string, ProviderRuntimeEntry> = {};
  for (const provider of providers) {
    records[provider.id] = {
      providerId: provider.id,
      displayName: provider.displayName,
      status: "idle",
      attempts: 0,
      initialAttemptFinished: false
    };
  }
  return {
    providers: records,
    initialTotal: providers.length
  };
}

export function reduceProviderRegistryState(
  state: ProviderRegistryState,
  action: ProviderRegistryAction
): ProviderRegistryState {
  const previous = state.providers[action.provider.id];
  const base: ProviderRuntimeEntry = {
    ...previous,
    lastAttemptAt: action.at
  };

  let next: ProviderRuntimeEntry;

  switch (action.type) {
    case "attempt-start":
      next = {
        ...base,
        attempts: previous.attempts + 1,
        status: "loading",
        errorMessage: undefined
      };
      break;
    case "attempt-success":
      next = {
        ...base,
        status: "loaded",
        registration: action.registration,
        lastSuccessAt: action.at,
        initialAttemptFinished: true,
        errorMessage: undefined
      };
      break;
    case "attempt-error":
      next = {
        ...base,
        status: "error",
        initialAttemptFinished: true,
        errorMessage: action.errorMessage
      };
      break;
    default: {
      const unreachable: never = action;
      return unreachable;
    }
  }

  return {
    ...state,
    providers: {
      ...state.providers,
      [action.provider.id]: next
    }
  };
}

export function computeInitialProgress(state: ProviderRegistryState): {
  completed: number;
  total: number;
  percent: number;
  isComplete: boolean;
} {
  const completed = Object.values(state.providers).filter((entry) => entry.initialAttemptFinished).length;
  const total = state.initialTotal;
  const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
  return {
    completed,
    total,
    percent,
    isComplete: completed >= total
  };
}

export function getLoadedRegistrations(state: ProviderRegistryState): ProviderRegistration[] {
  return Object.values(state.providers)
    .filter((entry) => entry.status === "loaded" && entry.registration)
    .map((entry) => entry.registration as ProviderRegistration);
}

export function getFailedProviderIds(state: ProviderRegistryState): string[] {
  return Object.values(state.providers)
    .filter((entry) => entry.status === "error")
    .map((entry) => entry.providerId);
}
