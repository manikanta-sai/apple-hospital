import { useState } from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Link,
  Plus,
  Stethoscope,
  User,
  Video,
} from "lucide-react";
import { db } from "../../db/database";
import { createLinkRecord } from "../../services/shortUrlService";
import SuccessScreen from "./SuccessScreen";

export default function TelehealthForm({ onNavigate }) {
  const [doctorName, setDoctorName] = useState("");
  const [doctorDesignation, setDoctorDesignation] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [description, setDescription] = useState("");
  const [videoMeetingUrl, setVideoMeetingUrl] = useState("");
  const [expiration, setExpiration] = useState("7 days");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!doctorName.trim()) {
      setErrorMessage("Doctor Name is required.");
      return;
    }
    if (!doctorDesignation.trim()) {
      setErrorMessage("Doctor Designation is required.");
      return;
    }
    if (!meetingTitle.trim()) {
      setErrorMessage("Meeting Title is required.");
      return;
    }
    if (!meetingDate) {
      setErrorMessage("Meeting Date is required.");
      return;
    }
    if (!meetingTime) {
      setErrorMessage("Meeting Time is required.");
      return;
    }

    let trimmedVideoUrl = videoMeetingUrl.trim();
    if (!trimmedVideoUrl) {
      setErrorMessage("Video Meeting Link is required.");
      return;
    }

    if (!/^https?:\/\//i.test(trimmedVideoUrl)) {
      trimmedVideoUrl = `https://${trimmedVideoUrl}`;
    }

    try {
      new URL(trimmedVideoUrl);
    } catch {
      setErrorMessage("Please enter a valid HTTP or HTTPS video meeting link.");
      return;
    }

    try {
      setIsSubmitting(true);

      const meetingId = await db.telehealthMeetings.add({
        doctorName: doctorName.trim(),
        doctorDesignation: doctorDesignation.trim(),
        meetingTitle: meetingTitle.trim(),
        meetingDate,
        meetingTime,
        description: description.trim(),
        videoMeetingUrl: trimmedVideoUrl,
        createdAt: Date.now(),
      });

      const linkResult = await createLinkRecord({
        moduleType: "telehealth",
        title: `${doctorName.trim()} - ${meetingTitle.trim()}`,
        destinationId: meetingId,
        expirationOption: expiration,
      });

      setCreatedRecord({
        title: `${doctorName.trim()} - ${meetingTitle.trim()}`,
        meetingId,
        shortCode: linkResult.shortCode,
        expiresAt: linkResult.expiresAt,
      });
    } catch (err) {
      console.error("Failed to save telehealth meeting:", err);
      setErrorMessage("An error occurred while saving the consultation to IndexedDB.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDoctorName("");
    setDoctorDesignation("");
    setMeetingTitle("");
    setMeetingDate("");
    setMeetingTime("");
    setDescription("");
    setVideoMeetingUrl("");
    setExpiration("7 days");
    setErrorMessage("");
    setCreatedRecord(null);
  };

  if (createdRecord) {
    return (
      <SuccessScreen
        title={createdRecord.title}
        shortCode={createdRecord.shortCode}
        moduleType="telehealth"
        expiresAt={createdRecord.expiresAt}
        onReset={handleReset}
        onPreview={() => onNavigate(`/meetings/${createdRecord.meetingId}`)}
      />
    );
  }

  return (
    <div className="mx-auto">
      <div className="rounded-2xl border border-clinical-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="border-b border-clinical-100 pb-4 mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
            Module 2 · Virtual Consultations
          </span>
          <h2 className="font-display text-xl font-bold text-clinical-950 mt-1">
            Generate Telehealth Meeting Link
          </h2>
          <p className="text-xs text-ink-600 mt-1">
            Create branded consultation links with doctor profiles, appointment schedules, and direct one-click Join Meeting access.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Doctor Details */}
          <div className="rounded-xl border border-clinical-100 bg-clinical-50/30 p-4 space-y-4">
            <h3 className="font-display text-xs font-bold text-clinical-950 flex items-center gap-2">
              <Stethoscope size={15} className="text-teal-600" /> Doctor Details
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="docName" className="block text-xs font-semibold text-clinical-900 mb-1">
                  Doctor Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="docName"
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Ananya Rao"
                  className="w-full rounded-xl border border-clinical-100 bg-white px-3.5 py-2 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
                />
              </div>

              <div>
                <label htmlFor="docDesignation" className="block text-xs font-semibold text-clinical-900 mb-1">
                  Doctor Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  id="docDesignation"
                  type="text"
                  required
                  value={doctorDesignation}
                  onChange={(e) => setDoctorDesignation(e.target.value)}
                  placeholder="e.g. Senior Consultant Cardiologist, MD, DM"
                  className="w-full rounded-xl border border-clinical-100 bg-white px-3.5 py-2 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Meeting Information */}
          <div className="rounded-xl border border-clinical-100 bg-clinical-50/30 p-4 space-y-4">
            <h3 className="font-display text-xs font-bold text-clinical-950 flex items-center gap-2">
              <Video size={15} className="text-teal-600" /> Meeting Information
            </h3>

            <div>
              <label htmlFor="meetTitle" className="block text-xs font-semibold text-clinical-900 mb-1">
                Meeting Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="meetTitle"
                type="text"
                required
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="e.g. 2-Week Post-Operative Cardiac Review"
                className="w-full rounded-xl border border-clinical-100 bg-white px-3.5 py-2 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="meetDate" className="block text-xs font-semibold text-clinical-900 mb-1">
                  Meeting Date <span className="text-rose-500">*</span>
                </label>
                <input
                  id="meetDate"
                  type="date"
                  required
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full rounded-xl border border-clinical-100 bg-white px-3.5 py-2 text-xs text-clinical-950 focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
                />
              </div>

              <div>
                <label htmlFor="meetTime" className="block text-xs font-semibold text-clinical-900 mb-1">
                  Meeting Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="meetTime"
                  type="text"
                  required
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  placeholder="e.g. 11:30 AM or 04:00 PM"
                  className="w-full rounded-xl border border-clinical-100 bg-white px-3.5 py-2 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-xs font-semibold text-clinical-900 mb-1">
                Video Meeting Link (Google Meet, Zoom, Webex) <span className="text-rose-500">*</span>
              </label>
              <input
                id="videoUrl"
                type="text"
                required
                value={videoMeetingUrl}
                onChange={(e) => setVideoMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="w-full rounded-xl border border-clinical-100 bg-white px-3.5 py-2 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
              />
            </div>

            <div>
              <label htmlFor="meetDesc" className="block text-xs font-semibold text-clinical-900 mb-1">
                Patient Instructions / Description (Optional)
              </label>
              <textarea
                id="meetDesc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Please keep your recent BP log and medication list ready before joining."
                className="w-full rounded-xl border border-clinical-100 bg-white px-3.5 py-2 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
              />
            </div>
          </div>

          {/* Expiration Options */}
          <div>
            <label htmlFor="telehealthExpiry" className="block text-xs font-semibold text-clinical-900 mb-1">
              Link Expiration <span className="text-rose-500">*</span>
            </label>
            <select
              id="telehealthExpiry"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            >
              <option value="1 day">1 day (Single day appointment)</option>
              <option value="7 days">7 days (Standard consultation window)</option>
              <option value="30 days">30 days (Follow-up period)</option>
              <option value="90 days">90 days (Quarterly care plan)</option>
              <option value="Never expires">Never expires</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-clinical-200 px-4 py-2.5 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-clinical-700 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-clinical-900 transition disabled:opacity-50"
            >
              {isSubmitting ? "Generating Link..." : "Generate Short URL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
