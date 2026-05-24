import {
  validateResponse,
  type A2UIAction,
  type A2UIComponent,
  type A2UIResponse
} from "../../a2ui-core/src";
import { useMemo, useState } from "react";
import { defaultRegistry } from "./defaultRegistry";
import type { A2UIRendererState, ComponentRegistry } from "./types";

type Props = {
  payload: A2UIResponse;
  registry?: ComponentRegistry;
  initialState?: A2UIRendererState;
  onAction?: (action: A2UIAction, state: A2UIRendererState) => void;
};

function getPathValue(state: A2UIRendererState, path?: string): unknown {
  if (!path) return undefined;

  const parts = path.split("/").filter(Boolean);
  let current: unknown = state;

  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function setPathValue(
  state: A2UIRendererState,
  path: string,
  value: unknown
): A2UIRendererState {
  const parts = path.split("/").filter(Boolean);
  const next = structuredClone(state);

  let current: Record<string, unknown> = next;

  for (const part of parts.slice(0, -1)) {
    if (!current[part] || typeof current[part] !== "object") {
      current[part] = {};
    }

    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;

  return next;
}

export function A2UIRenderer({
  payload,
  registry,
  initialState = {},
  onAction
}: Props) {
  const validated = useMemo(() => validateResponse(payload), [payload]);

  const mergedRegistry = useMemo(
    () => ({
      ...defaultRegistry,
      ...registry
    }),
    [registry]
  );

  const [state, setState] = useState<A2UIRendererState>(initialState);

  function renderComponent(component: A2UIComponent): React.ReactNode {
    const Renderer = mergedRegistry[component.type];

    if (!Renderer) {
      return <div key={component.id}>Unsupported component</div>;
    }

    const value = getPathValue(state, component.bind);

    const setValue = component.bind
      ? (nextValue: unknown) => {
          setState((previous) =>
            setPathValue(previous, component.bind as string, nextValue)
          );
        }
      : undefined;

    return (
      <Renderer
        key={component.id}
        id={component.id}
        props={component.props ?? {}}
        value={value}
        setValue={setValue}
        action={component.action}
        onAction={(action) => onAction?.(action, state)}
      >
        {component.children?.map((child) => renderComponent(child))}
      </Renderer>
    );
  }

  return (
    <div>
      {validated.message ? <p>{validated.message}</p> : null}
      {validated.ui.surface.components.map((component) =>
        renderComponent(component)
      )}
    </div>
  );
}
