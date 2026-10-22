import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Activity,
  Stethoscope,
  Pill,
  FlaskConical,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Printer,
} from "lucide-react";
import { useHospitalData } from "../../hooks/useHospitalData.js";
import ConsultationPatientHeader from "./ConsultationPatientHeader.jsx";
import ChiefComplaintsModule from "./ChiefComplaintsModule.jsx";
import ClinicalObservationsModule from "./ClinicalObservationsModule.jsx";
import DiagnosisModule from "./DiagnosisModule.jsx";
import MedicationBuilderModule from "./MedicationBuilderModule.jsx";
import InvestigationsOrderModule from "./InvestigationsOrderModule.jsx";
import AdviceAndFollowUpModule from "./AdviceAndFollowUpModule.jsx";
import DigitalPrescriptionPreviewPane from "./DigitalPrescriptionPreviewPane.jsx";
import ConsultationRightPane from "./ConsultationRightPane.jsx";
import { generateId } from "../../utils/generateId.js";

const CLINICAL_SECTIONS = [
  { id: "sec-complaints", label: "Complaints", icon: FileText },
  { id: "sec-observations", label: "Examination", icon: Activity },
  { id: "sec-diagnosis", label: "Diagnosis", icon: Stethoscope },
  { id: "sec-medications", label: "Medications (Rx)", icon: Pill },
  { id: "sec-investigations", label: "Lab Orders", icon: FlaskConical },
  { id: "sec-advice", label: "Advice & Review", icon: Calendar },
];

