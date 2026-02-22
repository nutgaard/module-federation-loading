import type { ComponentType } from "react";

export type MenuNode = MenuGroupNode | MenuRouteNode;

export interface MenuGroupNode {
  type: "group";
  id: string;
  label: string;
  order: number;
  children: MenuNode[];
}

export interface MenuRouteNode {
  type: "route";
  id: string;
  label: string;
  order: number;
  path: string;
  component: ComponentType;
  icon?: string;
}

export interface HomeWidgetRegistration {
  id: string;
  title: string;
  order: number;
  size: "sm" | "md" | "lg";
  component: ComponentType;
}

export interface ProviderRegistration {
  providerId: string;
  displayName: string;
  version?: string;
  menu: MenuNode[];
  homeWidgets: HomeWidgetRegistration[];
}

export type ProviderStatus = "idle" | "loading" | "loaded" | "error";

export interface ProviderStatusState {
  providerId: string;
  displayName: string;
  status: ProviderStatus;
  lastAttemptAt?: number;
  lastSuccessAt?: number;
  errorMessage?: string;
}

export type ProviderRegistrationFactory = () => Promise<ProviderRegistration>;

export function isMenuRouteNode(node: MenuNode): node is MenuRouteNode {
  return node.type === "route";
}

export function isMenuGroupNode(node: MenuNode): node is MenuGroupNode {
  return node.type === "group";
}

export function flattenMenuRoutes(nodes: MenuNode[]): MenuRouteNode[] {
  const routes: MenuRouteNode[] = [];
  for (const node of nodes) {
    if (node.type === "route") {
      routes.push(node);
      continue;
    }
    routes.push(...flattenMenuRoutes(node.children));
  }
  return routes;
}

export function sortMenuTree(nodes: MenuNode[]): MenuNode[] {
  const sorted = [...nodes].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  return sorted.map((node) => {
    if (node.type === "group") {
      return { ...node, children: sortMenuTree(node.children) };
    }
    return node;
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function isProviderRegistration(value: unknown): value is ProviderRegistration {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<ProviderRegistration>;
  if (typeof candidate.providerId !== "string") {
    return false;
  }
  if (typeof candidate.displayName !== "string") {
    return false;
  }
  if (!Array.isArray(candidate.menu) || !Array.isArray(candidate.homeWidgets)) {
    return false;
  }
  return true;
}
