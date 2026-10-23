import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Video,
} from "lucide-react";
import { db } from "../../db/database";

export default function TelehealthViewer({ meetingId, onBack }) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeeting() {
      try {
        setLoading(true);
        const data = await db.telehealthMeetings.get(Number(meetingId));
        if (!data) {
          setError("Telehealth meeting not found or was removed.");
        } else {
          setMeeting(data);
        }
      } catch (err) {
        console.error("Failed to load telehealth meeting:", err);
        setError("Could not load consultation record from IndexedDB.");
      } finally {
        setLoading(false);
      }
    }

    loadMeeting();
  }, [meetingId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-clinical-700 border-r-transparent"></div>
        <p className="mt-3 text-xs text-ink-600">Loading virtual consultation details...</p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-6 sm:p-8 text-center shadow-sm">
        <AlertCircle size={32} className="mx-auto text-rose-600 mb-2" />
        <h3 className="font-display text-base font-bold text-clinical-950">
          Consultation Room Unavailable
        </h3>
        <p className="text-xs text-ink-600 mt-1">{error || "Record not found."}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-clinical-200 px-4 py-2 text-xs font-semibold text-clinical-800 hover:bg-clinical-50"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="rounded-2xl border border-clinical-100 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-clinical-100 bg-gradient-to-r from-teal-50/70 to-clinical-50/50 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
              <Video size={13} /> Virtual Outpatient Tele-Consultation
            </span>
            <span className="text-[11px] text-ink-600">
              ABCD Multispecialty Hospital
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-clinical-950">
            {meeting.meetingTitle}
          </h2>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 font-bold">
              <Stethoscope size={24} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-clinical-950">
                {meeting.doctorName}
              </h3>
              <p className="text-xs text-clinical-700 font-medium">
                {meeting.doctorDesignation}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule & Join Call Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-clinical-100 bg-clinical-50/40 p-4">
              <span className="text-[11px] font-semibold text-ink-600 flex items-center gap-1.5 mb-1">
                <Calendar size={14} className="text-teal-600" /> Consultation Date
              </span>
              <p className="text-sm font-bold text-clinical-950">
                {meeting.meetingDate}
              </p>
            </div>

            <div className="rounded-xl border border-clinical-100 bg-clinical-50/40 p-4">
              <span className="text-[11px] font-semibold text-ink-600 flex items-center gap-1.5 mb-1">
                <Clock size={14} className="text-teal-600" /> Scheduled Time
              </span>
              <p className="text-sm font-bold text-clinical-950">
                {meeting.meetingTime}
              </p>
            </div>
          </div>

          {meeting.description && (
            <div className="rounded-xl border border-clinical-200 bg-clinical-50/30 p-4">
              <h4 className="font-display text-xs font-bold text-clinical-950 mb-1">
                Doctor's Instructions & Preparation
              </h4>
              <p className="text-xs text-clinical-900 leading-relaxed">
                {meeting.description}
              </p>
            </div>
          )}

          {/* Join Call Action Box */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800 mb-2">
              <Video size={24} />
            </div>
            <h4 className="font-display text-base font-bold text-clinical-950">
              Ready to Join Your Doctor?
            </h4>
            <p className="text-xs text-ink-600 max-w-md mx-auto">
              Please test your camera and microphone beforehand. Click the button below to connect with {meeting.doctorName}.
            </p>

            <div className="pt-2">
              <a
                href={meeting.videoMeetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-900 transition"
              >
                <Video size={16} /> Join Video Consultation
                <ExternalLink size={14} />
              </a>
            </div>

            <p className="text-[11px] text-ink-600 pt-1">
              External Video Room: <code className="text-teal-900 font-semibold">{meeting.videoMeetingUrl}</code>
            </p>
          </div>

          {/* Back button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-clinical-200 px-4 py-2 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
