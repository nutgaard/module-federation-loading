import type { MenuNode, ProviderRegistration } from "@mf-demo/contracts";
import { isProviderRegistration } from "@mf-demo/contracts";

export function validateProviderRegistration(
  raw: unknown,
  expectedProviderId: string
): ProviderRegistration {
  if (!isProviderRegistration(raw)) {
    throw new Error("Invalid provider registration shape");
  }
  if (raw.providerId !== expectedProviderId) {
    throw new Error(
      `Provider registration id mismatch (expected ${expectedProviderId}, got ${raw.providerId})`
    );
  }
  validateMenuTree(raw.menu, expectedProviderId);
  for (const widget of raw.homeWidgets) {
    if (typeof widget.id !== "string" || typeof widget.title !== "string") {
      throw new Error("Invalid home widget shape");
    }
    if (typeof widget.component !== "function") {
      throw new Error(`Widget ${widget.id} is missing a React component`);
    }
  }
  return raw;
}

function validateMenuTree(nodes: MenuNode[], providerId: string): void {
  for (const node of nodes) {
    if (typeof node.id !== "string" || typeof node.label !== "string") {
      throw new Error(`Invalid menu node in provider ${providerId}`);
    }
    if (node.type === "route") {
      if (typeof node.path !== "string" || !node.path.startsWith(`/${providerId}`)) {
        throw new Error(`Route ${node.id} must be namespaced under /${providerId}`);
      }
      if (typeof node.component !== "function") {
        throw new Error(`Route ${node.id} is missing a React component`);
      }
      continue;
    }
    if (!Array.isArray(node.children)) {
      throw new Error(`Group ${node.id} must include children`);
    }
    validateMenuTree(node.children, providerId);
  }
}
