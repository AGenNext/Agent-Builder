# Agent Builder v0.1.0 Release Notes

## Release name

Agent Builder A2UI Preview

## Release type

Feature release.

## What is included

- A2UI core package
- A2UI React renderer
- Next.js demo surface
- Docker build path
- CI build checks
- GHCR publish workflow
- Kubernetes Deployment and Service
- Kubernetes Ingress template
- Pod Manager runbook
- Self-serve guide

## Release image

```text
ghcr.io/agennext/agent-builder:preview
```

After tagging `v0.1.0`, the container workflow should also publish semver tags.

## Local run

```bash
./scripts/self-serve.sh dev
```

## Docker run

```bash
./scripts/self-serve.sh docker
```

## Kubernetes run

```bash
./scripts/self-serve.sh k8s
./scripts/self-serve.sh verify
kubectl -n agennext port-forward svc/agent-builder 3000:3000
```

## Public route

Use `deploy/kubernetes/ingress.yaml` as a template.

Before public release, replace the placeholder host:

```text
agent-builder.agnext.local
```

with the real DNS name.

## Known pending items

- Confirm GHCR image publish run
- Create/push `v0.1.0` tag
- Configure real DNS
- Configure ingress controller
- Configure TLS issuer
- Add auth/onboarding for full SaaS self-serve

## Release status

Self-hosting release: ready after image publish verification.

Full SaaS release: pending hosted URL, TLS, auth, and onboarding.
