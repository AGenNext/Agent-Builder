import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Screen =
  | "signup"
  | "profile"
  | "model"
  | "tools"
  | "agent"
  | "workflow"
  | "team"
  | "runs"
  | "debug"
  | "traces"
  | "approvals"
  | "spec";

type CodingStyle = "fast" | "balanced" | "safe";
type Environment = "development" | "staging" | "production";
type ProviderMode =
  | "agennext-router"
  | "openai"
  | "anthropic"
  | "google"
  | "ollama"
  | "lm-studio"
  | "openai-compatible"
  | "custom";
type RouterPolicy = "balanced" | "fastest" | "cheapest" | "safest";
type ManagerSource = "hrms" | "manual";
type WorkflowTrigger = "manual" | "schedule" | "webhook" | "event" | "approval";
type ApprovalRoute = "manager" | "security" | "platform-admin";
type Capability =
  | "repo_inspection"
  | "patch_generation"
  | "test_execution"
  | "pr_creation"
  | "documentation_lookup"
  | "browser_research";

type ToolConfig = Record<"github" | "browser" | "filesystem" | "terminal" | "mcp" | "deployment", boolean>;
type WorkflowStep = { id: string; text: string };
type MCPServer = { id: string; name: string; endpoint: string; permissions: string; enabled: boolean };
type TeamAgent = { role: "planner" | "coder" | "reviewer" | "tester" | "deployer"; enabled: boolean };

type AppState = {
  user: { name: string; email: string; password: string; managerName: string; managerEmail: string; managerSource: ManagerSource; department: string };
  profile: { role: string; organization: string; codingStyle: CodingStyle; environment: Environment };
  model: { providerMode: ProviderMode; preferredModel: string; routerPolicy: RouterPolicy; modelRouterUrl: string; localBaseUrl: string; apiKeySecretRef: string };
  tools: ToolConfig;
  browserTool: { search: boolean; openPage: boolean; screenshot: boolean; formAutomation: boolean; risk: "medium" };
  mcp: { servers: MCPServer[] };
  agent: { name: string; description: string; repository: string; defaultBranch: string; capabilities: Record<Capability, boolean> };
  workflow: { name: string; trigger: WorkflowTrigger; approvalRoute: ApprovalRoute; steps: WorkflowStep[] };
  team: { agents: TeamAgent[]; handoffs: string[] };
  approval: { triggers: Array<"file.write" | "command.execute" | "dependency.install" | "branch.push" | "pull_request.create" | "deployment.request"> };
};

const screens: { key: Screen; label: string }[] = [
  { key: "signup", label: "Sign Up" },{ key: "profile", label: "Profile Setup" },{ key: "model", label: "Model / Router" },{ key: "tools", label: "Tools / MCP / Browser" },{ key: "agent", label: "Create Coding Agent" },{ key: "workflow", label: "Workflow Creator" },{ key: "team", label: "Multi-Agent Team" },{ key: "runs", label: "Runs & Logs" },{ key: "debug", label: "Debug Center" },{ key: "traces", label: "Trace Explorer" },{ key: "approvals", label: "Approval Queue" },{ key: "spec", label: "Generated Spec" }
];

