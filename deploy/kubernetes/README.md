# Agent Builder Kubernetes Release

This directory contains the Kubernetes release path for Agent Builder.

## Components

- `namespace.yaml` — creates the `agennext` namespace
- `deployment.yaml` — runs the Agent Builder pod
- `service.yaml` — exposes the pod internally on port `3000`
- `ingress.yaml` — optional public route template
- `kustomization.yaml` — deploys the release bundle

## Apply pod-only release

```bash
kubectl apply -k deploy/kubernetes
kubectl -n agennext rollout status deployment/agent-builder
kubectl -n agennext port-forward svc/agent-builder 3000:3000
```

## Public route

The ingress manifest is a template. Before public use, replace:

```text
agent-builder.agnext.local
```

with the real DNS name, for example:

```text
agent-builder.<your-domain>
```

Then ensure:

- DNS points to the ingress controller
- ingress controller is installed
- cert-manager is installed if using the `letsencrypt-prod` issuer
- `letsencrypt-prod` ClusterIssuer exists

## Verify

```bash
kubectl -n agennext get ingress agent-builder
kubectl -n agennext describe ingress agent-builder
kubectl -n agennext get secret agent-builder-tls
```

## Release note

This is a Kubernetes self-hosting release path. It does not create a SaaS tenant, auth system, billing layer, or public AGenNext workspace by itself.
