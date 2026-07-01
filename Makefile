.PHONY: help install dev build build-next docker k8s verify logs rollback delete release

IMAGE ?= agennext-agent-builder:local
NAMESPACE ?= agennext
HOST ?=

help:
	@echo "Agent Builder self-serve targets"
	@echo ""
	@echo "  make install       Install dependencies"
	@echo "  make dev           Run local Next.js demo"
	@echo "  make build         Build packages and Vite shell"
	@echo "  make build-next    Build Next.js demo"
	@echo "  make docker        Build and run local Docker image"
	@echo "  make k8s           Apply Kubernetes release"
	@echo "  make verify        Verify Kubernetes release"
	@echo "  make logs          Show Kubernetes logs"
	@echo "  make rollback      Roll back Kubernetes deployment"
	@echo "  make delete        Delete Kubernetes release"
	@echo "  make release       Create and push v0.1.0 tag"

install:
	npm ci

dev:
	./scripts/self-serve.sh dev

build:
	npm run build

build-next:
	npm run build:next

docker:
	IMAGE=$(IMAGE) ./scripts/self-serve.sh docker

k8s:
	NAMESPACE=$(NAMESPACE) HOST=$(HOST) ./scripts/deploy-kubernetes.sh

verify:
	NAMESPACE=$(NAMESPACE) ./scripts/self-serve.sh verify

logs:
	NAMESPACE=$(NAMESPACE) ./scripts/self-serve.sh logs

rollback:
	NAMESPACE=$(NAMESPACE) ./scripts/self-serve.sh rollback

delete:
	NAMESPACE=$(NAMESPACE) ./scripts/self-serve.sh delete

release:
	./scripts/release-v0.1.0.sh
