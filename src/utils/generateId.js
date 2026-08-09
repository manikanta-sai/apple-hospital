/**
 * Generates a RFC4122-ish unique id. Prefers the native crypto API
 * (available in all modern browsers over HTTPS/localhost) and falls
 * back to a timestamp+random string for older/insecure contexts so
 * the widget never throws during session bootstrap.
 */
export function generateId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${rand}`;
}
