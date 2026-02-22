import type { ProviderRegistration } from "@mf-demo/contracts";

import { loadProviderRegistrationFactory } from "./loadProvider";
import { providerDefinitions, type ProviderDefinition, type ProviderId } from "./providers";
import {
  createInitialProviderRegistryState,
  getFailedProviderIds,
  reduceProviderRegistryState,
  type ProviderRegistryState
} from "./providerRegistryState";
import { validateProviderRegistration } from "./validateRegistration";

export type ProviderLoadReason = "initial" | "retry";

export interface ProviderRegistryControllerOptions {
  retryIntervalMs?: number;
  onFailure?: (
    provider: ProviderDefinition,
    error: Error,
    reason: ProviderLoadReason,
    previousStatus: ProviderRegistryState["providers"][ProviderId]["status"]
  ) => void;
  onRecovery?: (provider: ProviderDefinition, registration: ProviderRegistration) => void;
}

type Listener = () => void;

export class ProviderRegistryController {
  private state: ProviderRegistryState;
  private listeners = new Set<Listener>();
  private readonly providersById: Record<ProviderId, ProviderDefinition>;
  private readonly inFlight = new Set<ProviderId>();
  private retryTimer: number | undefined;
  private started = false;
  private disposed = false;

  constructor(
    private readonly providers: ProviderDefinition[] = providerDefinitions,
    private readonly options: ProviderRegistryControllerOptions = {}
  ) {
    this.state = createInitialProviderRegistryState(providers);
    this.providersById = providers.reduce(
      (acc, provider) => {
        acc[provider.id] = provider;
        return acc;
      },
      {} as Record<ProviderId, ProviderDefinition>
    );
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): ProviderRegistryState {
    return this.state;
  }

  start(): void {
    if (this.started || this.disposed) {
      return;
    }
    this.started = true;
    void this.loadInitialProviders();
    const retryIntervalMs = this.options.retryIntervalMs ?? 10_000;
    this.retryTimer = window.setInterval(() => {
      void this.retryFailedProviders();
    }, retryIntervalMs);
  }

  dispose(): void {
    this.disposed = true;
    if (this.retryTimer !== undefined) {
      window.clearInterval(this.retryTimer);
      this.retryTimer = undefined;
    }
    this.listeners.clear();
  }

  async loadInitialProviders(): Promise<void> {
    await Promise.all(this.providers.map((provider) => this.attemptLoadProvider(provider, "initial")));
  }

  async retryFailedProviders(): Promise<void> {
    const failedIds = getFailedProviderIds(this.state);
    await Promise.all(
      failedIds.map((providerId) => {
        const provider = this.providersById[providerId];
        return this.attemptLoadProvider(provider, "retry");
      })
    );
  }

  private async attemptLoadProvider(
    provider: ProviderDefinition,
    reason: ProviderLoadReason
  ): Promise<void> {
    if (this.disposed || this.inFlight.has(provider.id)) {
      return;
    }

    const previousStatus = this.state.providers[provider.id].status;
    this.inFlight.add(provider.id);
    this.dispatch({
      type: "attempt-start",
      provider,
      at: Date.now()
    });

    try {
      const factory = await loadProviderRegistrationFactory(provider);
      const rawRegistration = await factory();
      const registration = validateProviderRegistration(rawRegistration, provider.id);
      this.dispatch({
        type: "attempt-success",
        provider,
        registration,
        at: Date.now()
      });
      if (previousStatus === "error") {
        this.options.onRecovery?.(provider, registration);
      }
    } catch (error) {
      const normalized = normalizeError(error);
      this.dispatch({
        type: "attempt-error",
        provider,
        errorMessage: normalized.message,
        at: Date.now()
      });
      this.options.onFailure?.(provider, normalized, reason, previousStatus);
    } finally {
      this.inFlight.delete(provider.id);
    }
  }

  private dispatch(action: Parameters<typeof reduceProviderRegistryState>[1]): void {
    this.state = reduceProviderRegistryState(this.state, action);
    for (const listener of this.listeners) {
      listener();
    }
  }
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(typeof error === "string" ? error : "Unknown provider load error");
}

