import type { ProviderDefinition } from "./providers";

interface ProviderCatalogRecord {
  id: string;
  displayName?: string;
  entry: string;
  remoteModule?: string;
}

interface ProviderCatalogResponse {
  providers: ProviderCatalogRecord[];
}

export async function loadProviderCatalog(): Promise<ProviderDefinition[]> {
  const url = import.meta.env.VITE_PROVIDER_CATALOG_URL ?? "/providers.json";
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Provider catalog fetch failed (${response.status} ${response.statusText})`);
  }
  const data = (await response.json()) as Partial<ProviderCatalogResponse>;
  if (!data || !Array.isArray(data.providers)) {
    throw new Error("Provider catalog has invalid shape");
  }
  return data.providers.map(normalizeProviderCatalogRecord);
}

function normalizeProviderCatalogRecord(record: ProviderCatalogRecord): ProviderDefinition {
  if (!record || typeof record !== "object") {
    throw new Error("Invalid provider catalog entry");
  }
  if (typeof record.id !== "string" || record.id.length === 0) {
    throw new Error("Provider catalog entry is missing a valid id");
  }
  if (typeof record.entry !== "string" || record.entry.length === 0) {
    throw new Error(`Provider "${record.id}" is missing an entry URL`);
  }
  return {
    id: record.id,
    displayName: typeof record.displayName === "string" && record.displayName.length > 0 ? record.displayName : record.id,
    entry: record.entry,
    remoteModule:
      typeof record.remoteModule === "string" && record.remoteModule.length > 0
        ? record.remoteModule
        : `${record.id}/registration`
  };
}

