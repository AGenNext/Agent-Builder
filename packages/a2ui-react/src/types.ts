import type { A2UIAction, ComponentType } from "../../a2ui-core/src";
import type { ComponentType as ReactComponentType, ReactNode } from "react";

export type A2UIRendererState = Record<string, unknown>;

export type A2UIComponentRendererProps = {
  id: string;
  props: Record<string, unknown>;
  value?: unknown;
  setValue?: (value: unknown) => void;
  action?: A2UIAction;
  onAction?: (action: A2UIAction, state: A2UIRendererState) => void;
  children?: ReactNode;
};

export type ComponentRegistry = Partial<
  Record<ComponentType, ReactComponentType<A2UIComponentRendererProps>>
>;
