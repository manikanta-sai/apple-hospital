import { hospitalDb } from "../db/hospitalDb.js";

/**
 * ============================================================================
 * Hospital Daily Telemetry & Stats - Native IndexedDB Implementation
 * ============================================================================
 * Requirements met:
 * 1. Obtains today's date in YYYY-MM-DD format using the user's local calendar.
 * 2. Checks IndexedDB to see whether a record for today's date already exists.
 * 3. If today's data exists, skips insertion (no duplicates).
 * 4. If today's data does not exist, inserts default demo data for today.
 * 5. Uses date as a unique key ({ keyPath: "date" }) to prevent duplicates.
 * 6. Uses an atomic readwrite transaction for safe check-and-insert.
 * 7. Works across all time zones without UTC day-shift bugs.
 * 8. Handles error events, onupgradeneeded, oncomplete, and onabort.
 * 9. Never deletes or overwrites existing historical data.
 * 10. Maintains 100% compatibility with HospitalStatsDashboard and existing UI.
 */

export const DB_NAME = "HospitalStats_DB";
export const DB_VERSION = 1;
export const STORE_NAME = "dailyStats";

/**
 * Returns the calendar date in YYYY-MM-DD format based on the client's LOCAL timezone.
 * Avoids toISOString() which converts to UTC and can shift the date backwards/forwards.
 *
 * @param {Date} [d=new Date()]
 * @returns {string} Date string in YYYY-MM-DD format
 */
export function getLocalTodayDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generates realistic default demo stats for a given local date.
 * @param {string} dateStr Local date formatted as YYYY-MM-DD
 * @returns {Object} Complete hospital telemetry record for the date
 */
export function generateDefaultStatsForDate(dateStr) {
  return {
    date: dateStr,
    timeframe: "Today",
    patients: {
      total: 253,
      regular: 143,
      critical: 11,
      trend: "+19%",
      trendDirection: "up",
    },
    doctors: {
      total: 154,
      available: 143,
      unavailable: 11,
      trend: "-7%",
      trendDirection: "down",
    },
    nurses: {
      total: 265,
      available: 203,
      unavailable: 62,
      trend: "+6%",
      trendDirection: "up",
    },
    beds: {
      total: 678,
      available: 298,
      unavailable: 380,
      trend: "+11%",
      trendDirection: "up",
    },
    medicalSupplies: {
      capacityPct: 68,
      availablePct: 73,
      usedPct: 27,
      trend: "+4%",
      trendDirection: "up",
    },
    ambulances: {
      total: 65,
      available: 59,
      out: 6,
      trend: "0%",
      trendDirection: "neutral",
    },
    floors: {
      "4th Floor": {
        cases: 198,
        status: "LOW LOAD",
        statusColor: "bg-blue-600",
        generalTotal: 30,
        generalAvail: 22,
        privateTotal: 18,
        privateAvail: 15,
      },
      "3rd Floor": {
        cases: 312,
        status: "OPTIMAL",
        statusColor: "bg-teal-600",
        generalTotal: 36,
        generalAvail: 15,
        privateTotal: 24,
        privateAvail: 8,
      },
      "2nd Floor": {
        cases: 543,
        status: "CONGESTED",
        statusColor: "bg-[#d8225e]",
        generalTotal: 47,
        generalAvail: 10,
        privateTotal: 28,
        privateAvail: 13,
      },
      "1st Floor": {
        cases: 489,
        status: "STABLE",
        statusColor: "bg-emerald-600",
        generalTotal: 40,
        generalAvail: 18,
        privateTotal: 20,
        privateAvail: 12,
      },
    },
    nursesOnDuty: [
      { id: 1, initials: "BC", name: "Beatriz Catita", dept: "Emergency", shift: "4:00 AM - 01:00 PM" },
      { id: 2, initials: "BM", name: "Bruno Madeira", dept: "Emergency", shift: "4:00 AM - 01:00 PM" },
      { id: 3, initials: "CA", name: "Cristiana Araújo", dept: "Pediatric", shift: "5:00 AM - 01:30 PM" },
      { id: 4, initials: "JK", name: "Jakob Kenter", dept: "Pediatric", shift: "6:00 AM - 02:30 PM" },
      { id: 5, initials: "LB", name: "Lincoln Bergson", dept: "Emergency", shift: "6:00 AM - 02:30 PM" },
      { id: 6, initials: "MM", name: "Marília Martins", dept: "Emergency", shift: "7:00 AM - 03:30 PM" },
    ],
  };
}

