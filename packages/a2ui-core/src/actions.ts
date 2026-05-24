import type { A2UIAction, ActionType } from "./schema";

function createAction(
  type: ActionType,
  target?: string,
  payload: Record<string, unknown> = {}
): A2UIAction {
  return { type, target, payload };
}

export const Action = {
  submit: (target: string, payload?: Record<string, unknown>) =>
    createAction("submit", target, payload),

  navigate: (target: string, payload?: Record<string, unknown>) =>
    createAction("navigate", target, payload),

  approve: (target: string, payload?: Record<string, unknown>) =>
    createAction("approve", target, payload),

  reject: (target: string, payload?: Record<string, unknown>) =>
    createAction("reject", target, payload),

  refresh: (target?: string) => createAction("refresh", target)
};
