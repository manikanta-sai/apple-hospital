# Reference — templates & OpenAPI

## OpenAPI 3 — core paths (starter)

```yaml
openapi: 3.0.3
info:
  title: Hospital Chatbot API
  version: 1.0.0
paths:
  /chat/history/{sessionId}:
    get:
      parameters:
        - $ref: '#/components/parameters/TenantId'
        - name: sessionId
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Message history
          content:
            application/json:
              schema:
                type: object
                required: [messages]
                properties:
                  messages:
                    type: array
                    items: { $ref: '#/components/schemas/ChatMessage' }
  /chat/message:
    post:
      parameters:
        - $ref: '#/components/parameters/TenantId'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/SendMessageRequest' }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/SendMessageResponse' }
  /appointments/book:
    post:
      parameters:
        - $ref: '#/components/parameters/TenantId'
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/BookAppointmentRequest' }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/BookAppointmentResponse' }
        '409':
          description: Slot unavailable
components:
  parameters:
    TenantId:
      name: X-Tenant-Id
      in: header
      required: true
      schema: { type: string }
  schemas:
    SendMessageRequest:
      type: object
      required: [sessionId, message]
      properties:
        sessionId: { type: string }
        message: { type: string }
        targetLanguage: { type: string, default: en }
        attachments:
          type: array
          items: { $ref: '#/components/schemas/AttachmentMeta' }
    AssistantReply:
      type: object
      required: [type, text]
      properties:
        type:
          type: string
          enum: [text, doctor-list, fallback]
        text: { type: string }
        doctors:
          type: array
          items: { $ref: '#/components/schemas/Doctor' }
    SendMessageResponse:
      type: object
      required: [sessionId, reply]
      properties:
        sessionId: { type: string }
        reply: { $ref: '#/components/schemas/AssistantReply' }
    Doctor:
      type: object
      required: [id, name, department]
      properties:
        id: { type: string }
        name: { type: string }
        department: { type: string }
        image: { type: string, format: uri }
        availability: { type: string, enum: [available, busy] }
        nextSlot: { type: string }
        rating: { type: number }
        slots:
          type: array
          items: { type: string }
    BookAppointmentRequest:
      type: object
      required: [sessionId, doctorId, slotId]
      properties:
        sessionId: { type: string }
        doctorId: { type: string }
        slotId: { type: string }
    BookAppointmentResponse:
      type: object
      required: [status, message]
      properties:
        status: { type: string, enum: [confirmed] }
        message: { type: string }
    AttachmentMeta:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
        type: { type: string }
        size: { type: integer }
        url: { type: string, format: uri }
    ChatMessage:
      type: object
      required: [role, text]
      properties:
        id: { type: string }
        role: { type: string, enum: [user, assistant] }
        type: { type: string }
        text: { type: string }
        timestamp: { type: string, format: date-time }
```

Extend with `/chat/attachments` multipart when implementing uploads.

## Express — app skeleton

```javascript
// server/src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { tenantMiddleware } from './middleware/tenant.js';
import { errorHandler } from './middleware/errorHandler.js';
import chatRoutes from './routes/chat.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
  app.use(express.json({ limit: '256kb' }));
  app.use(tenantMiddleware);
  app.use('/api/chat', chatRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use(errorHandler);
  return app;
}
```

## Controller pattern

```javascript
// server/src/controllers/chat.controller.js
export async function postMessage(req, res, next) {
  try {
    const { sessionId, message, targetLanguage, attachments } = req.body;
    const result = await chatService.sendMessage({
      tenantId: req.tenantId,
      sessionId,
      message,
      targetLanguage: targetLanguage ?? 'en',
      attachments: attachments ?? [],
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
```

## Centralized error handler

```javascript
// server/src/middleware/errorHandler.js
export function errorHandler(err, req, res, _next) {
  const status = err.status ?? 500;
  const message =
    status >= 500 ? 'Internal server error' : err.message ?? 'Bad request';
  if (status >= 500) {
    req.log?.error({ err, requestId: req.id }, 'request failed');
  }
  res.status(status).json({ message, code: err.code });
}
```

## Client env module (recommended)

```javascript
// src/config/env.js
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';
export const MOCK_MODE = import.meta.env.VITE_CHAT_MOCK_MODE !== 'false';
```

Import `MOCK_MODE` from here in `chatApi.js` and `useChatSession.js`.

## Reusable React component checklist

- Accept `className` merge when wrapper styling may vary
- Expose `aria-*` and `data-testid` only when tests need stable hooks beyond roles
- Document non-obvious props with one-line JSDoc
- No business constants inside component — import from `constants` or i18n

## Service layer (backend) — chat example

```javascript
// server/src/services/chat.service.js
export async function sendMessage({ tenantId, sessionId, message, targetLanguage, attachments }) {
  // 1. Load session for tenant
  // 2. Persist user message
  // 3. Call LLM / rules engine with targetLanguage
  // 4. Normalize reply { type, text, doctors? }
  // 5. Persist assistant message
  return { sessionId, reply };
}
```

Keep LLM prompts and department keyword logic here, not in controllers or React.
