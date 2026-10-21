import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  HeartHandshake,
  Link2,
  Plus,
  Power,
  RefreshCw,
  Search,
  Sparkles,
  Stethoscope,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { db, resetDatabase } from "../../db/database";
import {
  deleteLinkRecord,
  getLinkStatus,
  getLinkUrls,
  isLinkExpired,
  toggleLinkActiveStatus,
} from "../../services/shortUrlService";

const MODULE_META = {
  "lab-reports": {
    label: "Lab Report",
    badge: "bg-teal-50 text-teal-800 border-teal-200",
    icon: FileText,
  },
  telehealth: {
    label: "Telehealth",
    badge: "bg-sky-50 text-sky-800 border-sky-200",
    icon: Video,
  },
  feedback: {
    label: "Feedback",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    icon: HeartHandshake,
  },
  survey: {
    label: "Survey",
    badge: "bg-violet-50 text-violet-800 border-violet-200",
    icon: Link2,
  },
};

export default function DashboardView({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [copiedId, setCopiedId] = useState(null);
  const [deletingLinkId, setDeletingLinkId] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Live Dexie reactive queries
  const links = useLiveQuery(() => db.links.toArray(), []) || [];
  const feedbackSubmissionsCount =
    useLiveQuery(() => db.feedbackResponses.count(), []) || 0;

  // Calculate stats
  const totalUrls = links.length;
  const activeUrls = links.filter((l) => l.isActive && !isLinkExpired(l)).length;
  const expiredUrls = links.filter((l) => isLinkExpired(l)).length;

  const handleCopyLink = async (shortCode, id) => {
    try {
      const { shareableProductionUrl } = getLinkUrls(shortCode);
      await navigator.clipboard.writeText(shareableProductionUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleToggleActive = async (id) => {
    await toggleLinkActiveStatus(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingLinkId) {
      await deleteLinkRecord(deletingLinkId);
      setDeletingLinkId(null);
    }
  };

  const handleResetDb = async () => {
    await resetDatabase();
    setShowResetConfirm(false);
  };

  const handlePreviewLink = (link) => {
    if (link.moduleType === "lab-reports") {
      onNavigate(`/reports/${link.destinationId}`);
    } else if (link.moduleType === "telehealth") {
      onNavigate(`/meetings/${link.destinationId}`);
    } else if (link.moduleType === "feedback") {
      onNavigate(`/feedback/${link.destinationId}`);
    } else if (link.moduleType === "survey") {
      if (link.destinationUrl) {
        window.open(link.destinationUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  // Filter and sort recent links
  const filteredLinks = links
    .filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.shortCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMod = moduleFilter === "all" || l.moduleType === moduleFilter;
      return matchesSearch && matchesMod;
    })
    .sort((a, b) => {
      return sortOrder === "desc"
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt;
    });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Title & Subtitle Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-clinical-950 mt-1">
            Create and Manage Healthcare Links
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-1">
            Create, share, and manage links for hospital services. Client-side IndexedDB database.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-clinical-200 bg-white px-3 py-1.5 text-xs font-semibold text-clinical-700 hover:bg-clinical-50 transition"
          title="Reset sample data in IndexedDB"
        >
          <RefreshCw size={13} /> Reset Database
        </button>
      </div>

      {/* 4 Prominent Creation Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Lab Reports */}
        <div className="rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-teal-400 hover:shadow-md transition">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 mb-4">
              <FileText size={22} />
            </div>
            <h3 className="font-display text-base font-bold text-clinical-950">
              Lab Reports
            </h3>
            <p className="mt-1 text-xs text-ink-600 leading-relaxed">
              Manage laboratory reports and attachments.
            </p>
          </div>
          <div className="pt-5 mt-auto">
            <button
              type="button"
              onClick={() => onNavigate("/lab-reports/new")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-clinical-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-clinical-900 transition shadow-sm"
            >
              <Plus size={14} /> Create URL
            </button>
          </div>
        </div>

        {/* Card 2: Telehealth */}
        <div className="rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-sky-400 hover:shadow-md transition">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 mb-4">
              <Video size={22} />
            </div>
            <h3 className="font-display text-base font-bold text-clinical-950">
              Telehealth
            </h3>
            <p className="mt-1 text-xs text-ink-600 leading-relaxed">
              Share doctor and online consultation information.
            </p>
          </div>
          <div className="pt-5 mt-auto">
            <button
              type="button"
              onClick={() => onNavigate("/telehealth/new")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-sky-900 transition shadow-sm"
            >
              <Plus size={14} /> Create URL
            </button>
          </div>
        </div>

        {/* Card 3: Patient Feedback */}
        <div className="rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 mb-4">
              <HeartHandshake size={22} />
            </div>
            <h3 className="font-display text-base font-bold text-clinical-950">
              Patient Feedback
            </h3>
            <p className="mt-1 text-xs text-ink-600 leading-relaxed">
              Create feedback forms and collect ratings.
            </p>
          </div>
          <div className="pt-5 mt-auto">
            <button
              type="button"
              onClick={() => onNavigate("/feedback/new")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-800 transition shadow-sm"
            >
              <Plus size={14} /> Create URL
            </button>
          </div>
        </div>

        {/* Card 4: Survey */}
        <div className="rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-violet-400 hover:shadow-md transition">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700 mb-4">
              <Link2 size={22} />
            </div>
            <h3 className="font-display text-base font-bold text-clinical-950">
              Survey
            </h3>
            <p className="mt-1 text-xs text-ink-600 leading-relaxed">
              Shorten existing survey URLs.
            </p>
          </div>
          <div className="pt-5 mt-auto">
            <button
              type="button"
              onClick={() => onNavigate("/survey/new")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-900 transition shadow-sm"
            >
              <Plus size={14} /> Create URL
            </button>
          </div>
        </div>
      </div>

      {/* 4 Live Dashboard Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-clinical-100 bg-white p-4 sm:p-5 shadow-sm">
          <span className="text-xs font-semibold text-ink-600">Total URLs Created</span>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-clinical-950">
            {totalUrls}
          </p>
          <span className="text-[11px] text-teal-800 font-medium">Recorded in Dexie</span>
        </div>

        <div className="rounded-2xl border border-clinical-100 bg-white p-4 sm:p-5 shadow-sm">
          <span className="text-xs font-semibold text-ink-600">Active URLs</span>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-emerald-700">
            {activeUrls}
          </p>
          <span className="text-[11px] text-emerald-800 font-medium">Unexpired & live</span>
        </div>

        <div className="rounded-2xl border border-clinical-100 bg-white p-4 sm:p-5 shadow-sm">
          <span className="text-xs font-semibold text-ink-600">Expired URLs</span>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-amber-700">
            {expiredUrls}
          </p>
          <span className="text-[11px] text-amber-800 font-medium">Past expiry date</span>
        </div>

        <div className="rounded-2xl border border-clinical-100 bg-white p-4 sm:p-5 shadow-sm">
          <span className="text-xs font-semibold text-ink-600">Total Feedback Submissions</span>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-violet-700">
            {feedbackSubmissionsCount}
          </p>
          <span className="text-[11px] text-violet-800 font-medium">Patient 1-5★ ratings</span>
        </div>
      </div>

      {/* Recent URLs Table Section */}
      <div className="rounded-2xl border border-clinical-100 bg-white shadow-sm overflow-hidden">
        {/* Table Controls Header */}
        <div className="border-b border-clinical-100 p-5 sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-bold text-clinical-950 flex items-center gap-2">
              Recent Healthcare URLs
              <span className="rounded-full bg-clinical-50 px-2.5 py-0.5 text-xs font-semibold text-clinical-700">
                {filteredLinks.length}
              </span>
            </h2>
            <p className="text-xs text-ink-600 mt-0.5">
              Live IndexedDB records query. Changes persist across browser sessions.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or code..."
                className="w-full rounded-xl border border-clinical-100 bg-clinical-50/50 py-1.5 pl-8 pr-3 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-clinical-500"
              />
            </div>

            {/* Filter by Module */}
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="rounded-xl border border-clinical-100 bg-clinical-50/50 px-2.5 py-1.5 text-xs text-clinical-950 focus:border-clinical-500 focus:outline-none"
            >
              <option value="all">All Modules</option>
              <option value="lab-reports">Lab Reports</option>
              <option value="telehealth">Telehealth</option>
              <option value="feedback">Feedback</option>
              <option value="survey">Survey</option>
            </select>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
              className="rounded-xl border border-clinical-100 bg-clinical-50/50 px-2.5 py-1.5 text-xs font-medium text-clinical-800 hover:bg-clinical-100 transition"
              title="Toggle sort date"
            >
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-clinical-100 bg-clinical-50/60 text-[11px] font-semibold text-ink-600">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Module Type</th>
                <th className="py-3 px-4">Short Code</th>
                <th className="py-3 px-4 hidden md:table-cell">Creation Date</th>
                <th className="py-3 px-4 hidden lg:table-cell">Expiration</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clinical-100 text-xs">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-ink-600">
                    No healthcare links found. Click "Create URL" on any module above to generate your first record.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const meta = MODULE_META[link.moduleType] || {
                    label: link.moduleType,
                    badge: "bg-gray-100 text-gray-800",
                    icon: Link2,
                  };
                  const status = getLinkStatus(link);
                  const isDeactivated = !link.isActive;

                  return (
                    <tr
                      key={link.id}
                      className="transition hover:bg-clinical-50/40 group"
                    >
                      {/* Title */}
                      <td className="py-3.5 px-4 font-semibold text-clinical-950 max-w-xs truncate">
                        {link.title}
                      </td>

                      {/* Module Type */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${meta.badge}`}>
                          {meta.label}
                        </span>
                      </td>

                      {/* Short Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-800">
                        {link.shortCode}
                      </td>

                      {/* Creation Date */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-ink-600 text-[11px]">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </td>

                      {/* Expiration Date */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-ink-600 text-[11px]">
                        {link.expiresAt
                          ? new Date(link.expiresAt).toLocaleDateString()
                          : "Never"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            status === "Active"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : status === "Expired"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Action */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(link.shortCode, link.id)}
                            className="rounded p-1 text-ink-300 hover:text-teal-700 transition"
                            title="Copy short link"
                          >
                            {copiedId === link.id ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>

                          {/* Preview Action */}
                          <button
                            type="button"
                            onClick={() => handlePreviewLink(link)}
                            className="rounded p-1 text-ink-300 hover:text-sky-700 transition"
                            title="Preview destination page"
                          >
                            <Eye size={14} />
                          </button>

                          {/* View Details Action (feedback results) */}
                          {link.moduleType === "feedback" && (
                            <button
                              type="button"
                              onClick={() => onNavigate(`/feedback-results/${link.destinationId}`)}
                              className="rounded p-1 text-ink-300 hover:text-violet-700 transition"
                              title="View feedback results & ratings"
                            >
                              <BarChart3 size={14} />
                            </button>
                          )}

                          {/* Deactivate Toggle Action */}
                          <button
                            type="button"
                            onClick={() => handleToggleActive(link.id)}
                            className={`rounded p-1 transition ${
                              isDeactivated
                                ? "text-rose-600 hover:bg-rose-50"
                                : "text-ink-300 hover:text-amber-600 hover:bg-amber-50"
                            }`}
                            title={isDeactivated ? "Activate link" : "Deactivate link"}
                          >
                            <Power size={14} />
                          </button>

                          {/* Delete Action (triggers confirmation) */}
                          <button
                            type="button"
                            onClick={() => setDeletingLinkId(link.id)}
                            className="rounded p-1 text-ink-300 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete link"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingLinkId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-clinical-100 bg-white p-6 shadow-xl animate-fade-in-up">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-display text-base font-bold text-clinical-950">
              Confirm Delete Record?
            </h3>
            <p className="text-xs text-ink-600 mt-1.5 leading-relaxed">
              This will permanently delete the short link and its associated IndexedDB records and file attachments. This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingLinkId(null)}
                className="rounded-xl border border-clinical-200 px-4 py-2 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Database Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-clinical-100 bg-white p-6 shadow-xl animate-fade-in-up">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
              <RefreshCw size={24} />
            </div>
            <h3 className="font-display text-base font-bold text-clinical-950">
              Reset IndexedDB Sample Data?
            </h3>
            <p className="text-xs text-ink-600 mt-1.5 leading-relaxed">
              This will clear your local browser IndexedDB tables and re-populate the standard initial hospital records.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl border border-clinical-200 px-4 py-2 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDb}
                className="rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-900 transition"
              >
                Reset & Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
