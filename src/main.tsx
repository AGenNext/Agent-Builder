import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

type ScreenId =
  | 'signup'
  | 'profile'
  | 'model-router'
  | 'tools'
  | 'agent'
  | 'workflow'
  | 'team'
  | 'runs'
  | 'debug'
  | 'traces'
  | 'approvals';

const screens: Array<{ id: ScreenId; label: string }> = [
  { id: 'signup', label: '1. Sign Up' },
  { id: 'profile', label: '2. Profile Setup' },
  { id: 'model-router', label: '3. Model / Router Setup' },
  { id: 'tools', label: '4. Tools / MCP / Browser Setup' },
  { id: 'agent', label: '5. Create Coding Agent' },
  { id: 'workflow', label: '6. Workflow Creator' },
  { id: 'team', label: '7. Multi-Agent Team Flow' },
  { id: 'runs', label: '8. Runs & Logs' },
  { id: 'debug', label: '9. Debug Center' },
  { id: 'traces', label: '10. Trace Explorer' },
  { id: 'approvals', label: '11. Approval Queue' },
];

const roleOptions = ['Builder', 'Operator', 'Reviewer', 'Admin'];
const orgOptions = ['AGenNext', 'Platform', 'Research', 'Customer Success'];
const modelProviders = [
  'AGenNext Model Router',
  'OpenAI',
  'Anthropic',
  'Google',
  'Ollama local',
  'LM Studio local',
  'OpenAI-compatible local endpoint',
];
const routerPolicies = ['balanced', 'fastest', 'cheapest', 'safest'];
const environments = ['development', 'staging', 'production'];
const availableTools = ['GitHub', 'Browser', 'Filesystem', 'Terminal', 'MCP', 'Deployment'];
const workflowTriggers = ['manual trigger', 'schedule trigger', 'webhook trigger', 'event trigger', 'approval trigger'];
const teamRoles = ['planner', 'coder', 'reviewer', 'tester', 'deployer'];

