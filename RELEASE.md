# Agent Builder Release

## Release name

Agent Builder A2UI Preview

## Release status

Release candidate.

## What is being released

This release packages Agent Builder as the first independently runnable AGenNext product feature.

It includes:

- A2UI core schema and builder package
- A2UI React renderer package
- Next.js demo application
- Container image build path
- CI checks for install, build, Next build, and Docker build

## Release command set

```bash
npm ci
npm run build
npm run build:next
docker build -t agennext-agent-builder:preview .
docker run --rm -p 3000:3000 agennext-agent-builder:preview
```

## Release gates

- [ ] `npm ci` passes
- [ ] `npm run build` passes
- [ ] `npm run build:next` passes
- [ ] `docker build .` passes
- [ ] demo starts on port `3000`
- [ ] A2UI payload renders through React renderer
- [ ] action dispatch remains client-controlled
- [ ] no backend business logic is introduced

## Production notes

This is a feature release, not the full AGenNext platform release.

Agent Builder can ship first because it is a bounded product surface: agent-authored UI payloads, validation, rendering, and user-controlled action dispatch.

The next production step is to publish the container image and deploy the Next demo behind the AGenNext product domain.
