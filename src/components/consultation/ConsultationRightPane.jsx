import React, { useState } from "react";
import {
  FileText,
  Video,
} from "lucide-react";
import TelehealthVideoDock from "./TelehealthVideoDock.jsx";
import DigitalPrescriptionPreviewPane from "./DigitalPrescriptionPreviewPane.jsx";

export default function ConsultationRightPane({
  patient,
  prescription,
  isSaving,
  onSaveDraft = () => {},
  onSendToLab = () => {},
  onFinalizeAndPrint = () => {},
  onAddComplaint = () => {},
  onRemoveComplaint = () => {},
  onApplyTemplate = () => {},
}) {
  // Tabs: 'preview' (AI Copilot tab hidden for now per user request)
  const [activeTab, setActiveTab] = useState("preview");
  const [showVideo, setShowVideo] = useState(
    patient?.consultationType === "tele_consultation"
  );

  return (
    <div className="flex flex-col h-full bg-slate-100/90 border-l border-slate-200">
      {/* Right Pane Navigation Header */}
      <div className="px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0">
        {/* Title Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <FileText className="w-4 h-4 text-teal-600" />
          <span>Prescription Print Preview</span>
        </div>

        {/* Video Toggle Shortcut */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowVideo(!showVideo)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showVideo
                ? "bg-teal-50 border-teal-300 text-teal-800 shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            title="Toggle Tele-Consultation Video Window"
          >
            <Video className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">
              {showVideo ? "Hide Video" : "Tele-Video"}
            </span>
          </button>
        </div>
      </div>

      {/* Pane Content Body */}
      <div className="flex-1 overflow-y-auto">
        {showVideo && (
          <div className="p-4 pb-0">
            <TelehealthVideoDock
              patient={patient}
              onEndCall={() => setShowVideo(false)}
            />
          </div>
        )}

        {/* Live Printable A4 Prescription Preview Pane */}
        <DigitalPrescriptionPreviewPane
          patient={patient}
          prescription={prescription}
          isSaving={isSaving}
          onSaveDraft={onSaveDraft}
          onSendToLab={onSendToLab}
          onFinalizeAndPrint={onFinalizeAndPrint}
        />
      </div>
    </div>
  );
}
