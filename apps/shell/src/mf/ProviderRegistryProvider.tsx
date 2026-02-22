import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import toast from "react-hot-toast";

import { loadProviderCatalog } from "./providerCatalog";
import { ProviderRegistryController } from "./providerRegistryController";
import { createInitialProviderRegistryState, type ProviderRegistryState } from "./providerRegistryState";

interface ProviderRegistryContextValue {
  controller: ProviderRegistryController;
  catalogLoading: boolean;
  catalogError?: string;
}

const emptySnapshot = createInitialProviderRegistryState([]);

const ProviderRegistryContext = createContext<ProviderRegistryContextValue | null>(null);

export function ProviderRegistryProvider({ children }: { children: ReactNode }) {
  const [controller, setController] = useState<ProviderRegistryController | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let disposed = false;
    let activeController: ProviderRegistryController | null = null;

    void (async () => {
      try {
        const providers = await loadProviderCatalog();
        if (disposed) {
          return;
        }
        activeController = createController(providers);
        setController(activeController);
        activeController.start();
        setCatalogError(undefined);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown provider catalog error";
        if (disposed) {
          return;
        }
        activeController = createController([]);
        setController(activeController);
        activeController.start();
        setCatalogError(message);
        toast.error(`Provider catalog failed to load: ${message}`);
      } finally {
        if (!disposed) {
          setCatalogLoading(false);
        }
      }
    })();

    return () => {
      disposed = true;
      activeController?.dispose();
    };
  }, []);

  const value: ProviderRegistryContextValue | null = controller
    ? {
        controller,
        catalogLoading,
        catalogError
      }
    : null;

  return <ProviderRegistryContext.Provider value={value}>{children}</ProviderRegistryContext.Provider>;
}

function createController(providers: ConstructorParameters<typeof ProviderRegistryController>[0]) {
  return new ProviderRegistryController(providers, {
    retryIntervalMs: 10_000,
    onFailure: (provider, error, reason, previousStatus) => {
      if (previousStatus === "error") {
        return;
      }
      const retrySuffix =
        reason === "initial" ? " Retrying in the background." : " Will retry again automatically.";
      toast.error(`${provider.displayName} failed to load: ${error.message}.${retrySuffix}`);
    },
    onRecovery: (provider) => {
      toast.success(`${provider.displayName} recovered and is now available.`);
    }
  });
}

export function useProviderRegistryController(): ProviderRegistryController {
  const context = useContext(ProviderRegistryContext);
  if (!context?.controller) {
    throw new Error("ProviderRegistryProvider is still initializing");
  }
  return context.controller;
}

export function useProviderRegistryMeta(): { catalogLoading: boolean; catalogError?: string } {
  const context = useContext(ProviderRegistryContext);
  return {
    catalogLoading: context?.catalogLoading ?? true,
    catalogError: context?.catalogError
  };
}

export function useProviderRegistrySnapshot(): ProviderRegistryState {
  const context = useContext(ProviderRegistryContext);
  const controller = context?.controller;
  return useSyncExternalStore(
    (onStoreChange) => (controller ? controller.subscribe(onStoreChange) : () => undefined),
    () => (controller ? controller.getSnapshot() : emptySnapshot),
    () => (controller ? controller.getSnapshot() : emptySnapshot)
  );
}
