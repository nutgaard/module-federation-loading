import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import toast from "react-hot-toast";

import { ProviderRegistryController } from "./providerRegistryController";
import type { ProviderRegistryState } from "./providerRegistryState";

const ProviderRegistryContext = createContext<ProviderRegistryController | null>(null);

export function ProviderRegistryProvider({ children }: { children: ReactNode }) {
  const [controller] = useState(
    () =>
      new ProviderRegistryController(undefined, {
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
      })
  );

  useEffect(() => {
    controller.start();
    return () => {
      controller.dispose();
    };
  }, [controller]);

  return <ProviderRegistryContext.Provider value={controller}>{children}</ProviderRegistryContext.Provider>;
}

export function useProviderRegistryController(): ProviderRegistryController {
  const controller = useContext(ProviderRegistryContext);
  if (!controller) {
    throw new Error("ProviderRegistryProvider is missing");
  }
  return controller;
}

export function useProviderRegistrySnapshot(): ProviderRegistryState {
  const controller = useProviderRegistryController();
  return useSyncExternalStore(
    (onStoreChange) => controller.subscribe(onStoreChange),
    () => controller.getSnapshot(),
    () => controller.getSnapshot()
  );
}
