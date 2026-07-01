# Agent Builder

Agent Builder is the first production feature candidate for AGenNext.

It provides an A2UI TypeScript SDK and a Next.js demo app for safely rendering declarative agent-authored interfaces.

## Product responsibility

Agent Builder owns the agent-to-interface authoring surface.

It lets an agent describe a UI as a safe declarative payload. The client application decides how that payload renders into trusted native components.

```text
Agent intent
  -> A2UI JSON
  -> validation
  -> React renderer
  -> user-approved UI action
```

## Structure

```text
apps/
  next-demo/        Next.js demo app for rendering A2UI payloads

packages/
  a2ui-core/        A2UI schemas, builders, actions, and validation
  a2ui-react/       React renderer for A2UI payloads
```

## Run locally

```bash
npm ci
npm run dev:next
```

## Build

```bash
npm ci
npm run build
npm run build:next
```

## Container build

```bash
docker build -t agennext-agent-builder:local .
docker run --rm -p 3000:3000 agennext-agent-builder:local
```

Then open `http://localhost:3000`.

## A2UI concept

A2UI lets an agent describe what interface should exist using a safe declarative payload. The client application decides how that payload renders into native UI components.

```text
Agent -> A2UI JSON -> React Renderer -> UI
```

## Example

```tsx
import { Action, a2ui } from "./packages/a2ui-core/src";
import { A2UIRenderer } from "./packages/a2ui-react/src";

const surface = a2ui.surface({
  id: "reservation-flow",
  components: [
    a2ui.heading("Book a Table"),
    a2ui.form({
      title: "Reservation Details",
      submit: Action.submit("reservation.create"),
      children: [a2ui.input("Name", "/reservation/name")]
    })
  ]
});

const payload = a2ui.response({ surface });

export function Demo() {
  return <A2UIRenderer payload={payload} />;
}
```

## Packages

### `@agennext/a2ui-core`

Provides:

- schema types
- Zod validation
- action helpers
- declarative builders

### `@agennext/a2ui-react`

Provides:

- `A2UIRenderer`
- default component registry
- local state bindings
- action dispatch hooks
- custom renderer registry support

## Release readiness

This repo is releaseable when the following pass on every pull request:

- dependency install with `npm ci`
- TypeScript/Vite build with `npm run build`
- Next.js demo build with `npm run build:next`
- Docker image build with `docker build .`

## Release target

The first release target is a containerized Next.js demo of Agent Builder + A2UI. This is the first AGenNext product feature that can be shipped independently and then composed into Agent Platform.
