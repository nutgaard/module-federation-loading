import type {
  HomeWidgetRegistration,
  MenuNode,
  MenuRouteNode,
  ProviderRegistration
} from "@mf-demo/contracts";
import { flattenMenuRoutes, sortMenuTree } from "@mf-demo/contracts";

export function buildCombinedMenu(registrations: ProviderRegistration[]): MenuNode[] {
  const merged = registrations.flatMap((registration) => registration.menu);
  return sortMenuTree(merged);
}

export function collectRouteNodes(registrations: ProviderRegistration[]): MenuRouteNode[] {
  const routeNodes = registrations.flatMap((registration) => flattenMenuRoutes(registration.menu));
  return [...routeNodes].sort((a, b) => a.path.localeCompare(b.path));
}

export function collectWidgets(registrations: ProviderRegistration[]): HomeWidgetRegistration[] {
  return registrations
    .flatMap((registration) => registration.homeWidgets)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

