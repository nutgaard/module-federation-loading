import type { ProviderRegistrationFactory } from "@mf-demo/contracts";

import type { ProviderDefinition } from "./providers";

export async function loadProviderRegistrationFactory(
  provider: ProviderDefinition
): Promise<ProviderRegistrationFactory> {
  switch (provider.id) {
    case "analytics": {
      const mod = await import("analytics/registration");
      return normalizeRemoteModule(mod.default, provider.remoteModule);
    }
    case "commerce": {
      const mod = await import("commerce/registration");
      return normalizeRemoteModule(mod.default, provider.remoteModule);
    }
    case "settings": {
      const mod = await import("settings/registration");
      return normalizeRemoteModule(mod.default, provider.remoteModule);
    }
    default: {
      const unreachable: never = provider.id;
      throw new Error(`Unknown provider: ${String(unreachable)}`);
    }
  }
}

function normalizeRemoteModule(
  candidate: unknown,
  remoteModule: string
): ProviderRegistrationFactory {
  if (typeof candidate !== "function") {
    throw new Error(`Remote ${remoteModule} did not export a default function`);
  }
  return candidate as ProviderRegistrationFactory;
}
