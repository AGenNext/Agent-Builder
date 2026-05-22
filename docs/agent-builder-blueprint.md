# Agent Builder Blueprint

Search marker: `AGenNext Agent Builder Power Profile`

## Current scope

The initial Agent Builder release supports exactly one agent at a time.

```text
one signed-in user / tenant
→ one default agent draft
→ one guided chat onboarding flow
→ one validated final agent
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
- default agent draft loading UX
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

## Customer Onboarding Manager

The onboarding agent persona is `Customer Onboarding Manager`.

It behaves like a junior customer success manager:

- friendly
- simple
- guided
- minimal
- asks clear questions
- recommends only what is needed
- never behaves like a runtime/admin agent

## Allowed skill

The Customer Onboarding Manager has exactly one skill:

```text
agent_creator
```

## Allowed actions

The Customer Onboarding Manager may:

- chat with the user
- collect minimum agent intent/description
- recommend minimum required skills
- recommend minimum required tools/connectors
- ask the user to confirm skills/tools
- guide knowledge/RAG setup
- guide environment setup
- call Agent-BE builder APIs for draft updates and validation status
- show finalization readiness returned by Agent-BE

## Not allowed

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

## Core rule

```text
Customer Onboarding Manager suggests.
User confirms.
Agent-BE validates.
Agent-BE finalizes.
```

## First sign-in behavior

On first sign-in, the builder must load or create exactly one default agent draft through Agent-BE.

The draft should already expose all default sections as configurable states:

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

## Chat interface sections

The chat interface should expose:

1. Describe agent
2. Confirm recommended minimum skills
3. Confirm recommended minimum tools
4. Add knowledge/RAG
5. Choose environments
6. Connect required tools
7. Review validation status
8. Request finalization

## Production invariant

Agent-Builder and Agent-UI never create the final runnable `agent_id`.

Only Agent-BE can assign the final `agent_id`, and only after the single-agent draft validates against upstream schema, policy, auth, environment, artifact, and runtime enforcement requirements.
