import React, { useState } from "react";
import {
  Stethoscope,
  Video,
  Clock,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  RotateCcw,
  Printer,
  Footprints,
  Globe,
  User,
} from "lucide-react";

/**
 * PatientQueueCard (Streamlined & Clean)
 * --------------------------------------
 * Displays strictly:
 * 1. Token Number
 * 2. Consultation Type (Walk-in, Online Booking, Tele-Consult)
 * 3. Status (Waiting, Sent for Labs, Completed, No-Show)
 * 4. Patient Details (Name, Age, Gender, UHID)
 * 5. Primary action button & status menu (with No-Show option)
 */
export default function PatientQueueCard({
  patient,
  prescription = null,
  onStartConsultation = () => {},
  onResumeDraft = () => {},
  onViewPrescription = () => {},
  onStatusChange = () => {},
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const {
    id,
    name,
    age,
    gender,
    uhid,
    tokenNumber,
    queueStatus,
    consultationType,
    scheduledTime,
  } = patient;

  // Consultation Type badge
  const getConsultationTypeBadge = () => {
    switch (consultationType) {
      case "tele_consultation":
        return {
          label: "Tele-Consult",
          icon: Video,
          style: "bg-purple-50 text-purple-900 border-purple-200",
        };
      case "online_booking":
        return {
          label: "Online Booking",
          icon: Globe,
          style: "bg-sky-50 text-sky-900 border-sky-200",
        };
      case "walk_in":
      default:
        return {
          label: "Walk-in",
          icon: Footprints,
          style: "bg-teal-50 text-teal-900 border-teal-200",
        };
    }
  };

  // Status badge
  const getStatusBadge = () => {
    switch (queueStatus) {
      case "in_consultation":
        return {
          label: "In Consultation",
          style: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "draft_labs":
        return {
          label: "Sent for Labs",
          style: "bg-indigo-50 text-indigo-800 border-indigo-200",
        };
      case "completed":
        return {
          label: "Completed",
          style: "bg-slate-100 text-slate-800 border-slate-200",
        };
      case "cancelled":
      case "no_show":
        return {
          label: "No-Show",
          style: "bg-rose-50 text-rose-800 border-rose-200",
        };
      case "waiting":
      default:
        return {
          label: "Waiting",
          style: "bg-amber-50 text-amber-800 border-amber-200",
        };
    }
  };

  const typeBadge = getConsultationTypeBadge();
  const TypeIcon = typeBadge.icon;
  const statusBadge = getStatusBadge();

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.90)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
      className="p-3.5 hover:border-sky-300 hover:shadow-md transition-all duration-150 flex flex-col justify-between gap-2.5 group relative"
    >
      {/* 1. Top Row: Token, Consultation Type, Status, 3-Dots Menu */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Token */}
          <span className="px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs border shadow-2xs bg-slate-900 text-white border-slate-800">
            {tokenNumber}
          </span>

          {/* Consultation Type */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${typeBadge.style}`}
          >
            <TypeIcon className="w-3 h-3" />
            <span>{typeBadge.label}</span>
          </span>

          {/* Status */}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusBadge.style}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* 3-Dots Status Menu */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Update patient status"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showStatusMenu && (
            <div
              className="absolute right-0 top-7 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 text-xs text-slate-700 animate-pop-in"
              onMouseLeave={() => setShowStatusMenu(false)}
            >
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Change Patient Status
              </div>
              <button
                onClick={() => {
                  onStatusChange(id, "waiting");
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Move to Waiting</span>
              </button>
              <button
                onClick={() => {
                  onStartConsultation(id);
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-teal-50 text-teal-800 font-medium flex items-center gap-1.5"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Call to Active Desk</span>
              </button>
              <button
                onClick={() => {
                  onStatusChange(id, "draft_labs");
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-indigo-800 flex items-center gap-1.5"
              >
                <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                <span>Send to Labs (Draft)</span>
              </button>
              <button
                onClick={() => {
                  onStatusChange(id, "completed");
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-800 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark Completed</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  onStatusChange(id, "cancelled");
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-700 font-medium flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Mark as No-Show / Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Patient Details: Name, Age, Gender, UHID */}
      <div>
        <h4 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
          {name}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
          <span>{age} yrs</span>
          <span>•</span>
          <span>{gender}</span>
          <span>•</span>
          <span className="font-mono text-[11px] text-slate-500 font-semibold">
            UHID: {uhid}
          </span>
          {scheduledTime && (
            <>
              <span>•</span>
              <span className="text-[11px] text-sky-700 font-semibold">
                Slot: {scheduledTime}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 3. Primary Action Button */}
      <div className="pt-1 border-t border-slate-100">
        {queueStatus === "waiting" && consultationType === "tele_consultation" && (
          <button
            onClick={() => onStartConsultation(id)}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Start Video Consult</span>
          </button>
        )}

        {queueStatus === "waiting" && consultationType !== "tele_consultation" && (
          <button
            onClick={() => onStartConsultation(id)}
            className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Call / Start Consultation</span>
          </button>
        )}

        {queueStatus === "draft_labs" && (
          <button
            onClick={() => onResumeDraft(id)}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Resume Lab Review</span>
          </button>
        )}

        {queueStatus === "completed" && (
          <button
            onClick={() => onViewPrescription(patient, prescription)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>View / Print Prescription</span>
          </button>
        )}

        {(queueStatus === "cancelled" || queueStatus === "no_show") && (
          <button
            onClick={() => onStatusChange(id, "waiting")}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Re-admit to Queue</span>
          </button>
        )}
      </div>
    </div>
  );
}
