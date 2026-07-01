# Agent Builder Self-Serve Guide

Agent Builder can be used in three self-serve modes:

1. local developer mode
2. local container mode
3. Kubernetes pod mode

This guide is for a user who wants to run Agent Builder without understanding the internal repo structure.

## What you get

Agent Builder provides the A2UI preview surface:

```text
Agent intent -> A2UI JSON -> validation -> React renderer -> user-controlled UI action
```

## Prerequisites

Choose one path.

### Local developer mode

Required:

- Node.js 22+
- npm

### Container mode

Required:

- Docker-compatible container runtime

### Kubernetes mode

Required:

- Kubernetes cluster
- `kubectl`
- access to pull `ghcr.io/agennext/agent-builder:preview`

## Option 1: local developer mode

```bash
npm ci
npm run dev:next
```

Open:

```text
http://localhost:3000
```

## Option 2: local container mode

```bash
docker build -t agennext-agent-builder:local .
docker run --rm -p 3000:3000 agennext-agent-builder:local
```

Open:

```text
http://localhost:3000
```

## Option 3: Kubernetes pod mode

```bash
kubectl apply -k deploy/kubernetes
kubectl -n agennext rollout status deployment/agent-builder
kubectl -n agennext port-forward svc/agent-builder 3000:3000
```

Open:

```text
http://localhost:3000
```

## Verify

```bash
kubectl -n agennext get pods -l app.kubernetes.io/name=agent-builder
kubectl -n agennext get svc agent-builder
kubectl -n agennext logs deploy/agent-builder
```

## Update image

```bash
kubectl -n agennext set image deployment/agent-builder agent-builder=ghcr.io/agennext/agent-builder:<tag>
kubectl -n agennext rollout status deployment/agent-builder
```

## Rollback

```bash
kubectl -n agennext rollout undo deployment/agent-builder
kubectl -n agennext rollout status deployment/agent-builder
```

## Remove

```bash
kubectl delete -k deploy/kubernetes
```

## Self-serve readiness checklist

Agent Builder is self-serveable when:

- [x] local run command exists
- [x] container run command exists
- [x] Kubernetes install command exists
- [x] pod verification command exists
- [x] rollback command exists
- [x] remove command exists
- [x] release image path is documented
- [ ] public demo URL is available
- [ ] package/image publish status is verified after workflow run
- [ ] ingress/TLS route is configured for a real domain

## Current release status

Agent Builder is self-serveable for local, Docker, and Kubernetes operator usage.

It is not yet fully public SaaS self-serve until a hosted URL, ingress, TLS, and user onboarding flow are connected.
