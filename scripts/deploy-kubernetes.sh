#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${NAMESPACE:-agennext}"
HOST="${HOST:-}"

if ! command -v kubectl >/dev/null 2>&1; then
  echo "kubectl is required." >&2
  exit 1
fi

if [ -n "$HOST" ]; then
  echo "Applying ingress host override: $HOST"
  tmpdir="$(mktemp -d)"
  trap 'rm -rf "$tmpdir"' EXIT
  cp -R deploy/kubernetes "$tmpdir/kubernetes"
  sed -i.bak "s/agent-builder.agnext.local/$HOST/g" "$tmpdir/kubernetes/ingress.yaml"
  kubectl apply -k "$tmpdir/kubernetes"
else
  kubectl apply -k deploy/kubernetes
fi

kubectl -n "$NAMESPACE" rollout status deployment/agent-builder
kubectl -n "$NAMESPACE" get pods -l app.kubernetes.io/name=agent-builder
kubectl -n "$NAMESPACE" get svc agent-builder

if kubectl -n "$NAMESPACE" get ingress agent-builder >/dev/null 2>&1; then
  kubectl -n "$NAMESPACE" get ingress agent-builder
fi

echo "Agent Builder Kubernetes release applied."
