export const operatorScreens = [
  { id: 'agents', title: 'Agents', route: '/agents' },
  { id: 'agent-create', title: 'Create Agent', route: '/agents/new' },
  { id: 'workflows', title: 'Workflows', route: '/workflows' },
  { id: 'workflow-create', title: 'Workflow Creator', route: '/workflows/new' },
  { id: 'runs', title: 'Runs', route: '/runs' },
  { id: 'debug', title: 'Debug Center', route: '/debug' },
  { id: 'traces', title: 'Trace Explorer', route: '/traces' },
  { id: 'approvals', title: 'Approvals', route: '/approvals' }
] as const;

export type OperatorScreenId = typeof operatorScreens[number]['id'];
