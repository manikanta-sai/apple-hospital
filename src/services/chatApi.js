/**
 * chatApi.js
 * ----------
 * Thin HTTP layer for the chatbot. Kept separate from components/hooks
 * so the transport (fetch vs axios), base URL, and auth headers can
 * change in one place without touching UI code.
 *
 * Multi-tenant note: pass a `tenantId` (e.g. hospital/branch code) as
 * either a header or subdomain depending on your backend's tenancy
 * model. It's wired in here via an `X-Tenant-Id` header as an example.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function buildHeaders(tenantId) {
  return {
    "Content-Type": "application/json",
    ...(tenantId ? { "X-Tenant-Id": tenantId } : {}),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * GET /api/chat/history/:sessionId
 * Returns previously exchanged messages so a page refresh/navigation
 * doesn't wipe the conversation.
 */
export async function fetchChatHistory(sessionId, tenantId) {
  const res = await fetch(`${API_BASE_URL}/chat/history/${sessionId}`, {
    method: "GET",
    headers: buildHeaders(tenantId),
  });
  return handleResponse(res);
}

/**
 * POST /api/chat/message
 * Sends the user's text to the AI backend and receives the assistant's
 * reply, which may include a `doctors` array for rich card rendering.
 */
export async function sendChatMessage(sessionId, message, tenantId) {
  const res = await fetch(`${API_BASE_URL}/chat/message`, {
    method: "POST",
    headers: buildHeaders(tenantId),
    body: JSON.stringify({ sessionId, message }),
  });
  return handleResponse(res);
}

/**
 * POST /api/appointments/book
 * Books a slot for a doctor surfaced in a doctor card.
 */
export async function bookDoctorSlot(sessionId, doctorId, slotId, tenantId) {
  const res = await fetch(`${API_BASE_URL}/appointments/book`, {
    method: "POST",
    headers: buildHeaders(tenantId),
    body: JSON.stringify({ sessionId, doctorId, slotId }),
  });
  return handleResponse(res);
}
