# Self-Serve Status

## Current status

Agent Builder is self-serveable for:

- local developer use
- local container use
- Kubernetes pod deployment by an operator

Agent Builder is not yet fully public SaaS self-serve because these pieces are still required:

- public hosted URL
- ingress
- TLS
- authentication/onboarding flow
- published image verification after GHCR workflow run
- release tags

## Self-serve levels

| Level | Status | Meaning |
|---|---:|---|
| Local developer | Ready | User can run with npm |
| Local container | Ready | User can build and run a container |
| Kubernetes pod | Ready | Operator can apply manifests |
| Public URL | Not ready | Needs ingress/TLS/domain |
| SaaS onboarding | Not ready | Needs auth/account flow |

## Definition of done for full self-serve

Full self-serve means a new user can:

1. open a public URL
2. understand what Agent Builder does
3. try the A2UI preview without repo knowledge
4. deploy it with one command if they want self-hosting
5. verify the deployment
6. roll back safely
7. remove it cleanly

The repo now covers steps 4-7. The hosted product surface still needs to be connected.
