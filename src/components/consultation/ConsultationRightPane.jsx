import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Video,
  Activity,
  Bot,
  Layers,
  Printer,
} from "lucide-react";
import TelehealthVideoDock from "./TelehealthVideoDock.jsx";
import AnatomicalBodyMap from "./AnatomicalBodyMap.jsx";
import AiCdssAlertCard from "./AiCdssAlertCard.jsx";
import AiCopilotPanel from "./AiCopilotPanel.jsx";
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
  // Tabs: 'copilot' | 'preview'
  const [activeTab, setActiveTab] = useState("copilot");
  const [showVideo, setShowVideo] = useState(
    patient?.consultationType === "tele_consultation"
  );

  return (
    <div className="flex flex-col h-full bg-slate-100/90 border-l border-slate-200">
      {/* Right Pane Navigation Header */}
      <div className="px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0">
        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("copilot")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "copilot"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Copilot & Visuals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "preview"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>A4 Paper Preview</span>
          </button>
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
        {activeTab === "copilot" ? (
          <div className="p-4 space-y-4">
            {/* 1. Telehealth Video Dock (Collapsible / Toggleable) */}
            {showVideo && (
              <TelehealthVideoDock
                patient={patient}
                onEndCall={() => setShowVideo(false)}
              />
            )}

            {/* 2. Real-Time AI CDSS Alert Card */}
            <AiCdssAlertCard
              patient={patient}
              medications={prescription.medications}
            />

            {/* 3. Interactive 2D Anatomical Body Map (Hidden as requested for now) */}
            {/* <AnatomicalBodyMap
              activeComplaints={prescription.chiefComplaints}
              onAddComplaint={onAddComplaint}
              onRemoveComplaint={onRemoveComplaint}
            /> */}

            {/* Live A4 Prescription Preview Sheet */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-2 px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Live Prescription Sheet
                </span>
                <span className="text-[11px] text-slate-400">
                  AI Copilot is floating in bottom corner
                </span>
              </div>
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
        ) : (
          /* Live Printable A4 Prescription Preview Pane */
          <DigitalPrescriptionPreviewPane
            patient={patient}
            prescription={prescription}
            isSaving={isSaving}
            onSaveDraft={onSaveDraft}
            onSendToLab={onSendToLab}
            onFinalizeAndPrint={onFinalizeAndPrint}
          />
        )}
      </div>
    </div>
  );
}
