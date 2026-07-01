#!/usr/bin/env bash
set -euo pipefail

TAG="${TAG:-v0.1.0}"
REMOTE="${REMOTE:-origin}"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree is not clean. Commit or stash changes before releasing." >&2
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Release must be created from main. Current branch: $CURRENT_BRANCH" >&2
  exit 1
fi

git fetch "$REMOTE" --tags

git pull --ff-only "$REMOTE" main

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag already exists locally: $TAG" >&2
  exit 1
fi

if git ls-remote --exit-code --tags "$REMOTE" "refs/tags/$TAG" >/dev/null 2>&1; then
  echo "Tag already exists on remote: $TAG" >&2
  exit 1
fi

git tag -a "$TAG" -m "Agent Builder A2UI Preview $TAG"
git push "$REMOTE" "$TAG"

echo "Release tag pushed: $TAG"
echo "Check GitHub Actions -> Container Release for GHCR publish status."