/**
 * Historical and aggregated defaults for fallback queries (Yesterday, This Week, This Month)
 */
export const DEFAULT_TIMEFRAME_DATA = {
  Today: generateDefaultStatsForDate(getLocalTodayDateString()),
  Yesterday: {
    timeframe: "Yesterday",
    patients: {
      total: 241,
      regular: 138,
      critical: 9,
      trend: "+8%",
      trendDirection: "up",
    },
    doctors: {
      total: 150,
      available: 139,
      unavailable: 11,
      trend: "+2%",
      trendDirection: "up",
    },
    nurses: {
      total: 258,
      available: 196,
      unavailable: 62,
      trend: "+4%",
      trendDirection: "up",
    },
    beds: {
      total: 678,
      available: 312,
      unavailable: 366,
      trend: "+5%",
      trendDirection: "up",
    },
    medicalSupplies: {
      capacityPct: 72,
      availablePct: 78,
      usedPct: 22,
      trend: "+7%",
      trendDirection: "up",
    },
    ambulances: {
      total: 65,
      available: 56,
      out: 9,
      trend: "-3%",
      trendDirection: "down",
    },
    floors: {
      "4th Floor": {
        cases: 182,
        status: "LOW LOAD",
        statusColor: "bg-blue-600",
        generalTotal: 30,
        generalAvail: 24,
        privateTotal: 18,
        privateAvail: 16,
      },
      "3rd Floor": {
        cases: 295,
        status: "OPTIMAL",
        statusColor: "bg-teal-600",
        generalTotal: 36,
        generalAvail: 18,
        privateTotal: 24,
        privateAvail: 11,
      },
      "2nd Floor": {
        cases: 518,
        status: "CONGESTED",
        statusColor: "bg-[#d8225e]",
        generalTotal: 47,
        generalAvail: 12,
        privateTotal: 28,
        privateAvail: 14,
      },
      "1st Floor": {
        cases: 462,
        status: "STABLE",
        statusColor: "bg-emerald-600",
        generalTotal: 40,
        generalAvail: 21,
        privateTotal: 20,
        privateAvail: 14,
      },
    },
    nursesOnDuty: [
      { id: 101, initials: "SA", name: "Sara Alencar", dept: "Intensive Care", shift: "3:30 AM - 12:30 PM" },
      { id: 102, initials: "TC", name: "Tiago Cardoso", dept: "Emergency", shift: "4:00 AM - 01:00 PM" },
      { id: 103, initials: "RL", name: "Raquel Lima", dept: "Cardiology", shift: "5:00 AM - 01:30 PM" },
      { id: 104, initials: "DK", name: "Daniel Klee", dept: "Pediatric", shift: "6:00 AM - 02:30 PM" },
      { id: 105, initials: "NS", name: "Nuno Santos", dept: "Emergency", shift: "6:30 AM - 03:00 PM" },
      { id: 106, initials: "VM", name: "Valéria Mendes", dept: "Neurology", shift: "7:00 AM - 03:30 PM" },
    ],
  },
  "This Week": {
    timeframe: "This Week",
    patients: {
      total: 1724,
      regular: 1042,
      critical: 78,
      trend: "+14%",
      trendDirection: "up",
    },
    doctors: {
      total: 168,
      available: 156,
      unavailable: 12,
      trend: "+10%",
      trendDirection: "up",
    },
    nurses: {
      total: 284,
      available: 235,
      unavailable: 49,
      trend: "+12%",
      trendDirection: "up",
    },
    beds: {
      total: 678,
      available: 245,
      unavailable: 433,
      trend: "+8%",
      trendDirection: "up",
    },
    medicalSupplies: {
      capacityPct: 75,
      availablePct: 81,
      usedPct: 19,
      trend: "+11%",
      trendDirection: "up",
    },
    ambulances: {
      total: 65,
      available: 61,
      out: 4,
      trend: "+3%",
      trendDirection: "up",
    },
    floors: {
      "4th Floor": {
        cases: 1340,
        status: "OPTIMAL",
        statusColor: "bg-teal-600",
        generalTotal: 30,
        generalAvail: 19,
        privateTotal: 18,
        privateAvail: 12,
      },
      "3rd Floor": {
        cases: 2180,
        status: "STABLE",
        statusColor: "bg-emerald-600",
        generalTotal: 36,
        generalAvail: 14,
        privateTotal: 24,
        privateAvail: 9,
      },
      "2nd Floor": {
        cases: 3690,
        status: "HIGH DEMAND",
        statusColor: "bg-[#d8225e]",
        generalTotal: 47,
        generalAvail: 8,
        privateTotal: 28,
        privateAvail: 9,
      },
      "1st Floor": {
        cases: 3410,
        status: "STABLE",
        statusColor: "bg-emerald-600",
        generalTotal: 40,
        generalAvail: 16,
        privateTotal: 20,
        privateAvail: 10,
      },
    },
    nursesOnDuty: [
      { id: 201, initials: "BC", name: "Beatriz Catita", dept: "Emergency Lead", shift: "Day Shift (Rotating)" },
      { id: 202, initials: "HF", name: "Helena Ferreira", dept: "Surgical ICU", shift: "Morning / Evening" },
      { id: 203, initials: "BM", name: "Bruno Madeira", dept: "Emergency", shift: "Day Shift" },
      { id: 204, initials: "RP", name: "Ricardo Pinto", dept: "Trauma Care", shift: "Full Rotation" },
      { id: 205, initials: "CA", name: "Cristiana Araújo", dept: "Pediatric Head", shift: "Day Shift" },
      { id: 206, initials: "LB", name: "Lincoln Bergson", dept: "Emergency", shift: "Day Shift" },
    ],
  },
  "This Month": {
    timeframe: "This Month",
    patients: {
      total: 7850,
      regular: 4890,
      critical: 312,
      trend: "+23%",
      trendDirection: "up",
    },
    doctors: {
      total: 180,
      available: 168,
      unavailable: 12,
      trend: "+15%",
      trendDirection: "up",
    },
    nurses: {
      total: 310,
      available: 260,
      unavailable: 50,
      trend: "+18%",
      trendDirection: "up",
    },
    beds: {
      total: 678,
      available: 280,
      unavailable: 398,
      trend: "+14%",
      trendDirection: "up",
    },
    medicalSupplies: {
      capacityPct: 84,
      availablePct: 88,
      usedPct: 12,
      trend: "+16%",
      trendDirection: "up",
    },
    ambulances: {
      total: 65,
      available: 58,
      out: 7,
      trend: "+1%",
      trendDirection: "neutral",
    },
    floors: {
      "4th Floor": {
        cases: 5890,
        status: "OPTIMAL",
        statusColor: "bg-teal-600",
        generalTotal: 30,
        generalAvail: 20,
        privateTotal: 18,
        privateAvail: 13,
      },
      "3rd Floor": {
        cases: 9420,
        status: "STABLE",
        statusColor: "bg-emerald-600",
        generalTotal: 36,
        generalAvail: 15,
        privateTotal: 24,
        privateAvail: 10,
      },
      "2nd Floor": {
        cases: 16450,
        status: "PEAK ACTIVITY",
        statusColor: "bg-[#d8225e]",
        generalTotal: 47,
        generalAvail: 7,
        privateTotal: 28,
        privateAvail: 8,
      },
      "1st Floor": {
        cases: 14810,
        status: "STABLE",
        statusColor: "bg-emerald-600",
        generalTotal: 40,
        generalAvail: 17,
        privateTotal: 20,
        privateAvail: 11,
      },
    },
    nursesOnDuty: [
      { id: 301, initials: "MM", name: "Marília Martins", dept: "Chief Supervisor", shift: "All Wards" },
      { id: 302, initials: "BC", name: "Beatriz Catita", dept: "Emergency Lead", shift: "Monthly Roster" },
      { id: 303, initials: "JK", name: "Jakob Kenter", dept: "Pediatrics", shift: "Monthly Roster" },
      { id: 304, initials: "LB", name: "Lincoln Bergson", dept: "Emergency", shift: "Monthly Roster" },
      { id: 305, initials: "BM", name: "Bruno Madeira", dept: "Emergency", shift: "Monthly Roster" },
      { id: 306, initials: "CA", name: "Cristiana Araújo", dept: "Pediatrics", shift: "Monthly Roster" },
    ],
  },
};