export default function OpdConsultationWorkspace({
  patientId,
  onBackToQueue = () => {},
}) {
  const {
    patients = [],
    prescriptions = [],
    isLoading,
    savePrescription,
    sendToLabs,
    finalizePrescription,
  } = useHospitalData();

  // Find target patient, active in-consultation patient, or fallback
  const patient =
    patients.find((p) => p.id === patientId) ||
    patients.find((p) => p.queueStatus === "in_consultation") ||
    null;

  const activeId = patient ? patient.id : patientId;

  // Find existing prescription or generate default
  const existingRx = prescriptions.find((rx) => rx.patientId === activeId) || null;

  const [activeSection, setActiveSection] = useState("sec-complaints");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Clinical Rx Form State
  const [rxForm, setRxForm] = useState({
    id: "",
    patientId: patientId || "",
    status: "draft",
    chiefComplaints: [],
    clinicalObservations: "",
    diagnosis: { provisional: "", final: "", icd10Code: "" },
    medications: [],
    investigationsOrdered: [],
    dietaryAdvice: "",
    referrals: { department: "", doctorName: "", reason: "" },
    isAdmitRecommended: false,
    admitDetails: { priority: "Urgent", reason: "", ward: "General Ward" },
    followUp: { timeline: "1 Week", date: "", notes: "" },
    doctorDetails: {
      name: "Dr. Rajesh Sharma, MD",
      regNo: "NMC-48291",
      department: "General Medicine",
      room: "Room 104",
    },
  });

  // Populate state when existingRx is loaded or patient changes
  useEffect(() => {
    if (existingRx) {
      setRxForm({
        id: existingRx.id,
        patientId: existingRx.patientId,
        status: existingRx.status || "draft",
        chiefComplaints: existingRx.chiefComplaints || [],
        clinicalObservations: existingRx.clinicalObservations || "",
        diagnosis: existingRx.diagnosis || { provisional: "", final: "", icd10Code: "" },
        medications: existingRx.medications || [],
        investigationsOrdered: existingRx.investigationsOrdered || [],
        dietaryAdvice: existingRx.dietaryAdvice || "",
        referrals: existingRx.referrals || { department: "", doctorName: "", reason: "" },
        isAdmitRecommended: !!existingRx.isAdmitRecommended,
        admitDetails: existingRx.admitDetails || { priority: "Urgent", reason: "", ward: "General Ward" },
        followUp: existingRx.followUp || { timeline: "1 Week", date: "", notes: "" },
        doctorDetails: existingRx.doctorDetails || {
          name: "Dr. Rajesh Sharma, MD",
          regNo: "NMC-48291",
          department: "General Medicine",
          room: "Room 104",
        },
      });
    } else if (patient) {
      // Seed initial complaints from patient chiefComplaintSummary if present
      const initialComplaints = patient.chiefComplaintSummary
        ? [
            {
              id: generateId("cc"),
              complaint: patient.chiefComplaintSummary,
              duration: "3",
              durationUnit: "Days",
              severity: "Moderate",
              bodyPartId: "General",
            },
          ]
        : [];

      setRxForm((prev) => ({
        ...prev,
        patientId: patient.id,
        chiefComplaints: initialComplaints,
      }));
    }
  }, [existingRx?.id, patient?.id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Debounced Silent Autosave to Dexie.js (1500ms debounce)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!patient || !rxForm.patientId) return;

    setIsSaving(true);
    const timer = setTimeout(async () => {
      try {
        await savePrescription({
          ...rxForm,
          patientId: patient.id,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Autosave note:", err);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    rxForm.chiefComplaints,
    rxForm.clinicalObservations,
    rxForm.diagnosis,
    rxForm.medications,
    rxForm.investigationsOrdered,
    rxForm.dietaryAdvice,
    rxForm.followUp,
    rxForm.isAdmitRecommended,
    patient?.id,
  ]);

  // Global Keyboard Shortcuts (Ctrl+S to save, Ctrl+P to print)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S or Cmd+S -> Quick Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
      // Ctrl+P or Cmd+P -> Quick Print
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        if (rxForm.status === "finalized") {
          window.print();
        } else {
          showToast("Print is locked in Draft mode. Finalize prescription first.");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rxForm, patient]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Add complaint pinned from 2D Anatomical Body Map
  const handleAddComplaintFromMap = (newComplaint) => {
    setRxForm((prev) => {
      const exists = prev.chiefComplaints.some(
        (c) => c.bodyPartId === newComplaint.bodyPartId
      );
      if (exists) {
        return {
          ...prev,
          chiefComplaints: prev.chiefComplaints.map((c) =>
            c.bodyPartId === newComplaint.bodyPartId ? newComplaint : c
          ),
        };
      }
      return {
        ...prev,
        chiefComplaints: [...prev.chiefComplaints, newComplaint],
      };
    });
    showToast(`Pinned "${newComplaint.complaint}" to Chief Complaints.`);
  };

  // Remove complaint
  const handleRemoveComplaintFromMap = (complaintId) => {
    setRxForm((prev) => ({
      ...prev,
      chiefComplaints: prev.chiefComplaints.filter((c) => c.id !== complaintId),
    }));
  };

  // Apply template from AI Copilot (@vitals, @rx, @diet, @followup)
  const handleApplyTemplate = (section, payload) => {
    if (section === "observations") {
      setRxForm((prev) => ({
        ...prev,
        clinicalObservations: prev.clinicalObservations
          ? `${prev.clinicalObservations}\n${payload}`
          : payload,
      }));
      showToast("Vitals injected into Clinical Observations.");
    } else if (section === "medications") {
      setRxForm((prev) => ({
        ...prev,
        medications: [...prev.medications, ...payload],
      }));
      showToast("Medication kit added to Rx matrix.");
    } else if (section === "diet") {
      setRxForm((prev) => ({
        ...prev,
        dietaryAdvice: prev.dietaryAdvice
          ? `${prev.dietaryAdvice}\n${payload}`
          : payload,
      }));
      showToast("Dietary protocol updated.");
    } else if (section === "followup") {
      setRxForm((prev) => ({
        ...prev,
        followUp: { ...prev.followUp, ...payload },
      }));
      showToast("Review timeline updated.");
    }
  };

  // Save Draft Action
  const handleSaveDraft = async () => {
    if (!patient) return;
    setIsSaving(true);
    try {
      const rxToSave = {
        ...rxForm,
        patientId: patient.id,
        status: "draft",
        isFinalized: false,
      };
      const savedId = await savePrescription(rxToSave);
      setRxForm((prev) => ({ ...prev, id: savedId }));
      showToast("Draft prescription saved successfully.");
    } catch (err) {
      console.error("Failed to save draft:", err);
      showToast("Error saving draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Send to Labs Action
  const handleSendToLabs = async () => {
    if (!patient) return;
    setIsSaving(true);
    try {
      const rxToSave = {
        ...rxForm,
        patientId: patient.id,
        status: "awaiting_labs",
        isFinalized: false,
      };
      await savePrescription(rxToSave);
      await sendToLabs(patient.id, rxForm.investigationsOrdered);
      showToast(`Patient ${patient.name} sent to Lab Queue.`);
      setTimeout(() => {
        onBackToQueue();
      }, 1000);
    } catch (err) {
      console.error("Failed to send to labs:", err);
      showToast("Error updating lab status.");
    } finally {
      setIsSaving(false);
    }
  };

  // Finalize, Sign & Print Action
  const handleFinalizeAndPrint = async () => {
    if (!patient) return;
    setIsSaving(true);
    try {
      const rxToSave = {
        ...rxForm,
        patientId: patient.id,
        status: "finalized",
        isFinalized: true,
      };
      await savePrescription(rxToSave);
      await finalizePrescription(patient.id, rxToSave);
      showToast(`Prescription for ${patient.name} finalized and digitally signed.`);

      // Open print dialog
      setTimeout(() => {
        window.print();
      }, 400);

      // Offer smooth navigation back after print
      setTimeout(() => {
        onBackToQueue();
      }, 2500);
    } catch (err) {
      console.error("Failed to finalize prescription:", err);
      showToast("Error finalizing prescription.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || (!patient && patients.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading consultation room...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Patient Selected</h2>
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">
          Please select a waiting patient or active consultation from the OPD Queue.
        </p>
        <button
          onClick={onBackToQueue}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
        >
          Return to OPD Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 text-slate-900">
      {/* 1. Header Banner with Autosave & Mandatory Checklist */}
      <div className="shrink-0 print:hidden">
        <ConsultationPatientHeader
          patient={patient}
          rxForm={rxForm}
          prescriptionStatus={rxForm.status}
          onBackToQueue={onBackToQueue}
          onSaveDraft={handleSaveDraft}
          onJumpToSection={scrollToSection}
          isSaving={isSaving}
        />
      </div>

      {/* 2. Split Dual-Pane Consultation Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANE (50% on desktop): Clinical Data Entry Form */}
        <div className="w-full lg:w-1/2 flex flex-col h-full border-r border-slate-200 bg-white/60 print:hidden">
          {/* Quick-Jump Section Navigator Pills */}
          <div className="px-4 py-2 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {CLINICAL_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-teal-700 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Form Modules */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {/* Section 1: Chief Complaints */}
            <div id="sec-complaints">
              <ChiefComplaintsModule
                complaints={rxForm.chiefComplaints}
                onChange={(updated) =>
                  setRxForm((prev) => ({ ...prev, chiefComplaints: updated }))
                }
              />
            </div>

            {/* Section 2: Clinical Examination & Observations */}
            <div id="sec-observations">
              <ClinicalObservationsModule
                observations={rxForm.clinicalObservations}
                onChange={(updated) =>
                  setRxForm((prev) => ({ ...prev, clinicalObservations: updated }))
                }
              />
            </div>

            {/* Section 3: Clinical Diagnosis */}
            <div id="sec-diagnosis">
              <DiagnosisModule
                diagnosis={rxForm.diagnosis}
                onChange={(updated) =>
                  setRxForm((prev) => ({ ...prev, diagnosis: updated }))
                }
              />
            </div>

            {/* Section 4: Medication Builder (Rx) */}
            <div id="sec-medications">
              <MedicationBuilderModule
                medications={rxForm.medications}
                onChange={(updated) =>
                  setRxForm((prev) => ({ ...prev, medications: updated }))
                }
              />
            </div>

            {/* Section 5: Lab & Diagnostic Investigations */}
            <div id="sec-investigations">
              <InvestigationsOrderModule
                investigations={rxForm.investigationsOrdered}
                onChange={(updated) =>
                  setRxForm((prev) => ({ ...prev, investigationsOrdered: updated }))
                }
              />
            </div>

            {/* Section 6: Dietary Advice, Referral, IPD Admission & Follow-Up */}
            <div id="sec-advice">
              <AdviceAndFollowUpModule
                dietaryAdvice={rxForm.dietaryAdvice}
                referrals={rxForm.referrals}
                isAdmitRecommended={rxForm.isAdmitRecommended}
                admitDetails={rxForm.admitDetails}
                followUp={rxForm.followUp}
                onChange={(updated) => setRxForm((prev) => ({ ...prev, ...updated }))}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANE (50% on desktop): AI Copilot, 2D Body Map & Paper Preview */}
        <div className="w-full lg:w-1/2 flex flex-col h-full bg-slate-100">
          <ConsultationRightPane
            patient={patient}
            prescription={rxForm}
            isSaving={isSaving}
            onSaveDraft={handleSaveDraft}
            onSendToLab={handleSendToLabs}
            onFinalizeAndPrint={handleFinalizeAndPrint}
            onAddComplaint={handleAddComplaintFromMap}
            onRemoveComplaint={handleRemoveComplaintFromMap}
            onApplyTemplate={handleApplyTemplate}
          />
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
