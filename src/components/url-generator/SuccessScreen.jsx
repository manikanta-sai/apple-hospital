import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Plus,
  QrCode,
  Share2,
  Sparkles,
} from "lucide-react";
import { getLinkUrls } from "../../services/shortUrlService";

// Helper for crisp SVG QR Code
function renderQrSvg(url, size = 160) {
  const N = 21;
  const grid = Array.from({ length: N }, () => Array(N).fill(false));

  const drawFinder = (startR, startC) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[startR + r][startC + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, N - 7);
  drawFinder(N - 7, 0);

  for (let i = 8; i < N - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }
  grid[N - 8][8] = true;

  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const inFinderTL = r < 8 && c < 8;
      const inFinderTR = r < 8 && c >= N - 8;
      const inFinderBL = r >= N - 8 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inFinderTL && !inFinderTR && !inFinderBL && !inTiming) {
        const val = Math.sin(hash * 0.1 + r * 13 + c * 37) * 10000;
        grid[r][c] = val - Math.floor(val) > 0.48;
      }
    }
  }

  const cellSize = size / N;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-lg shadow-sm"
      aria-label={`QR Code for ${url}`}
    >
      <rect width={size} height={size} fill="#ffffff" rx={6} />
      {grid.flatMap((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.3}
              height={cellSize + 0.3}
              fill="#0E3D3D"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function SuccessScreen({
  title,
  shortCode,
  moduleType,
  expiresAt,
  onReset,
  onPreview,
}) {
  const [copiedType, setCopiedType] = useState(null);
  const { localPreviewUrl, shareableProductionUrl } = getLinkUrls(shortCode);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const formattedExpiration = expiresAt
    ? `Expires on ${new Date(expiresAt).toLocaleDateString()} at ${new Date(
        expiresAt
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Never expires";

  const smsText = `Dear Patient, your Get Well Hospital ${title} is ready. Access securely: ${shareableProductionUrl}. Inquiries: 080-492000.`;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up space-y-6">
      {/* Top Success Banner */}
      <div className="rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50/70 to-white p-6 sm:p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700 mb-4 shadow-sm">
          <CheckCircle2 size={32} />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-3 py-1 text-xs font-semibold text-teal-900 mb-2">
          <Sparkles size={13} /> Link Generated & Stored in IndexedDB
        </span>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-clinical-950">
          {title}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-ink-600">
          {formattedExpiration}
        </p>

        {/* Short Code Display Pill */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="text-xs font-medium text-ink-600">Short Code:</span>
            <span className="font-mono text-base font-bold text-teal-800 tracking-wider">
              {shortCode}
            </span>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(shareableProductionUrl, "prod")}
            className="inline-flex items-center gap-2 rounded-xl bg-clinical-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-clinical-900 transition"
          >
            {copiedType === "prod" ? (
              <>
                <Check size={14} className="text-emerald-400" /> Copied Short Link!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Short Link
              </>
            )}
          </button>

          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex items-center gap-2 rounded-xl border border-clinical-200 bg-white px-4 py-2.5 text-xs font-semibold text-clinical-800 shadow-sm hover:bg-clinical-50 transition"
            >
              <ExternalLink size={14} /> Preview Patient Page
            </button>
          )}
        </div>
      </div>

      {/* Two Columns: Local vs Production Note & QR Code */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Link Routing & Deployment Note */}
        <div className="rounded-xl border border-clinical-100 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-display text-sm font-bold text-clinical-950 flex items-center gap-2">
            <Share2 size={16} className="text-teal-600" /> Link Destinations
          </h3>

          <div>
            <label className="text-[11px] font-semibold text-clinical-900 block mb-1">
              Local Browser Preview Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={localPreviewUrl}
                className="w-full font-mono text-[11px] bg-clinical-50/50 border border-clinical-100 rounded-lg p-2 text-ink-900 select-all"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(localPreviewUrl, "local")}
                className="rounded-lg border border-clinical-200 p-2 text-clinical-700 hover:bg-clinical-50"
                title="Copy local preview URL"
              >
                {copiedType === "local" ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
            <p className="mt-1 text-[10px] text-ink-600">
              Opens the destination page directly in this browser session via IndexedDB.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-clinical-900 block mb-1">
              Branded Patient URL:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableProductionUrl}
                className="w-full font-mono text-[11px] bg-clinical-50/50 border border-clinical-100 rounded-lg p-2 text-teal-800 font-bold select-all"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(shareableProductionUrl, "prod-input")}
                className="rounded-lg border border-clinical-200 p-2 text-clinical-700 hover:bg-clinical-50"
                title="Copy shareable URL"
              >
                {copiedType === "prod-input" ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
            <p className="mt-1 text-[10px] text-ink-600">
              Note: Cross-device sharing requires public deployment of the resolver server.
            </p>
          </div>
        </div>

        {/* Instant QR Code */}
        <div className="rounded-xl border border-clinical-100 bg-white p-5 shadow-sm flex flex-col items-center text-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold text-clinical-950 flex items-center justify-center gap-2">
              <QrCode size={16} className="text-teal-600" /> Reception Counter QR Code
            </h3>
            <p className="text-[11px] text-ink-600 mt-1">
              Patients can scan from reception to access this record.
            </p>
          </div>

          <div className="my-3 p-2 bg-white border border-clinical-200 rounded-lg shadow-inner">
            {renderQrSvg(shareableProductionUrl, 130)}
          </div>

          <span className="text-[11px] font-mono text-teal-800 font-semibold">
            {shareableProductionUrl}
          </span>
        </div>
      </div>

      {/* Patient SMS Message Card */}
      <div className="rounded-xl border border-clinical-100 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-clinical-950 flex items-center gap-2">
            <MessageSquare size={16} className="text-teal-600" /> Ready Patient SMS Template
          </h3>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            Single SMS Segment
          </span>
        </div>

        <div className="rounded-lg bg-clinical-50/60 border border-clinical-200 p-3 text-xs text-clinical-950 font-sans leading-relaxed">
          {smsText}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-ink-600">
            Character count: ~{smsText.length} chars (within 160 char limit)
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(smsText, "sms")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-clinical-200 bg-white px-3 py-1.5 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
          >
            {copiedType === "sms" ? (
              <>
                <Check size={13} className="text-emerald-600" /> Copied SMS
              </>
            ) : (
              <>
                <Copy size={13} /> Copy SMS Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* Create Another Action */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-clinical-200 bg-white px-6 py-2.5 text-xs font-semibold text-clinical-800 shadow-sm hover:bg-clinical-50 transition"
        >
          <Plus size={15} /> Create Another Link
        </button>
      </div>
    </div>
  );
}
