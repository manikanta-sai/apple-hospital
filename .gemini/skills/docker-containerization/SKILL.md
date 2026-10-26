---
name: docker-containerization
description: >-
  Standardized Docker containerization workflow for hospital-chatbot-widget:
  multi-stage Dockerfile (Node build + Nginx alpine serve), SPA fallback routing,
  layer caching, docker-compose orchestration, and container health checks.
  Use when creating or updating Docker configs, troubleshooting container builds,
  or deploying the application.
---

# Docker Containerization & Deployment Standards

This skill documents the production containerization architecture and commands for the `hospital-chatbot-widget` application.

---

## 1. Architecture: Multi-Stage Build

Frontend applications do not require a Node.js runtime in production. Always use a two-stage build pattern:

1. **Stage 1 (Builder - `node:20-alpine`)**:
   - Isolates dependency manifests (`package*.json`) before full source copy to leverage Docker layer caching.
   - Installs packages via `npm ci`.
   - Compiles static distribution bundle into `/app/dist` using `npm run build`.

2. **Stage 2 (Runtime - `nginx:alpine`)**:
   - Strips default Nginx web configs from `/etc/nginx/conf.d/`.
   - Injects custom `nginx.conf` tailored for SPAs.
   - Copies `/app/dist` from the builder stage into `/usr/share/nginx/html`.
   - Exposes HTTP port `80`.
   - Results in a lean footprint (~66 MB).

---

## 2. Nginx SPA Routing Requirements

The Nginx configuration (`nginx.conf`) MUST maintain:
- **SPA Fallback**: `try_files $uri $uri/ /index.html;` to allow client-side routing without 404s.
- **Compression**: `gzip on` for text, css, js, json, svg.
- **Cache Invalidation**: Long-lived immutable headers for hashed assets (`/assets/` -> `expires 1y; Cache-Control "public, no-transform, immutable"`).
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`.

---

## 3. Build Optimization & Layer Caching

Maintain `.dockerignore` at project root to exclude:
- `node_modules` (prevents local OS binaries from polluting container)
- `dist` (ensures fresh container builds)
- `.git`, `.gemini`, `playwright-report`, `test-results`, and logs

---

## 4. Orchestration & Command Standards

### Docker Compose (`docker-compose.yml`)
- Service name: `chatbot-widget`
- Container name: `hospital-chatbot-widget`
- Default port mapping: `"8080:80"` (Host: `8080`, Container: `80`)
- Environment: `NODE_ENV=production`

### Operational Commands
- **Build and Start**: `docker compose up -d --build`
- **Check Status**: `docker ps --filter "name=hospital-chatbot-widget"`
- **Inspect Logs**: `docker compose logs -f`
- **Stop and Remove**: `docker compose down`
- **Verify Health**: `curl.exe -I http://localhost:8080`
