import { loadRemote } from "@module-federation/runtime";
import type { ProviderRegistrationFactory } from "@mf-demo/contracts";

import type { ProviderDefinition } from "./providers";

export async function loadProviderRegistrationFactory(
  provider: ProviderDefinition
): Promise<ProviderRegistrationFactory> {
  const mod = await loadRemote<{ default?: unknown }>(provider.remoteModule);
  if (!mod) {
    throw new Error(`Remote ${provider.remoteModule} returned no module`);
  }
  return normalizeRemoteModule(mod.default, provider.remoteModule);
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
