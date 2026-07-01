# Agent Builder Pod Manager Runbook

Agent Builder is released as a Kubernetes-managed pod for the A2UI preview surface.

## Scope

This runbook manages the `agent-builder` Kubernetes workload.

It covers:

- image publish
- apply
- verify
- logs
- restart
- port-forward
- rollback
- delete

## Image

Default image:

```text
ghcr.io/agennext/agent-builder:preview
```

The container release workflow publishes this image to GHCR from `main` and from semver tags.

Published tags include:

- `preview`
- `main`
- `sha-<commit>`
- `<version>` for semver tags such as `v0.1.0`
- `<major>.<minor>` for semver tags such as `v0.1.0`

Build locally before publishing:

```bash
docker build -t ghcr.io/agennext/agent-builder:preview .
```

For a local cluster that can see local images, retag or preload the image according to the cluster runtime.

## Publish image

After changes merge to `main`, GitHub Actions publishes the container image automatically.

Manual publish can be triggered from:

```text
Actions -> Container Release -> Run workflow
```

## Apply

```bash
kubectl apply -k deploy/kubernetes
```

## Verify rollout

```bash
kubectl -n agennext rollout status deployment/agent-builder
kubectl -n agennext get deploy agent-builder
kubectl -n agennext get pods -l app.kubernetes.io/name=agent-builder
kubectl -n agennext get svc agent-builder
```

## Open locally

```bash
kubectl -n agennext port-forward svc/agent-builder 3000:3000
```

Then open:

```text
http://localhost:3000
```

## Logs

```bash
kubectl -n agennext logs deploy/agent-builder
```

Follow logs:

```bash
kubectl -n agennext logs -f deploy/agent-builder
```

## Restart

```bash
kubectl -n agennext rollout restart deployment/agent-builder
kubectl -n agennext rollout status deployment/agent-builder
```

## Rollback

Check rollout history:

```bash
kubectl -n agennext rollout history deployment/agent-builder
```

Rollback to the previous revision:

```bash
kubectl -n agennext rollout undo deployment/agent-builder
kubectl -n agennext rollout status deployment/agent-builder
```

Rollback to a specific revision:

```bash
kubectl -n agennext rollout undo deployment/agent-builder --to-revision=<revision>
```

## Change image

```bash
kubectl -n agennext set image deployment/agent-builder agent-builder=ghcr.io/agennext/agent-builder:<tag>
kubectl -n agennext rollout status deployment/agent-builder
```

## Delete release

```bash
kubectl delete -k deploy/kubernetes
```

## Pod Manager checks

A release is healthy when:

- deployment is available
- pod is running
- service exists
- readiness probe passes
- `kubectl port-forward` reaches the Next.js app

## Production notes

This Kubernetes release is a feature release for Agent Builder, not the full AGenNext platform release.

Agent Builder can be promoted into Agent Platform after:

- image publishing is automated
- ingress is attached
- TLS is configured
- release tags are immutable
- runtime observability is connected
