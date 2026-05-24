import {
  A2UIResponseSchema,
  A2UISurfaceSchema,
  type A2UIComponent,
  type A2UIResponse,
  type A2UISurface
} from "./schema";

export class A2UIValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "A2UIValidationError";
  }
}

function collectIds(component: A2UIComponent, ids: Set<string>): void {
  if (ids.has(component.id)) {
    throw new A2UIValidationError(`Duplicate component id: ${component.id}`);
  }

  ids.add(component.id);

  for (const child of component.children ?? []) {
    collectIds(child, ids);
  }
}

export function validateSurface(surface: A2UISurface): A2UISurface {
  const parsed = A2UISurfaceSchema.parse(surface);
  const ids = new Set<string>();

  for (const component of parsed.components) {
    collectIds(component, ids);
  }

  return parsed;
}

export function validateResponse(response: A2UIResponse): A2UIResponse {
  const parsed = A2UIResponseSchema.parse(response);
  validateSurface(parsed.ui.surface);
  return parsed;
}
