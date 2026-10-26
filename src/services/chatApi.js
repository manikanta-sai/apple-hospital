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
const MOCK_MODE = import.meta.env.VITE_CHAT_MOCK_MODE !== "false";

// Client-side Rate Limiter (Sliding Window)
// Protects backend against Layer 7 spam, bot floods, and infinite message loops
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,       // Max requests
  windowMs: 60 * 1000,   // Per 1 minute window
};

const requestTimestamps = [];

export function checkRateLimit() {
  const now = Date.now();
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - RATE_LIMIT_CONFIG.windowMs) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= RATE_LIMIT_CONFIG.maxRequests) {
    const retryAfter = Math.ceil((requestTimestamps[0] + RATE_LIMIT_CONFIG.windowMs - now) / 1000);
    throw new Error(`Rate limit exceeded: Too many requests. Please wait ${retryAfter} seconds.`);
  }

  requestTimestamps.push(now);
}

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
export async function sendChatMessage(sessionId, message, tenantId, targetLanguage = "en", attachments = []) {
  checkRateLimit();
  const res = await fetch(`${API_BASE_URL}/chat/message`, {
    method: "POST",
    headers: buildHeaders(tenantId),
    body: JSON.stringify({ sessionId, message, attachments, targetLanguage }),
  });
  return handleResponse(res);
}

export async function uploadChatAttachments(sessionId, entries, tenantId, onProgress) {
  checkRateLimit();
  if (MOCK_MODE) {
    return Promise.all(
      entries.map((entry) =>
        new Promise((resolve) => {
          const total = entry.file.size;
          let loaded = 0;
          const tick = Math.max(10240, Math.round(total / 12));
          const interval = window.setInterval(() => {
            loaded = Math.min(total, loaded + tick);
            onProgress?.(entry.id, loaded, total);
            if (loaded >= total) {
              window.clearInterval(interval);
              resolve({
                id: entry.id,
                name: entry.file.name,
                type: entry.file.type,
                size: entry.file.size,
                url: entry.file.type.startsWith("image/") ? URL.createObjectURL(entry.file) : null,
              });
            }
          }, 90);
        })
      )
    );
  }

  return Promise.all(
    entries.map(
      (entry) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("sessionId", sessionId);
          formData.append("attachments", entry.file, entry.file.name);

          const xhr = new XMLHttpRequest();
          xhr.open("POST", `${API_BASE_URL}/chat/attachments`);
          if (tenantId) xhr.setRequestHeader("X-Tenant-Id", tenantId);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              onProgress?.(entry.id, event.loaded, event.total);
            }
          };

          xhr.onload = () => {
            try {
              const response = JSON.parse(xhr.responseText || "{}");
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve({
                  id: entry.id,
                  name: response.name || entry.file.name,
                  type: response.type || entry.file.type,
                  size: response.size || entry.file.size,
                  url: response.url || null,
                });
              } else {
                reject(new Error(response.message || `Upload failed with status ${xhr.status}`));
              }
            } catch (err) {
              reject(new Error("Failed to parse upload response."));
            }
          };

          xhr.onerror = () => reject(new Error("Network error uploading attachments."));
          xhr.send(formData);
        })
    )
  );
}

/**
 * POST /api/appointments/book
 * Books a slot for a doctor surfaced in a doctor card.
 */
export async function bookDoctorSlot(sessionId, doctorId, slotId, tenantId) {
  checkRateLimit();
  const res = await fetch(`${API_BASE_URL}/appointments/book`, {
    method: "POST",
    headers: buildHeaders(tenantId),
    body: JSON.stringify({ sessionId, doctorId, slotId }),
  });
  return handleResponse(res);
}
