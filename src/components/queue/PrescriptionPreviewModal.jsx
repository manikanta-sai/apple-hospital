import React, { useEffect } from "react";
import { X } from "lucide-react";
import DigitalPrescriptionPreviewPane from "../consultation/DigitalPrescriptionPreviewPane.jsx";

/**
 * PrescriptionPreviewModal
 * -------------------------
 * Renders the fully-featured clinical print preview (Handwritten, Classic, Letterhead, Compact)
 * in sync with the OPD Consultation Print Preview Pane.
 */
export default function PrescriptionPreviewModal({
  isOpen = false,
  onClose = () => {},
  patient = null,
  prescription = null,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !patient) return null;

  // Synthesize complete prescription payload from prescription object or patient data
  const rxData = {
    ...(prescription || {}),
    status: prescription?.status || "finalized",
    vitals: prescription?.vitals || patient.vitals || {},
    allergies: prescription?.allergies || patient.allergies || ["NKDA"],
    chiefComplaints:
      prescription?.chiefComplaints && prescription.chiefComplaints.length > 0
        ? prescription.chiefComplaints
        : patient.chiefComplaintSummary
        ? [
            {
              complaint: patient.chiefComplaintSummary,
              duration: "3",
              durationUnit: "Days",
              severity: "Moderate",
            },
          ]
        : [],
    diagnosis:
      prescription?.diagnosis ||
      (patient.diagnosis
        ? { provisional: patient.diagnosis, final: patient.diagnosis, icd10Code: "R11.0" }
        : {}),
    medications: prescription?.medications || [],
    investigationsOrdered: prescription?.investigationsOrdered || [],
    dietaryAdvice: prescription?.dietaryAdvice || "",
    followUp: prescription?.followUp || { timeline: "1 Week" },
    doctorDetails: prescription?.doctorDetails || {
      name: "Dr. Rajesh Sharma, MD",
      regNo: "NMC-48291",
      department: "General Medicine",
      room: "Room 104",
    },
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in print:bg-transparent print:p-0 print:static print:block"
      onClick={onClose}
    >
      <div
        className="bg-slate-100 rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] relative print:border-none print:shadow-none print:bg-transparent print:max-h-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm text-white">
              Official Outpatient Prescription • {patient.name} ({patient.tokenNumber || patient.uhid})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Prescription Preview Pane with full print preview features */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50 print:bg-transparent print:overflow-visible">
          <DigitalPrescriptionPreviewPane
            patient={patient}
            prescription={rxData}
            isSaving={false}
            onSaveDraft={() => {}}
            onSendToLab={() => {}}
            onFinalizeAndPrint={() => window.print()}
          />
        </div>
      </div>
    </div>
  );
}
