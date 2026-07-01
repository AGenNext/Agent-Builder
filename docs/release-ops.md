# Agent Builder Release Operations

This runbook closes the operator steps after the repo is release-ready.

## Release target

```text
Agent Builder A2UI Preview v0.1.0
```

## Current release assets

- Dockerfile
- CI workflow
- GHCR container release workflow
- Kubernetes manifests
- Ingress template
- Pod Manager runbook
- Self-serve guide
- v0.1.0 release notes

## 1. Verify main

```bash
git checkout main
git pull --ff-only origin main
```

## 2. Create release tag

```bash
./scripts/release-v0.1.0.sh
```

This creates and pushes:

```text
v0.1.0
```

The tag should trigger the `Container Release` workflow.

## 3. Verify GHCR publish

In GitHub:

```text
Actions -> Container Release
```

Expected image:

```text
ghcr.io/agennext/agent-builder:preview
ghcr.io/agennext/agent-builder:0.1.0
ghcr.io/agennext/agent-builder:0.1
ghcr.io/agennext/agent-builder:sha-<commit>
```

## 4. Deploy to Kubernetes

Pod-only deployment:

```bash
./scripts/deploy-kubernetes.sh
```

With public hostname override:

```bash
HOST=agent-builder.<your-domain> ./scripts/deploy-kubernetes.sh
```

## 5. Verify deployment

```bash
kubectl -n agennext rollout status deployment/agent-builder
kubectl -n agennext get pods -l app.kubernetes.io/name=agent-builder
kubectl -n agennext get svc agent-builder
kubectl -n agennext get ingress agent-builder
```

## 6. Local access

```bash
kubectl -n agennext port-forward svc/agent-builder 3000:3000
```

Open:

```text
http://localhost:3000
```

## 7. Public access

Public access requires:

- DNS record points to ingress controller
- ingress controller is installed
- cert-manager is installed if using TLS automation
- `letsencrypt-prod` ClusterIssuer exists if using the default annotation
- ingress host has been changed from the placeholder to the real domain

## 8. Rollback

```bash
kubectl -n agennext rollout undo deployment/agent-builder
kubectl -n agennext rollout status deployment/agent-builder
```

## 9. Remove

```bash
kubectl delete -k deploy/kubernetes
```

## Honest release status

Self-hosted release is ready once:

- tag is pushed
- GHCR image publish is green
- Kubernetes deploy succeeds

Full SaaS release still requires:

- public hosted product URL
- auth/onboarding
- tenant/workspace model
- observability
- support/runbook ownership