const defaultState: AppState = { user: { name: "", email: "", password: "", managerName: "", managerEmail: "", managerSource: "hrms", department: "" }, profile: { role: "", organization: "AGenNext", codingStyle: "balanced", environment: "development" }, model: { providerMode: "agennext-router", preferredModel: "agennext-router:auto", routerPolicy: "balanced", modelRouterUrl: "http://localhost:8080", localBaseUrl: "http://localhost:11434", apiKeySecretRef: "secret://models/default" }, tools: { github: true, browser: true, filesystem: true, terminal: true, mcp: true, deployment: true }, browserTool: { search: true, openPage: true, screenshot: true, formAutomation: true, risk: "medium" }, mcp: { servers: [{ id: "mcp-1", name: "GitHub MCP", endpoint: "http://localhost:3001/mcp", permissions: "repo:read,repo:write", enabled: true }] }, agent: { name: "Builder-Coder", description: "Creates patches and proposes pull requests.", repository: "AGenNext/Agent-Builder", defaultBranch: "main", capabilities: { repo_inspection: true, patch_generation: true, test_execution: true, pr_creation: true, documentation_lookup: true, browser_research: true } }, workflow: { name: "Default Agent Build Flow", trigger: "manual", approvalRoute: "manager", steps: ["Inspect repository", "Build plan", "Propose patch", "Request approval if needed", "Run checks", "Create pull request"].map((text, i) => ({ id: `s-${i + 1}`, text })) }, team: { agents: ["planner", "coder", "reviewer", "tester", "deployer"].map((role) => ({ role: role as TeamAgent["role"], enabled: true })), handoffs: ["Planner", "Coder", "Reviewer", "Tester", "Deployer"] }, approval: { triggers: ["file.write", "command.execute", "dependency.install", "branch.push", "pull_request.create", "deployment.request"] } };

