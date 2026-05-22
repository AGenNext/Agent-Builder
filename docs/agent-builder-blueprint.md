# Agent Builder Blueprint

Search marker: `AGenNext Agent Builder Power Profile`

## Current scope

The initial Agent Builder release supports exactly one user-created agent at a time.

There are two agent concepts in the builder experience:

1. `Customer Onboarding Manager` — the helper agent that guides setup.
2. `Target Agent` — the single agent draft the user is creating.

```text
one signed-in user / tenant
→ one Customer Onboarding Manager session
→ one default Target Agent draft
→ one guided chat onboarding flow
→ one validated final Target Agent
```

## Three-repo boundary

### Agent-BE

Runtime, schema, and enforcement.

Owns:

- SurrealDB schema and functions
- runtime APIs
- validation gates
- guardrails
- governance and policy decisions
- RAG/retrieval execution
- tool authentication state
- tool execution enforcement
- workflow runs
- audit logs
- final `agent_id` assignment

### Agent-Builder

Single-agent builder workflow/control plane.

Owns:

- Customer Onboarding Manager chat experience
- default Target Agent draft loading UX
- minimum input collection
- skill/tool recommendation and confirmation
- environment/RAG setup UX
- Agent-BE API client and request orchestration
- validation/finalization status UX

### Agent-UI

Shared reusable UI layer.

Owns:

- shared app shell
- reusable chat primitives
- cards, badges, forms, tables, filters, modals
- stepper/checklist components
- reusable graph/status components
- design tokens and themes

## Agent roles

### Customer Onboarding Manager

The onboarding helper persona is `Customer Onboarding Manager`.

It behaves like a junior customer success manager:

- friendly
- simple
- guided
- minimal
- asks clear questions
- recommends only what is needed
- never behaves like a runtime/admin agent

It is not the user's final agent. It only helps create the Target Agent draft.

### Target Agent

The Target Agent is the single user-created agent.

It starts as a default draft after first sign-in and becomes a final runnable agent only after Agent-BE validation.

The Target Agent:

- has all default feature sections from the start
- cannot grant itself capabilities
- cannot assign itself skills/tools
- cannot authenticate tools
- cannot finalize itself
- cannot execute anything while it is still a draft

## Customer Onboarding Manager skill

The Customer Onboarding Manager has exactly one skill:

```text
agent_creator
```

## Customer Onboarding Manager allowed actions

The Customer Onboarding Manager may:

- chat with the user
- collect minimum Target Agent intent/description
- recommend minimum required skills for the Target Agent
- recommend minimum required tools/connectors for the Target Agent
- ask the user to confirm skills/tools
- guide knowledge/RAG setup
- guide environment setup
- call Agent-BE builder APIs for draft updates and validation status
- show finalization readiness returned by Agent-BE

## Customer Onboarding Manager not allowed

The Customer Onboarding Manager must not:

- execute tools
- access credentials
- access secrets
- override policy
- administer runtime
- perform payment or commerce execution
- self-modify
- assign final `agent_id`
- orchestrate multiple agents
- grant capabilities without user confirmation

## Target Agent default sections

The Target Agent draft should expose these sections immediately:

- intent / description
- knowledge / RAG
- environments
- skills
- tools / connectors
- tool authentication state
- artifacts
- A2A
- ACP
- APP
- governance
- OPA
- audit policy
- release readiness
- runtime enforcement status

Missing values are shown as `unconfigured`, not absent.

## Core rule

```text
Customer Onboarding Manager suggests.
User confirms.
Agent-BE validates.
Agent-BE finalizes the Target Agent.
```

## First sign-in behavior

On first sign-in, the builder must load or create exactly one default Target Agent draft through Agent-BE.

The Customer Onboarding Manager opens the chat and helps the user configure that draft.

## Chat interface sections

The chat interface should expose:

1. Describe Target Agent
2. Confirm recommended minimum skills
3. Confirm recommended minimum tools
4. Add knowledge/RAG
5. Choose environments
6. Connect required tools
7. Review validation status
8. Request finalization

## Production invariant

Agent-Builder and Agent-UI never create the final runnable `agent_id`.

Only Agent-BE can assign the final `agent_id`, and only after the single Target Agent draft validates against upstream schema, policy, auth, environment, artifact, and runtime enforcement requirements.
