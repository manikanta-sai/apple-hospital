# Node.js runtime — event loop, I/O, CPU, middleware

Apply to all code under `server/`.

## Event loop (do not block)

The Node process serves many concurrent HTTP clients on **one thread**. Anything synchronous and slow **stalls the entire server**.

| Avoid on request path | Prefer |
|----------------------|--------|
| `fs.readFileSync`, `writeFileSync`, large sync JSON parse | `fs/promises`, streams |
| `bcrypt.hashSync` / large `JSON.parse` on huge bodies | async APIs, size limits, worker |
| Tight loops, big in-memory sort/filter on large arrays | pagination, DB-side query, background job |
| `CPU` crypto on megabytes | streaming hash in worker or dedicated service |

**Rule:** If work may take **> ~10–50 ms CPU** or touches **large** payloads, it does not belong inline in a controller.

## Non-blocking I/O

- **Database:** async driver only (`pg`, `mongoose` with async/await). Connection pool; never one new connection per request without pool.
- **HTTP outbound** (LLM, translation): `fetch`/`axios` with **timeouts** and **AbortSignal**. Do not await unbounded calls on the hot path without timeout.
- **File uploads:** `multer` + streams to disk/S3; do not read entire file into memory unless small and capped.
- **Promises:** use `async` route handlers; rejections must reach the error middleware (see below).

```javascript
// routes/chat.routes.js — forward async errors
router.post('/message', (req, res, next) => {
  chatController.postMessage(req, res, next).catch(next);
});
// or: import { asyncHandler } from '../middleware/asyncHandler.js';
// router.post('/message', asyncHandler(chatController.postMessage));
```

## CPU-intensive & long tasks

Hospital chatbot examples: PDF text extraction, image OCR, large embedding/index builds, heavy NLP offline.

| Approach | When |
|----------|------|
| **`worker_threads`** | Isolated CPU burst (parse, compress) with fixed input size cap |
| **Job queue** (BullMQ + Redis) | LLM post-processing, reports, bulk sync — return 202 + job id or poll |
| **Separate microservice** | Sustained ML / OCR load |
| **Streaming response** | LLM tokens to client via SSE/chunked (still async I/O bound) |

Never run OCR/embedding over full upload inside `POST /chat/message` without timeout and offload plan.

```javascript
// worker example sketch — not on main thread
import { Worker } from 'node:worker_threads';

export function runInWorker(workerPath, payload) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, { workerData: payload });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}
```

## Middleware order (logging + errors)

First registered runs first on the way **in**; error handler runs last on failures.

```javascript
// server/src/app.js — recommended order
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestIdMiddleware } from './middleware/requestId.js';
import { httpLoggerMiddleware } from './middleware/httpLogger.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') }));
  app.use(express.json({ limit: process.env.JSON_LIMIT ?? '256kb' }));

  app.use(requestIdMiddleware);      // req.id for logs + errors
  app.use(httpLoggerMiddleware);     // structured request/response log

  app.use('/api', routes);

  app.use(notFoundHandler);          // 404 JSON
  app.use(errorHandler);             // 4-arg — MUST be last

  return app;
}
```

### Request ID

```javascript
// middleware/requestId.js
import { randomUUID } from 'node:crypto';

export function requestIdMiddleware(req, res, next) {
  req.id = req.headers['x-request-id'] ?? randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}
```

### Structured logging (no secrets)

Use **pino** or **winston** with JSON in production. Log: `requestId`, `tenantId`, `method`, `path`, `statusCode`, `durationMs`. **Never** log: passwords, tokens, full message body with PHI, API keys.

```javascript
// middleware/httpLogger.js
import pino from 'pino';
import pinoHttp from 'pino-http';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['req.headers.authorization', 'req.body.password', 'req.body.mobile'],
});

export const httpLoggerMiddleware = pinoHttp({
  logger,
  genReqId: (req) => req.id,
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
});
```

Attach child logger on request: `req.log = logger.child({ requestId: req.id, tenantId: req.tenantId })`.

### Operational errors vs programmer errors

```javascript
// errors/AppError.js
export class AppError extends Error {
  constructor(message, status = 400, code = 'BAD_REQUEST') {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = true;
  }
}

// middleware/errorHandler.js
export function errorHandler(err, req, res, _next) {
  const status = err.isOperational ? err.status : 500;
  const code = err.code ?? (status >= 500 ? 'INTERNAL_ERROR' : 'ERROR');
  const message = status >= 500 ? 'Internal server error' : err.message;

  req.log?.error(
    {
      err,
      requestId: req.id,
      tenantId: req.tenantId,
      stack: status >= 500 ? err.stack : undefined,
    },
    'request failed'
  );

  res.status(status).json({ message, code, requestId: req.id });
}
```

Controllers/services **throw** `AppError` for expected failures (`409` slot taken); unexpected errors bubble to `errorHandler` as 500.

### asyncHandler helper

```javascript
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
```

## Chat-specific guidance

| Endpoint | Runtime note |
|----------|----------------|
| `POST /chat/message` | Await LLM with timeout; persist messages async-safe; consider streaming |
| `GET /chat/history/:sessionId` | Indexed DB query + limit; no load-all-messages unbounded |
| `POST /chat/attachments` | Stream to storage; virus scan in **queue/worker**, not sync |
| `POST /appointments/book` | Short transaction; idempotent key to avoid double-book under retry |

## Health & readiness

- `GET /health/live` — process up (for k8s liveness)
- `GET /health/ready` — DB/redis reachable (for readiness)

Do not run heavy checks on every user request.

## Checklist before merging server code

- [ ] No sync filesystem or long CPU on request thread
- [ ] All async routes forward errors to `next(err)`
- [ ] Error middleware is last; 404 handler before it
- [ ] Logs include `requestId`; PHI/secrets redacted
- [ ] Outbound calls have timeouts
- [ ] CPU-heavy work uses worker/queue/service
