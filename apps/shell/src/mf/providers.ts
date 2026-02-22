export type ProviderId = string;

export interface ProviderDefinition {
  id: ProviderId;
  displayName: string;
  entry: string;
  remoteModule: string;
}
