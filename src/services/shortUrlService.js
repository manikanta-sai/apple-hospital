import { db } from "../db/database";

const SHORT_CODE_CHARS = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SHORT_CODE_LENGTH = 7;
const MAX_COLLISION_RETRIES = 10;

/**
 * Generate a cryptographically secure, unpredictable random short code.
 */
export function generateCryptographicCode(length = SHORT_CODE_LENGTH) {
  const bytes = new Uint8Array(length);
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let code = "";
  for (let i = 0; i < length; i++) {
    code += SHORT_CODE_CHARS[bytes[i] % SHORT_CODE_CHARS.length];
  }
  return code;
}

/**
 * Calculate expiration timestamp based on string duration
 */
export function calculateExpirationTimestamp(option) {
  const now = Date.now();
  switch (option) {
    case "1 day":
      return now + 24 * 60 * 60 * 1000;
    case "7 days":
      return now + 7 * 24 * 60 * 60 * 1000;
    case "30 days":
      return now + 30 * 24 * 60 * 60 * 1000;
    case "90 days":
      return now + 90 * 24 * 60 * 60 * 1000;
    case "Never expires":
    case "never":
    default:
      return null;
  }
}

/**
 * Check if a link is currently expired based on actual timestamp
 */
export function isLinkExpired(link) {
  if (!link || !link.expiresAt) return false;
  return Date.now() > link.expiresAt;
}

/**
 * Get the link's operational status: "Active", "Expired", or "Deactivated"
 */
export function getLinkStatus(link) {
  if (!link.isActive) return "Deactivated";
  if (isLinkExpired(link)) return "Expired";
  return "Active";
}

/**
 * Create a new short link record in IndexedDB with collision avoidance
 */
export async function createLinkRecord({
  moduleType,
  title,
  destinationId,
  destinationUrl = null,
  expirationOption = "7 days",
}) {
  const expiresAt = calculateExpirationTimestamp(expirationOption);
  const now = Date.now();

  let code = "";
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < MAX_COLLISION_RETRIES) {
    attempts++;
    code = generateCryptographicCode();
    const existing = await db.links.where("shortCode").equals(code).first();
    if (!existing) {
      isUnique = true;
    }
  }

  if (!isUnique) {
    throw new Error("Failed to generate a unique short code. Please try again.");
  }

  const linkId = await db.links.add({
    shortCode: code,
    moduleType,
    title,
    destinationId,
    destinationUrl,
    createdAt: now,
    expiresAt,
    isActive: true,
  });

  return {
    linkId,
    shortCode: code,
    expiresAt,
  };
}

/**
 * Look up a link by short code
 */
export async function getLinkByShortCode(shortCode) {
  if (!shortCode) return null;
  return await db.links.where("shortCode").equals(shortCode.trim()).first();
}

/**
 * Toggle active status of a link
 */
export async function toggleLinkActiveStatus(linkId) {
  const link = await db.links.get(linkId);
  if (!link) return null;
  const newStatus = !link.isActive;
  await db.links.update(linkId, { isActive: newStatus });
  return newStatus;
}

/**
 * Delete a link and optionally its associated entity records
 */
export async function deleteLinkRecord(linkId) {
  const link = await db.links.get(linkId);
  if (!link) return false;

  // Clean up associated module records
  try {
    if (link.moduleType === "lab-reports" && link.destinationId) {
      await db.labReports.delete(link.destinationId);
      await db.labReportAttachments.where("reportId").equals(link.destinationId).delete();
    } else if (link.moduleType === "telehealth" && link.destinationId) {
      await db.telehealthMeetings.delete(link.destinationId);
    } else if (link.moduleType === "feedback" && link.destinationId) {
      await db.feedbackForms.delete(link.destinationId);
      await db.feedbackResponses.where("feedbackFormId").equals(link.destinationId).delete();
    } else if (link.moduleType === "survey" && link.destinationId) {
      await db.surveys.delete(link.destinationId);
    }
  } catch (err) {
    console.error("Cleanup error during link deletion:", err);
  }

  await db.links.delete(linkId);
  return true;
}

/**
 * Construct URL helpers distinguishing local browser preview vs production domain
 */
export function getLinkUrls(shortCode) {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  const localPreviewUrl = `${origin}/s/${shortCode}`;
  const shareableProductionUrl = `https://gwh.link/${shortCode}`;

  return {
    shortCode,
    localPreviewUrl,
    shareableProductionUrl,
  };
}
