#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-help}"
IMAGE="${IMAGE:-agennext-agent-builder:local}"
NAMESPACE="${NAMESPACE:-agennext}"

usage() {
  cat <<'EOF'
Agent Builder self-serve helper

Usage:
  ./scripts/self-serve.sh dev
  ./scripts/self-serve.sh docker
  ./scripts/self-serve.sh k8s
  ./scripts/self-serve.sh verify
  ./scripts/self-serve.sh logs
  ./scripts/self-serve.sh rollback
  ./scripts/self-serve.sh delete

Environment:
  IMAGE=agennext-agent-builder:local
  NAMESPACE=agennext
EOF
}

case "$MODE" in
  dev)
    npm ci
    npm run dev:next
    ;;
  docker)
    docker build -t "$IMAGE" .
    docker run --rm -p 3000:3000 "$IMAGE"
    ;;
  k8s)
    kubectl apply -k deploy/kubernetes
    kubectl -n "$NAMESPACE" rollout status deployment/agent-builder
    ;;
  verify)
    kubectl -n "$NAMESPACE" get deploy agent-builder
    kubectl -n "$NAMESPACE" get pods -l app.kubernetes.io/name=agent-builder
    kubectl -n "$NAMESPACE" get svc agent-builder
    ;;
  logs)
    kubectl -n "$NAMESPACE" logs deploy/agent-builder
    ;;
  rollback)
    kubectl -n "$NAMESPACE" rollout undo deployment/agent-builder
    kubectl -n "$NAMESPACE" rollout status deployment/agent-builder
    ;;
  delete)
    kubectl delete -k deploy/kubernetes
    ;;
  help|--help|-h)
    usage
    ;;
  *)
    echo "Unknown mode: $MODE" >&2
    usage
    exit 2
    ;;
esac
