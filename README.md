# Agent Builder

Agent Builder now includes an A2UI TypeScript SDK and a Next.js demo app.

## Structure

```text
apps/
  next-demo/        Next.js demo app for rendering A2UI payloads

packages/
  a2ui-core/        A2UI schemas, builders, actions, and validation
  a2ui-react/       React renderer for A2UI payloads
```

## Run the Next.js demo

```bash
npm install
npm run dev:next
```

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

### `@a2ui/core`

Provides:

- schema types
- Zod validation
- action helpers
- declarative builders

### `@a2ui/react`

Provides:

- `A2UIRenderer`
- default component registry
- local state bindings
- action dispatch hooks
- custom renderer registry support
