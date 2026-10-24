# API Documentation & Integration Services
[Back to Master Index](README.md)

This document specifies the HTTP REST endpoints, network payloads, multi-tenant headers, translation services, mock fallbacks, and integration protocols utilized across the platform.

---

## 1. Architecture & Transport Configuration

HTTP communications are centralized in [`src/services/chatApi.js`](../src/services/chatApi.js). The transport layer is deliberately decoupled from UI components, enabling seamless swapping between native `fetch`, `axios`, or mock modes.

### Environment Flags & Base URL
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const MOCK_MODE = import.meta.env.VITE_CHAT_MOCK_MODE !== "false";
```

- When `VITE_CHAT_MOCK_MODE` is `true` (default), network calls either fall back to rich client-side mock generators (`src/mock/mockResponses.js`) or local IndexedDB stores without failing.
- When `false`, real HTTP requests are dispatched to `VITE_API_BASE_URL`.

### Multi-Tenancy Header Protocol
Every API request forwards an `X-Tenant-Id` header to identify the hospital branch or tenant:
```javascript
function buildHeaders(tenantId) {
  return {
    "Content-Type": "application/json",
    ...(tenantId ? { "X-Tenant-Id": tenantId } : {}),
  };
}
```

---

## 2. API Endpoints Specification

### 2.1 Fetch Chat Conversation History
Returns historical messages for a given session to preserve conversation continuity across page reloads.

- **Endpoint**: `GET /api/chat/history/:sessionId`
- **Function**: `fetchChatHistory(sessionId, tenantId)`
- **Headers**:
  ```http
  Content-Type: application/json
  X-Tenant-Id: sunrise-hospital-main
  ```
- **Response Format (`200 OK`)**:
  ```json
  {
    "sessionId": "ses_9a8f2c3e-b14d",
    "messages": [
      {
        "id": "msg_001",
        "sender": "assistant",
        "text": "Hello! Welcome to ABCD Multispecialty Hospital. How may I assist you today?",
        "timestamp": 1729674000000,
        "attachments": []
      },
      {
        "id": "msg_002",
        "sender": "user",
        "text": "I want to consult a cardiologist.",
        "timestamp": 1729674025000,
        "attachments": []
      }
    ]
  }
  ```
- **Error Response (`404 / 500`)**:
  ```json
  {
    "status": "error",
    "message": "Chat session not found or expired."
  }
  ```

---

### 2.2 Send Chat Message & AI Intent Execution
Submits patient inquiries to the conversational AI core and retrieves the assistant's clinical response.

- **Endpoint**: `POST /api/chat/message`
- **Function**: `sendChatMessage(sessionId, message, tenantId, targetLanguage, attachments)`
- **Headers**:
  ```http
  Content-Type: application/json
  X-Tenant-Id: sunrise-hospital-main
  ```
- **Request Payload**:
  ```json
  {
    "sessionId": "ses_9a8f2c3e-b14d",
    "message": "Book an appointment with Dr. Rajesh Sharma for tomorrow morning",
    "targetLanguage": "en",
    "attachments": [
      {
        "id": "att_6b2d1",
        "name": "previous_ecg.pdf",
        "type": "application/pdf",
        "size": 245760,
        "url": "/uploads/previous_ecg.pdf"
      }
    ]
  }
  ```
  > [!TIP]
  > **Target Language Optimization**: Passing `targetLanguage` (`"en"`, `"te"`, `"hi"`) requests the AI model to generate replies natively in that language rather than translating English post-hoc, maintaining precise medical dosage and anatomical context.

- **Response Payload (`200 OK`)**:
  ```json
  {
    "id": "msg_003",
    "sender": "assistant",
    "text": "I have found 2 cardiologists available for consultation tomorrow:",
    "timestamp": 1729674045000,
    "doctors": [
      {
        "id": "doc_rajesh_sharma",
        "name": "Dr. Rajesh Sharma, MD, DM",
        "specialty": "Senior Interventional Cardiologist",
        "experience": "18 years",
        "rating": 4.9,
        "consultationFee": 800,
        "availableSlots": [
          { "id": "slot_101", "time": "09:30 AM", "available": true },
          { "id": "slot_102", "time": "10:15 AM", "available": true }
        ]
      }
    ]
  }
  ```

---

### 2.3 Upload Chat File Attachments
Uploads medical records, prescriptions, or imaging files with byte-level progress reporting.

- **Endpoint**: `POST /api/chat/attachments`
- **Function**: `uploadChatAttachments(sessionId, entries, tenantId, onProgress)`
- **Transport**: `XMLHttpRequest` (enabling `xhr.upload.onprogress` calculation).
- **Form Data**:
  - `sessionId`: String
  - `attachments`: File binary blob
- **Progress Callback Signature**:
  ```javascript
  onProgress(entryId, loadedBytes, totalBytes)
  ```
- **Mock Simulation Mode**:
  When `MOCK_MODE` is enabled, simulates realistic network throughput by incrementing chunks of `total / 12` bytes every 90ms, resolving with a local `URL.createObjectURL(file)` URL for image previews.

---

### 2.4 Book Doctor Appointment Slot
Finalizes an appointment slot selected from a doctor card.

- **Endpoint**: `POST /api/appointments/book`
- **Function**: `bookDoctorSlot(sessionId, doctorId, slotId, tenantId)`
- **Request Payload**:
  ```json
  {
    "sessionId": "ses_9a8f2c3e-b14d",
    "doctorId": "doc_rajesh_sharma",
    "slotId": "slot_101"
  }
  ```
- **Response Format (`200 OK`)**:
  ```json
  {
    "success": true,
    "bookingId": "BK-2026-94812",
    "doctorName": "Dr. Rajesh Sharma",
    "slotTime": "09:30 AM",
    "tokenNumber": "#ON-04",
    "instructions": "Please arrive 15 minutes before your consultation at Room 104."
  }
  ```

---

## 3. Bilingual Medical Translation Provider Service

Located at [`src/services/translationProvider.js`](../src/services/translationProvider.js):

- **Core Function**: `translatePrescriptionContent(prescription, targetLang = "te")`
- **Supported Languages**: English (`"en"`), Telugu (`"te"`), Hindi (`"hi"`).
- **Dictionary Mapping**: Contains verified clinical mappings for:
  - **Frequencies**:
    - `1-0-1` $\rightarrow$ `"ఉదయం - రాత్రి (Morning - Night)"`
    - `1-1-1` $\rightarrow$ `"ఉదయం - మధ్యాహ్నం - రాత్రి (Morning - Afternoon - Night)"`
    - `1-0-0` $\rightarrow$ `"ఉదయం మాత్రమే (Morning Only)"`
    - `0-0-1` $\rightarrow$ `"రాత్రి మాత్రమే (Night Only)"`
  - **Timings**:
    - `"Before Food"` $\rightarrow$ `"భోజనానికి ముందు (Before Food)"`
    - `"After Food"` $\rightarrow$ `"భోజనం తర్వాత (After Food)"`
    - `"With Food"` $\rightarrow$ `"ఆహారంతో పాటు (With Food)"`
  - **Standard Medical Instructions**:
    - `"Drink plenty of water"` $\rightarrow$ `"తగినంత నీరు త్రాగాలి"`
    - `"Avoid oily and spicy food"` $\rightarrow$ `"నూనె మరియు కారమైన ఆహారాన్ని నివారించండి"`
    - `"Complete the full antibiotic course"` $\rightarrow$ `"యాంటీబయాటిక్ కోర్సును పూర్తిగా పూర్తి చేయండి"`

---

## 4. CRM Omnichannel Webhook & Ingestion Protocols

Documented from [`src/components/crm/crmMockData.js`](../src/components/crm/crmMockData.js):

The CRM Unified Inbox ingests and standardizes inbound conversations across 7 distinct patient channels:
1. **WhatsApp Business Cloud API**: Webhook payloads with `message_id`, `from` phone number, message text, and media templates.
2. **Facebook Messenger API**: Graph API message events with page scope user IDs (PSID).
3. **Instagram Direct Messaging**: Webhook payload with IG-user identifiers.
4. **Threads Direct**: Conversation thread events.
5. **LinkedIn Messaging**: Lead Ad inquiries and InMail responses.
6. **Website Live Chatbot**: Webhook events emitted directly from the `ChatWidget` instance.
7. **Email / IMAP**: Inbound SMTP/IMAP clinical consultation requests.

---

## 5. Network Error Handling & Status Codes

HTTP responses are wrapped in a unified handler:
```javascript
async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}
```

### Handled Status Codes:
- `200 OK`: Request succeeded.
- `400 Bad Request`: Form payload missing mandatory fields.
- `401 Unauthorized / 403 Forbidden`: Tenant mismatch or unauthorized tenant key.
- `404 Not Found`: Session ID or doctor slot expired.
- `500 Internal Server Error`: Backend AI service failure; falls back gracefully to client mock rules without breaking UI.
