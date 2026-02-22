export type ProviderId = "analytics" | "commerce" | "settings";

export interface ProviderDefinition {
  id: ProviderId;
  displayName: string;
  remoteModule: `${ProviderId}/registration`;
}

export const providerDefinitions: ProviderDefinition[] = [
  {
    id: "analytics",
    displayName: "Analytics",
    remoteModule: "analytics/registration"
  },
  {
    id: "commerce",
    displayName: "Commerce",
    remoteModule: "commerce/registration"
  },
  {
    id: "settings",
    displayName: "Settings",
    remoteModule: "settings/registration"
  }
];

