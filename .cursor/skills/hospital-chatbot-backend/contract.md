# API contract (reference)

## GET `/api/chat/history/:sessionId`

Response:

```json
{
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "text": "Hi",
      "timestamp": "ISO-8601"
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "type": "text",
      "text": "Hello!",
      "timestamp": "ISO-8601"
    }
  ]
}
```

Assistant entries may include `type`, `doctors` when replaying rich replies (booking client types are usually not persisted unless backend stores them).

## POST `/api/chat/message`

See SKILL.md. `attachments` array shape is defined by product; widget sends metadata from composer after upload step.

## POST `/api/appointments/book`

Request:

```json
{
  "sessionId": "string",
  "doctorId": "string",
  "slotId": "string"
}
```

Response:

```json
{
  "status": "confirmed",
  "message": "Human-readable confirmation"
}
```

Widget maps `message` into `booking-success` bubble text.

## POST `/api/chat/attachments`

Multipart: `sessionId`, file field `attachments`.

Success JSON (per file), consumed by widget:

```json
{
  "name": "file.pdf",
  "type": "application/pdf",
  "size": 12345,
  "url": "https://..."
}
```

Errors: JSON `{ "message": "..." }` with non-2xx status; surfaced via `chatApi` throw.