function App() {
  const [screen, setScreen] = useState<Screen>("signup");
  const [state, setState] = useState<AppState>(defaultState);
  const [newStep, setNewStep] = useState("");

  const generatedSpec = useMemo(() => ({ kind: "coding-agent", version: "0.1.0", identity: { ...state.user, password: undefined }, profile: state.profile, model: state.model, tools: state.tools, browserTool: state.browserTool, mcp: state.mcp, agent: state.agent, workflow: state.workflow, team: state.team, approval: state.approval, runtimeHandoff: { target: "AGenNext Runtime", status: "ready_for_backend" } }), [state]);

  const updateSection = <K extends keyof AppState>(section: K, patch: Partial<AppState[K]>) => setState((current) => ({ ...current, [section]: { ...current[section], ...patch } }));

  const addMcpServer = () => updateSection("mcp", { servers: [...state.mcp.servers, { id: `mcp-${Date.now()}`, name: "", endpoint: "", permissions: "", enabled: true }] });
  const nextScreen = () => setScreen(screens[Math.min(screens.findIndex((s) => s.key === screen) + 1, screens.length - 1)].key);

  return <div className="app"><aside className="sidebar"><h1>AGenNext Builder</h1>{screens.map((s) => <button key={s.key} className={screen === s.key ? "active" : ""} onClick={() => setScreen(s.key)}>{s.label}</button>)}</aside><main className="main"><h2>{screens.find((s) => s.key === screen)?.label}</h2>{screen === "signup" && <section className="card grid2"><input placeholder="Full name" value={state.user.name} onChange={(e) => updateSection("user", { name: e.target.value })} /><input placeholder="Email" value={state.user.email} onChange={(e) => updateSection("user", { email: e.target.value })} /><input placeholder="Manager name" value={state.user.managerName} onChange={(e) => updateSection("user", { managerName: e.target.value })} /><input placeholder="Manager email" value={state.user.managerEmail} onChange={(e) => updateSection("user", { managerEmail: e.target.value })} /><select value={state.user.managerSource} onChange={(e) => updateSection("user", { managerSource: e.target.value as ManagerSource })}><option value="hrms">Resolve from HRMS</option><option value="manual">Enter manually</option></select><input placeholder="Department" value={state.user.department} onChange={(e) => updateSection("user", { department: e.target.value })} /><p className="hint">If HRMS is connected, manager/approver can be resolved automatically. Manual fallback is supported.</p></section>}
{screen === "profile" && <section className="card grid2"><input placeholder="Role" value={state.profile.role} onChange={(e) => updateSection("profile", { role: e.target.value })} /><input placeholder="Organization" value={state.profile.organization} onChange={(e) => updateSection("profile", { organization: e.target.value })} /><select value={state.profile.codingStyle} onChange={(e) => updateSection("profile", { codingStyle: e.target.value as CodingStyle })}><option value="fast">fast</option><option value="balanced">balanced</option><option value="safe">safe</option></select><select value={state.profile.environment} onChange={(e) => updateSection("profile", { environment: e.target.value as Environment })}><option value="development">development</option><option value="staging">staging</option><option value="production">production</option></select></section>}
{screen === "model" && <section className="card grid2"><select value={state.model.providerMode} onChange={(e) => updateSection("model", { providerMode: e.target.value as ProviderMode })}>{["agennext-router","openai","anthropic","google","ollama","lm-studio","openai-compatible","custom"].map((p)=><option key={p} value={p}>{p}</option>)}</select><input placeholder="Preferred model" value={state.model.preferredModel} onChange={(e) => updateSection("model", { preferredModel: e.target.value })} /><select value={state.model.routerPolicy} onChange={(e) => updateSection("model", { routerPolicy: e.target.value as RouterPolicy })}><option value="balanced">balanced</option><option value="fastest">fastest</option><option value="cheapest">cheapest</option><option value="safest">safest</option></select><input placeholder="Model router URL" value={state.model.modelRouterUrl} onChange={(e) => updateSection("model", { modelRouterUrl: e.target.value })} /><input placeholder="Local base URL" value={state.model.localBaseUrl} onChange={(e) => updateSection("model", { localBaseUrl: e.target.value })} /><input placeholder="API key secret ref" value={state.model.apiKeySecretRef} onChange={(e) => updateSection("model", { apiKeySecretRef: e.target.value })} /><p className="hint">AGenNext Model Router can choose model by cost, latency, quality, policy, and task type. Local LLMs supported through Ollama, LM Studio, or OpenAI-compatible endpoints.</p></section>}
{screen === "tools" && <section className="card"><div className="grid3">{Object.keys(state.tools).map((k)=><label key={k} className="check"><input type="checkbox" checked={state.tools[k as keyof ToolConfig]} onChange={(e)=>updateSection("tools", { [k]: e.target.checked } as Partial<ToolConfig>)} /> {k}</label>)}</div><h4>Browser permissions</h4><div className="grid2">{Object.keys(state.browserTool).filter(k=>k!=="risk").map((k)=><label key={k} className="check"><input type="checkbox" checked={state.browserTool[k as keyof Omit<AppState["browserTool"],"risk">]} onChange={(e)=>updateSection("browserTool", { [k]: e.target.checked })} /> {k}</label>)}</div><h4>MCP servers</h4>{state.mcp.servers.map((s,idx)=><div className="grid4" key={s.id}><input placeholder="name" value={s.name} onChange={(e)=>{const servers=[...state.mcp.servers];servers[idx]={...s,name:e.target.value};updateSection("mcp",{servers});}}/><input placeholder="endpoint" value={s.endpoint} onChange={(e)=>{const servers=[...state.mcp.servers];servers[idx]={...s,endpoint:e.target.value};updateSection("mcp",{servers});}}/><input placeholder="permissions" value={s.permissions} onChange={(e)=>{const servers=[...state.mcp.servers];servers[idx]={...s,permissions:e.target.value};updateSection("mcp",{servers});}}/><label className="check"><input type="checkbox" checked={s.enabled} onChange={(e)=>{const servers=[...state.mcp.servers];servers[idx]={...s,enabled:e.target.checked};updateSection("mcp",{servers});}}/> enabled</label></div>)}<button onClick={addMcpServer}>Add MCP Server</button></section>}
{screen === "agent" && <section className="card grid2"><input placeholder="Agent name" value={state.agent.name} onChange={(e)=>updateSection("agent",{name:e.target.value})}/><input placeholder="Description" value={state.agent.description} onChange={(e)=>updateSection("agent",{description:e.target.value})}/><input placeholder="Repository" value={state.agent.repository} onChange={(e)=>updateSection("agent",{repository:e.target.value})}/><input placeholder="Default branch" value={state.agent.defaultBranch} onChange={(e)=>updateSection("agent",{defaultBranch:e.target.value})}/><div className="span2 grid3">{Object.keys(state.agent.capabilities).map((cap)=><label key={cap} className="check"><input type="checkbox" checked={state.agent.capabilities[cap as Capability]} onChange={(e)=>updateSection("agent",{capabilities:{...state.agent.capabilities,[cap]:e.target.checked}})}/>{cap}</label>)}</div></section>}
{screen === "workflow" && <section className="card"><div className="grid3"><input placeholder="Workflow name" value={state.workflow.name} onChange={(e)=>updateSection("workflow",{name:e.target.value})}/><select value={state.workflow.trigger} onChange={(e)=>updateSection("workflow",{trigger:e.target.value as WorkflowTrigger})}>{["manual","schedule","webhook","event","approval"].map((v)=><option key={v} value={v}>{v}</option>)}</select><select value={state.workflow.approvalRoute} onChange={(e)=>updateSection("workflow",{approvalRoute:e.target.value as ApprovalRoute})}>{["manager","security","platform-admin"].map((v)=><option key={v} value={v}>{v}</option>)}</select></div><ul>{state.workflow.steps.map((step)=><li key={step.id}>{step.text}</li>)}</ul><div className="inline"><input placeholder="Add step" value={newStep} onChange={(e)=>setNewStep(e.target.value)}/><button onClick={()=>{if(!newStep.trim())return;updateSection("workflow",{steps:[...state.workflow.steps,{id:`s-${Date.now()}`,text:newStep}]});setNewStep("");}}>Add</button></div></section>}
{screen === "team" && <section className="card"><div className="grid3">{state.team.agents.map((a,idx)=><label key={a.role} className="check"><input type="checkbox" checked={a.enabled} onChange={(e)=>{const agents=[...state.team.agents];agents[idx]={...a,enabled:e.target.checked};updateSection("team",{agents});}}/> {a.role}</label>)}</div><p>Planner → Coder → Reviewer → Tester → Deployer</p></section>}
{screen === "runs" && <section className="card"><table><tbody>{[["run_001","success","created spec"],["run_002","success","approval route checked"],["run_003","running","workflow validation"],["run_004","pending","runtime handoff pending"]].map((r)=><tr key={r[0]}><td>{r[0]}</td><td><span className={`badge ${r[1]}`}>{r[1]}</span></td><td>{new Date().toISOString()}</td><td>{r[2]}</td></tr>)}</tbody></table></section>}
{screen === "debug" && <section className="card"><ul><li>Missing manager email</li><li>Missing repository</li><li>Terminal tool requires approval</li><li>Deployment tool requires approval</li><li>Model router reachable: not checked</li></ul></section>}
{screen === "traces" && <section className="card"><ul>{["signup.created","profile.saved","model.configured","tools.selected","manager.resolved","agent.created","workflow.created","spec.generated"].map((event)=><li key={event}>{new Date().toISOString()} · ui · {event} · mock event generated</li>)}</ul></section>}
{screen === "approvals" && <section className="card"><p>Manager: {state.user.managerName || "(not set)"} ({state.user.managerEmail || "(not set)"})</p><p>Source: {state.user.managerSource}</p><ul>{state.approval.triggers.map((t)=><li key={t}>{t}</li>)}</ul><ul><li>Approve filesystem write</li><li>Approve terminal command</li><li>Approve PR creation</li><li>Approve deployment request</li></ul></section>}
{screen === "spec" && <section className="card"><h3>CodifiableAgentSpec</h3><button onClick={async ()=>{if(navigator.clipboard){await navigator.clipboard.writeText(JSON.stringify(generatedSpec,null,2));}}}>Copy JSON</button><pre>{JSON.stringify(generatedSpec, null, 2)}</pre></section>}
<button className="cta" onClick={nextScreen}>Continue</button></main></div>;
}

createRoot(document.getElementById("root") as HTMLElement).render(<React.StrictMode><App /></React.StrictMode>);