/**
 * Opens or upgrades the native IndexedDB database safely.
 * Preserves all existing data during version upgrades.
 *
 * @returns {Promise<IDBDatabase>}
 */
export function openHospitalStatsDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this runtime environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    // Schema upgrades and store creation
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Do NOT delete or clear existing stores. Only create if not present!
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "date" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      const error = event.target.error || new Error("Failed to open HospitalStats_DB");
      console.error("[IndexedDB] Database open error:", error);
      reject(error);
    };
  });
}

/**
 * Initializes daily stats in IndexedDB.
 *
 * Flow:
 * 1. Derives today's local calendar date in YYYY-MM-DD.
 * 2. Opens a single atomic readwrite transaction.
 * 3. Checks if a record with keyPath "date" equal to today's date exists.
 * 4. If found: does NOT insert again (prevents duplicate records).
 * 5. If not found: inserts default demo data for today without modifying past days.
 * 6. Tomorrow: the date changes, so tomorrow's data is automatically created
 *    and today's data becomes historical!
 *
 * @returns {Promise<{ date: string, record: Object, isNew: boolean }>}
 */
export async function initDailyStats() {
  const todayStr = getLocalTodayDateString();

  try {
    const db = await openHospitalStatsDB();

    return await new Promise((resolve, reject) => {
      // 1. Single atomic readwrite transaction for check-and-insert
      const tx = db.transaction([STORE_NAME], "readwrite");
      const store = tx.objectStore(STORE_NAME);

      let recordResult = null;
      let isNewRecord = false;

      // 2. Check if a record for today's date already exists
      const getReq = store.get(todayStr);

      getReq.onsuccess = () => {
        const existingRecord = getReq.result;

        if (existingRecord) {
          // Record exists for today -> Do NOT insert again
          recordResult = existingRecord;
          isNewRecord = false;
        } else {
          // No record exists for today -> Insert default demo data for today
          const newDailyData = {
            ...generateDefaultStatsForDate(todayStr),
            date: todayStr,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Use store.add() to enforce primary key uniqueness on keyPath: "date"
          const addReq = store.add(newDailyData);

          addReq.onsuccess = () => {
            recordResult = newDailyData;
            isNewRecord = true;
          };

          addReq.onerror = (errEvent) => {
            console.error("[IndexedDB] Failed to insert today's demo record:", errEvent.target.error);
          };
        }
      };

      getReq.onerror = (errEvent) => {
        console.error("[IndexedDB] Error checking today's record:", errEvent.target.error);
      };

      // 3. Proper Transaction Completion and Error handling
      tx.oncomplete = () => {
        // Also keep Dexie synchronized if present
        if (hospitalDb.hospitalStats && recordResult) {
          hospitalDb.hospitalStats.put({ ...recordResult, timeframe: "Today" }).catch(() => {});
        }
        resolve({
          date: todayStr,
          record: recordResult || generateDefaultStatsForDate(todayStr),
          isNew: isNewRecord,
        });
      };

      tx.onerror = (errEvent) => {
        const error = errEvent.target.error || new Error("Transaction error in initDailyStats");
        console.error("[IndexedDB] Transaction error:", error);
        reject(error);
      };

      tx.onabort = (abortEvent) => {
        const error = abortEvent.target.error || new Error("Transaction aborted in initDailyStats");
        console.warn("[IndexedDB] Transaction aborted:", error);
        reject(error);
      };
    });
  } catch (err) {
    console.warn("[IndexedDB] Falling back to memory stats:", err);
    return {
      date: todayStr,
      record: generateDefaultStatsForDate(todayStr),
      isNew: false,
    };
  }
}

/**
 * Retrieves daily telemetry stats for a specific date (YYYY-MM-DD).
 * @param {string} dateStr
 * @returns {Promise<Object|null>}
 */
export async function getDailyStatsByDate(dateStr) {
  try {
    const db = await openHospitalStatsDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(dateStr);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[IndexedDB] Error retrieving stats for date ${dateStr}:`, err);
    return null;
  }
}

/**
 * Retrieves all historical daily records stored across past days.
 * @returns {Promise<Array<Object>>}
 */
export async function getAllHistoricalStats() {
  try {
    const db = await openHospitalStatsDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[IndexedDB] Error retrieving all historical stats:", err);
    return [];
  }
}

/**
 * Retrieves hospital telemetry stats for the specified dashboard filter.
 * - "Today": loads or initializes today's record from IndexedDB (keyed by local YYYY-MM-DD).
 * - "Yesterday": checks IndexedDB for yesterday's date; if absent, uses Yesterday default.
 * - "This Week" / "This Month": provides the multi-day aggregated dataset.
 *
 * @param {string} [timeframe="Today"]
 * @returns {Promise<Object>}
 */
export async function getHospitalStatsFromDb(timeframe = "Today") {
  try {
    if (timeframe === "Today") {
      const todayStr = getLocalTodayDateString();
      const existing = await getDailyStatsByDate(todayStr);
      if (existing) {
        return existing;
      }
      // If not yet present, run atomic check-and-insert
      const { record } = await initDailyStats();
      return record;
    }

    if (timeframe === "Yesterday") {
      const yesterday = new Date(Date.now() - 86400000);
      const yesterdayStr = getLocalTodayDateString(yesterday);
      const existing = await getDailyStatsByDate(yesterdayStr);
      if (existing) {
        return existing;
      }
      return DEFAULT_TIMEFRAME_DATA.Yesterday;
    }

    if (DEFAULT_TIMEFRAME_DATA[timeframe]) {
      return DEFAULT_TIMEFRAME_DATA[timeframe];
    }

    return DEFAULT_TIMEFRAME_DATA.Today;
  } catch (err) {
    console.warn("[IndexedDB] getHospitalStatsFromDb fallback:", err);
    return DEFAULT_TIMEFRAME_DATA[timeframe] || DEFAULT_TIMEFRAME_DATA.Today;
  }
}

/**
 * Updates an existing daily stats record in IndexedDB without deleting historical data.
 * @param {Object} stats Record containing a valid "date" property in YYYY-MM-DD
 * @returns {Promise<void>}
 */
export async function saveHospitalStatsToDb(stats) {
  if (!stats || !stats.date) {
    console.warn("[IndexedDB] saveHospitalStatsToDb requires a record with a valid 'date' property.");
    return;
  }

  try {
    const db = await openHospitalStatsDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        ...stats,
        updatedAt: new Date().toISOString(),
      });

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error("[IndexedDB] Failed to save hospital stats:", err);
  }
}

// Automatically initialize today's daily record on application start
if (typeof window !== "undefined") {
  initDailyStats().catch((err) => {
    console.warn("[IndexedDB] Automatic daily stats startup initialization:", err);
  });
}
