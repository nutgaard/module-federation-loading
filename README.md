# Module Federation Loading Demo

Microfrontend demo using the official Module Federation ecosystem (`@module-federation/vite` + retry plugin) with:

- `React`
- `CSS Modules`
- `Vite`
- `Bun workspaces`

The shell app:

- starts immediately even if all providers are offline
- shows a startup loading bar while provider modules are attempted
- displays browser toasts on provider load failures
- keeps retrying failed providers in the background
- dynamically adds provider menu trees, routes, and overview widgets when they recover

## Apps

- `apps/shell` (`http://localhost:5173`)
- `apps/provider-analytics` (`http://localhost:4171`)
- `apps/provider-commerce` (`http://localhost:4172`)
- `apps/provider-settings` (`http://localhost:4173`)

## Workspace Packages

- `packages/mf-contracts` shared TypeScript integration contract (`ProviderRegistration`, menu tree types, widget types)

## Quick Start (Bun)

```bash
bun install
bun run dev
```

Open `http://localhost:5173`.

## Demo Scenarios

### All providers online

1. Run `bun run dev`
2. Open the shell
3. Watch the loading bar complete as providers register
4. Confirm provider menu trees appear in the sidebar
5. Open provider routes and check overview widgets

### Provider offline at startup

1. Start only the shell:
```bash
bun run dev:shell
```
2. Open the shell (`http://localhost:5173`)
3. Confirm it starts and shows error toasts / missing menus
4. Start a provider later, for example:
```bash
bun run --cwd apps/provider-analytics dev
```
5. Wait for the shell background retry loop (10s) to recover it
6. Confirm a recovery toast appears and menu/routes/widgets are added live

### Simulated provider delay

Run a provider with delay:

```bash
cd apps/provider-commerce
VITE_PROVIDER_DELAY_MS=4000 bun run dev
```

The shell loading bar should visibly progress while faster providers finish first.

### Simulated provider registration failure (server online, registration throws)

```bash
cd apps/provider-settings
VITE_PROVIDER_FAIL_MODE=registration bun run dev
```

The shell should treat it as a provider error, keep running, and continue retrying.

## Scripts

Root:

- `bun run dev` start shell + all providers
- `bun run dev:shell` start shell only
- `bun run dev:providers` start all providers
- `bun run build` build shell + providers
- `bun run test` run shell unit tests

Per app:

- `bun run --cwd apps/shell dev`
- `bun run --cwd apps/provider-analytics dev`
- `bun run --cwd apps/provider-commerce dev`
- `bun run --cwd apps/provider-settings dev`

## Notes

- Shell retries failed providers in the background every `10s` (`apps/shell/src/mf/ProviderRegistryProvider.tsx`).
- Runtime request retries are also enabled via the official retry plugin (`apps/shell/src/mf/retryRuntimePlugin.ts`).
- Provider menu entries must use namespaced paths (`/analytics/...`, `/commerce/...`, `/settings/...`) and are validated by the shell before registration.

## Validation (done)

- `bun run --cwd apps/shell test`
- `bun run --cwd apps/shell build`
- `bun run --cwd apps/provider-analytics build`
- `bun run --cwd apps/provider-commerce build`
- `bun run --cwd apps/provider-settings build`
- `bunx tsc -p packages/mf-contracts/tsconfig.json --noEmit`
- `bunx tsc -p apps/shell/tsconfig.json --noEmit`
- `bunx tsc -p apps/provider-analytics/tsconfig.json --noEmit`
- `bunx tsc -p apps/provider-commerce/tsconfig.json --noEmit`
- `bunx tsc -p apps/provider-settings/tsconfig.json --noEmit`