function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [managerSource, setManagerSource] = useState<'HRMS' | 'manual'>('HRMS');
  const [manager, setManager] = useState('');
  const [role, setRole] = useState(roleOptions[0]);
  const [org, setOrg] = useState(orgOptions[0]);
  const [modelProvider, setModelProvider] = useState(modelProviders[0]);
  const [routerPolicy, setRouterPolicy] = useState(routerPolicies[0]);
  const [environment, setEnvironment] = useState(environments[0]);
  const [selectedTools, setSelectedTools] = useState<string[]>(['GitHub', 'Browser', 'Filesystem']);
  const [agentName, setAgentName] = useState('CodePilot');
  const [agentGoal, setAgentGoal] = useState('Build, test, and ship secure code fast.');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['manual trigger']);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['planner', 'coder', 'reviewer']);

  const spec = useMemo(
    () => ({
      kind: 'CodifiableAgentSpec',
      version: '0.1.0',
      identity: { name, email, managerSource, manager },
      profile: { role, org },
      runtime: { modelProvider, routerPolicy, environment },
      tools: {
        enabled: selectedTools,
        browserCapabilities: ['search', 'open', 'screenshot'],
        mcpEnabled: selectedTools.includes('MCP'),
      },
      agent: { name: agentName, goal: agentGoal, type: 'coding' },
      workflow: {
        triggers: selectedTriggers,
        approvalsRequiredFor: ['file.write', 'command.execute', 'pull_request.create', 'deployment.request'],
      },
      team: selectedRoles.map((teamRole, index) => ({ role: teamRole, order: index + 1 })),
      generatedAt: new Date().toISOString(),
    }),
    [
      name,
      email,
      managerSource,
      manager,
      role,
      org,
      modelProvider,
      routerPolicy,
      environment,
      selectedTools,
      agentName,
      agentGoal,
      selectedTriggers,
      selectedRoles,
    ],
  );

  const toggleSelection = (value: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState((current) => (current.includes(value) ? current.filter((v) => v !== value) : [...current, value]));
  };

  return (
    <div className="app-shell">
      <aside>
        <h1>AGenNext Agent Builder</h1>
        <p>Launchable platform shell (Vite + React)</p>
        <nav>
          {screens.map((screen) => (
            <button key={screen.id} className={activeScreen === screen.id ? 'active' : ''} onClick={() => setActiveScreen(screen.id)}>
              {screen.label}
            </button>
          ))}
        </nav>
      </aside>
      <main>
        {activeScreen === 'signup' && (
          <section>
            <h2>Sign Up</h2>
            <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></label>
            <label>Manager Source
              <select value={managerSource} onChange={(e) => setManagerSource(e.target.value as 'HRMS' | 'manual')}>
                <option>HRMS</option><option>manual</option>
              </select>
            </label>
            <label>{managerSource === 'HRMS' ? 'Manager (HRMS ID or name)' : 'Manager (manual)'}<input value={manager} onChange={(e) => setManager(e.target.value)} /></label>
          </section>
        )}
        {activeScreen === 'profile' && <section><h2>Profile Setup</h2><label>Role<select value={role} onChange={(e) => setRole(e.target.value)}>{roleOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Organization<select value={org} onChange={(e) => setOrg(e.target.value)}>{orgOptions.map((item) => <option key={item}>{item}</option>)}</select></label></section>}
        {activeScreen === 'model-router' && <section><h2>Model / Router Setup</h2><label>Model Provider<select value={modelProvider} onChange={(e) => setModelProvider(e.target.value)}>{modelProviders.map((item) => <option key={item}>{item}</option>)}</select></label><label>Router Policy<select value={routerPolicy} onChange={(e) => setRouterPolicy(e.target.value)}>{routerPolicies.map((item) => <option key={item}>{item}</option>)}</select></label><label>Environment<select value={environment} onChange={(e) => setEnvironment(e.target.value)}>{environments.map((item) => <option key={item}>{item}</option>)}</select></label></section>}
        {activeScreen === 'tools' && (
          <section>
            <h2>Tools / MCP / Browser Setup</h2>
            <div className="grid">{availableTools.map((tool) => <label key={tool}><input type="checkbox" checked={selectedTools.includes(tool)} onChange={() => toggleSelection(tool, selectedTools, setSelectedTools)} /> {tool}</label>)}</div>
            <p>Browser tool capabilities: <strong>search</strong>, <strong>open</strong>, <strong>screenshot</strong>.</p>
          </section>
        )}
        {activeScreen === 'agent' && <section><h2>Create Coding Agent</h2><label>Agent Name<input value={agentName} onChange={(e) => setAgentName(e.target.value)} /></label><label>Primary Goal<textarea value={agentGoal} onChange={(e) => setAgentGoal(e.target.value)} rows={4} /></label></section>}
        {activeScreen === 'workflow' && <section><h2>Workflow Creator</h2><div className="grid">{workflowTriggers.map((trigger) => <label key={trigger}><input type="checkbox" checked={selectedTriggers.includes(trigger)} onChange={() => toggleSelection(trigger, selectedTriggers, setSelectedTriggers)} /> {trigger}</label>)}</div></section>}
        {activeScreen === 'team' && <section><h2>Multi-Agent Team Flow</h2><div className="grid">{teamRoles.map((teamRole) => <label key={teamRole}><input type="checkbox" checked={selectedRoles.includes(teamRole)} onChange={() => toggleSelection(teamRole, selectedRoles, setSelectedRoles)} /> {teamRole}</label>)}</div></section>}
        {activeScreen === 'runs' && <section><h2>Runs & Logs</h2><p>Generated CodifiableAgentSpec:</p><pre>{JSON.stringify(spec, null, 2)}</pre></section>}
        {activeScreen === 'debug' && <section><h2>Debug Center</h2><ul><li>12:11:34Z — Router policy evaluated: balanced</li><li>12:12:01Z — Tool permission check passed for filesystem.read</li><li>12:12:44Z — Approval pending for deployment.request</li></ul></section>}
        {activeScreen === 'traces' && <section><h2>Trace Explorer</h2><table><thead><tr><th>Trace ID</th><th>Agent</th><th>Step</th><th>Status</th></tr></thead><tbody><tr><td>tr_1042</td><td>planner</td><td>Plan sprint tasks</td><td>success</td></tr><tr><td>tr_1043</td><td>coder</td><td>Implement UI shell</td><td>running</td></tr><tr><td>tr_1044</td><td>reviewer</td><td>Validate policy checks</td><td>queued</td></tr></tbody></table></section>}
        {activeScreen === 'approvals' && <section><h2>Approval Queue</h2><p>Manager routing: <strong>{manager || 'not set'}</strong> via <strong>{managerSource}</strong></p><ul><li>file.write</li><li>command.execute</li><li>pull_request.create</li><li>deployment.request</li></ul></section>}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
