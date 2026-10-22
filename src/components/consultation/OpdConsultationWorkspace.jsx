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
  HeartPulse,
  ShieldAlert,
  PanelLeftOpen,
  PanelLeftClose,
  Save,
  ArrowRight,
  ChevronDown,
  Video,
} from "lucide-react";
import { useHospitalData } from "../../hooks/useHospitalData.js";
import ConsultationPatientHeader from "./ConsultationPatientHeader.jsx";
import ChiefComplaintsModule from "./ChiefComplaintsModule.jsx";
import VitalsEntryModule from "./VitalsEntryModule.jsx";
import AllergiesEntryModule from "./AllergiesEntryModule.jsx";
import ClinicalObservationsModule from "./ClinicalObservationsModule.jsx";
import DiagnosisModule from "./DiagnosisModule.jsx";
import MedicationBuilderModule from "./MedicationBuilderModule.jsx";
import InvestigationsOrderModule from "./InvestigationsOrderModule.jsx";
import AdviceAndFollowUpModule, {
  DietaryAdviceModule,
  FollowUpPlanModule,
  ReferralsAndIpdModule,
} from "./AdviceAndFollowUpModule.jsx";
import DigitalPrescriptionPreviewPane from "./DigitalPrescriptionPreviewPane.jsx";
import TelehealthVideoDock from "./TelehealthVideoDock.jsx";
import AiCopilotPanel from "./AiCopilotPanel.jsx";
import PrescriptionSectionTree from "./PrescriptionSectionTree.jsx";
import AiCdssAlertCard from "./AiCdssAlertCard.jsx";
import { generateId } from "../../utils/generateId.js";

const CLINICAL_SECTIONS = [
  { id: "sec-complaints", label: "Complaints", icon: FileText },
  { id: "sec-vitals", label: "Vitals", icon: HeartPulse },
  { id: "sec-allergies", label: "Allergies", icon: ShieldAlert },
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
    updatePatient,
    updatePatientVitals,
  } = useHospitalData();

  // Find target patient, active in-consultation patient, or fallback
  const patient =
    patients.find((p) => p.id === patientId) ||
    patients.find((p) => p.uhid === patientId || p.uhid?.toLowerCase() === patientId?.toLowerCase()) ||
    patients.find((p) => p.tokenNumber === patientId) ||
    patients.find((p) => p.id === "pat_10482") ||
    patients.find((p) => p.queueStatus === "in_consultation") ||
    patients.find((p) => p.queueStatus === "waiting") ||
    (patients.length > 0 ? patients[0] : null);

  const activeId = patient ? patient.id : patientId || "pat_10482";

  // Find existing prescription or generate default
  const existingRx = prescriptions.find((rx) => rx.patientId === activeId) || null;

  const [activeSection, setActiveSection] = useState("sec-complaints");
  const [leftPanelStep, setLeftPanelStep] = useState("prescription"); // 'prescription' | 'copilot' | 'preview'
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const prescriptionScrollRef = useRef(null);
  const isManualScrollingRef = useRef(false);

  const isTelehealth =
    patient?.consultationType === "tele_consultation" ||
    patient?.tokenNumber?.startsWith("TC");

  const [showVideoDock, setShowVideoDock] = useState(false);

  useEffect(() => {
    if (patient?.consultationType === "tele_consultation" || patient?.tokenNumber?.startsWith("TC")) {
      setShowVideoDock(true);
    }
  }, [patient?.id, patient?.consultationType, patient?.tokenNumber]);

  // Clinical Rx Form State
  const [rxForm, setRxForm] = useState({
    id: "",
    patientId: patientId || "",
    status: "draft",
    chiefComplaints: [],
    vitals: {
      bp: "120/80",
      pulse: "76",
      temp: "98.6",
      spo2: "99",
      respiratoryRate: "18",
      height: "165",
      weight: "64",
      bmi: "23.5",
      bloodGlucose: "",
      notes: "",
    },
    allergies: ["NKDA"],
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
        vitals: existingRx.vitals || patient?.vitals || {
          bp: "120/80",
          pulse: "76",
          temp: "98.6",
          spo2: "99",
          respiratoryRate: "18",
          height: "165",
          weight: "64",
          bmi: "23.5",
          bloodGlucose: "",
          notes: "",
        },
        allergies: existingRx.allergies || patient?.allergies || ["NKDA"],
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
        vitals: patient.vitals || prev.vitals,
        allergies: patient.allergies || prev.allergies,
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

  // Real-time Scrollspy observer for prescription sections
  useEffect(() => {
    if (leftPanelStep !== "prescription") return;

    const sectionIds = [
      "sec-complaints",
      "sec-vitals",
      "sec-allergies",
      "sec-observations",
      "sec-diagnosis",
      "sec-medications",
      "sec-investigations",
      "sec-dietary",
      "sec-followup",
      "sec-referrals",
      "sec-submission",
    ];

    const handleScroll = () => {
      if (isManualScrollingRef.current) return;

      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active when near top of viewport (offset 160px for sticky header)
          if (rect.top <= 160) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const scrollContainer = prescriptionScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [leftPanelStep]);

  // Smooth Anchor Navigation with visual highlight pulse
  const scrollToSection = (id) => {
    setActiveSection(id);
    isManualScrollingRef.current = true;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Add brief focus highlight flash
      element.classList.add("ring-4", "ring-teal-400", "ring-offset-2");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-teal-400", "ring-offset-2");
      }, 1200);
    }
    setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 800);
  };

  // Save & Next Section navigation with auto-scroll
  const handleSaveAndNext = (nextSectionId) => {
    handleSaveDraft();
    scrollToSection(nextSectionId);
  };

  // Update vitals with patient & prescription synchronization
  const handleUpdateVitals = useCallback(
    async (updatedVitals) => {
      setRxForm((prev) => ({ ...prev, vitals: updatedVitals }));
      if (patient?.id) {
        try {
          await updatePatientVitals(patient.id, updatedVitals);
        } catch (e) {
          console.warn("Could not sync vitals to patient in DB:", e);
        }
      }
    },
    [patient?.id, updatePatientVitals]
  );

  // Update allergies with patient & prescription synchronization
  const handleUpdateAllergies = useCallback(
    async (updatedAllergies) => {
      setRxForm((prev) => ({ ...prev, allergies: updatedAllergies }));
      if (patient?.id) {
        try {
          const stringList = updatedAllergies.map((a) =>
            typeof a === "string" ? a : a.name
          );
          await updatePatient(patient.id, { allergies: stringList });
        } catch (e) {
          console.warn("Could not sync allergies to patient in DB:", e);
        }
      }
    },
    [patient?.id, updatePatient]
  );

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

    if (!isMandatoryComplete) {
      const missing = [];
      if (!isComplaintsFilled) missing.push("Chief Complaints");
      if (!isDiagnosisFilled) missing.push("Diagnosis");
      if (!isMedicationsFilled) missing.push("Medications");
      if (!isFollowUpFilled) missing.push("Follow-up");
      showToast(`Cannot Finalize: Please complete mandatory sections (${missing.join(", ")}).`);
      return;
    }

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

      // Switch to Step 3: Print Preview before opening print dialog
      setLeftPanelStep("preview");

      // Open print dialog
      setTimeout(() => {
        window.print();
      }, 500);

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

  // Mandatory fields completion status for full prescription
  const isDiagnosisFilled = !!(rxForm.diagnosis?.provisional?.trim() || rxForm.diagnosis?.final?.trim());
  const isComplaintsFilled = (rxForm.chiefComplaints || []).length > 0;
  const isMedicationsFilled = (rxForm.medications || []).length > 0;
  const isFollowUpFilled = !!(rxForm.followUp?.timeline || rxForm.followUp?.date);
  const isMandatoryComplete = isDiagnosisFilled && isComplaintsFilled && isMedicationsFilled && isFollowUpFilled;

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col">
      {/* 1. Header Banner with Demographics, Autosave & Compact 3-Step Switcher */}
      <header className="print:hidden">
        <ConsultationPatientHeader
          patient={patient}
          rxForm={rxForm}
          prescriptionStatus={rxForm.status}
          leftPanelStep={leftPanelStep}
          setLeftPanelStep={setLeftPanelStep}
          onBackToQueue={onBackToQueue}
          onSaveDraft={handleSaveDraft}
          onFinalize={handleFinalizeAndPrint}
          isMandatoryComplete={isMandatoryComplete}
          showVideoDock={showVideoDock}
          onToggleVideoDock={setShowVideoDock}
          onJumpToSection={scrollToSection}
          isSaving={isSaving}
        />
      </header>

      {/* 2. Main Consultation Body Content (Compact Spacing) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
        {/* STEP 1: Prescription with Section Names Tree */}
        {leftPanelStep === "prescription" && (
          <div className="flex items-start gap-4 xl:gap-6 relative">
            {/* Left Overview Sticky Panel with Merged NABH Checklist & Scrollspy */}
            <div className="sticky top-4 self-start shrink-0 z-30">
              <PrescriptionSectionTree
                rxForm={rxForm}
                patient={patient}
                activeSection={activeSection}
                onSelectSection={scrollToSection}
                isOpen={isOverviewOpen}
                onToggleOpen={() => setIsOverviewOpen((prev) => !prev)}
              />
            </div>

            {/* Form Modules with Colorful Clinical Section Cards */}
            <div
              ref={prescriptionScrollRef}
              className="flex-1 min-w-0 space-y-6"
            >
              {/* Floating pill to reopen overview if closed */}
              {!isOverviewOpen && (
                <div className="sticky top-4 z-25 flex items-center justify-between p-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-teal-200 shadow-sm mb-2">
                  <button
                    type="button"
                    onClick={() => setIsOverviewOpen(true)}
                    className="flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <PanelLeftOpen size={15} />
                    <span>Open Prescription Overview & NABH Checklist</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-500">
                    Active: <span className="font-bold text-teal-700 capitalize">{activeSection.replace("sec-", "")}</span>
                  </span>
                </div>
              )}

                {/* Section 1: Chief Complaints (Teal Theme) */}
                <div
                  id="sec-complaints"
                  style={{ zIndex: 40 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-teal-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-teal-50 border-b border-teal-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        1
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-teal-950">Chief Complaints</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300 font-mono">
                            NABH Mandatory
                          </span>
                        </div>
                        <p className="text-[11px] text-teal-700/80">Primary symptoms, duration, onset, and severity profile</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-100/70 text-teal-900 border border-teal-200">
                      {(rxForm.chiefComplaints || []).length} Recorded
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <ChiefComplaintsModule
                      complaints={rxForm.chiefComplaints}
                      onChange={(updated) =>
                        setRxForm((prev) => ({ ...prev, chiefComplaints: updated }))
                      }
                      hideHeader={true}
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-vitals")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 2: Vitals & Biometrics (Rose Theme) */}
                <div
                  id="sec-vitals"
                  style={{ zIndex: 38 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-rose-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-rose-50 border-b border-rose-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        2
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-rose-950">Vitals & Biometric Parameters</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-mono">
                            NABH Mandatory
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-700/80">Blood pressure, heart rate, temperature, SpO2, and BMI monitoring</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-100/70 text-rose-900 border border-rose-200">
                      BP: {rxForm.vitals?.bp || "Pending"}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <VitalsEntryModule
                      vitals={rxForm.vitals}
                      patient={patient}
                      onChange={handleUpdateVitals}
                      hideHeader={true}
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-allergies")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 3: Allergies & ADR (Amber Theme) */}
                <div
                  id="sec-allergies"
                  style={{ zIndex: 36 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-amber-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-amber-50 border-b border-amber-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        3
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-amber-950">Allergies & Adverse Drug Reactions (ADR)</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                            NABH Mandatory
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-700/80">Medication contraindication screening and allergens</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-100/70 text-amber-900 border border-amber-200">
                      {(rxForm.allergies || []).length} Logged
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <AllergiesEntryModule
                      allergies={rxForm.allergies}
                      patient={patient}
                      onChange={handleUpdateAllergies}
                      hideHeader={true}
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-observations")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 4: Clinical Examination & Observations (Sky Theme) */}
                <div
                  id="sec-observations"
                  style={{ zIndex: 34 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-sky-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-sky-50 border-b border-sky-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        4
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-sky-950">Clinical Examination & Systemic Observations</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300 font-mono">
                            Clinical Notes
                          </span>
                        </div>
                        <p className="text-[11px] text-sky-700/80">General physical condition, systemic examination, and doctor notes</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <ClinicalObservationsModule
                      observations={rxForm.clinicalObservations}
                      onChange={(updated) =>
                        setRxForm((prev) => ({ ...prev, clinicalObservations: updated }))
                      }
                      hideHeader={true}
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-diagnosis")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 5: Clinical Diagnosis (Purple Theme) */}
                <div
                  id="sec-diagnosis"
                  style={{ zIndex: 32 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-purple-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-purple-50 border-b border-purple-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        5
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-purple-950">Clinical Diagnosis (ICD-10 Codification)</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 font-mono">
                            NABH Mandatory
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-700/80">Provisional diagnosis, differential assessment, and WHO ICD-10 codes</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-100/70 text-purple-900 border border-purple-200">
                      {rxForm.diagnosis?.final || rxForm.diagnosis?.provisional ? "Diagnosed" : "Pending"}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <DiagnosisModule
                      diagnosis={rxForm.diagnosis}
                      onChange={(updated) =>
                        setRxForm((prev) => ({ ...prev, diagnosis: updated }))
                      }
                      hideHeader={true}
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-medications")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 6: Medication Builder (Emerald Theme) */}
                <div
                  id="sec-medications"
                  style={{ zIndex: 30 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-emerald-300/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-emerald-50 border-b border-emerald-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        6
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-emerald-950">Medications Matrix Prescribed (℞)</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                            NABH Mandatory
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700/80">Standard pharmacopeia dosing, timing, frequency, and total unit calculation</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-900 border border-emerald-200">
                      {(rxForm.medications || []).length} Prescribed
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <MedicationBuilderModule
                      medications={rxForm.medications}
                      onChange={(updated) =>
                        setRxForm((prev) => ({ ...prev, medications: updated }))
                      }
                      hideHeader={true}
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-investigations")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 7: Lab & Diagnostic Investigations (Indigo Theme) */}
                <div
                  id="sec-investigations"
                  style={{ zIndex: 28 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-indigo-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-indigo-50 border-b border-indigo-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        7
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-indigo-950">Diagnostic Lab & Radiology Investigations</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 font-mono">
                            Requisition Order
                          </span>
                        </div>
                        <p className="text-[11px] text-indigo-700/80">Blood tests, urine analytics, imaging scans, and cardiology panels</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-100/70 text-indigo-900 border border-indigo-200">
                      {(rxForm.investigationsOrdered || []).length} Ordered
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <InvestigationsOrderModule
                      investigations={rxForm.investigationsOrdered}
                      onChange={(updated) =>
                        setRxForm((prev) => ({ ...prev, investigationsOrdered: updated }))
                      }
                      hideHeader={true}
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-dietary")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 8: Dietary & Lifestyle Advice (Amber Theme - Separate Section) */}
                <div
                  id="sec-dietary"
                  style={{ zIndex: 26 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-amber-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-amber-50 border-b border-amber-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        8
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-amber-950">Dietary & Lifestyle Advice</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                            Patient Instructions
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-700/80">Patient care instructions, dietary precautions, and hydration guidance</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-100/70 text-amber-900 border border-amber-200">
                      {(rxForm.dietaryAdvice || "").trim() ? "Documented" : "Optional"}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <DietaryAdviceModule
                      dietaryAdvice={rxForm.dietaryAdvice}
                      onChange={(updatedDiet) =>
                        setRxForm((prev) => ({ ...prev, dietaryAdvice: updatedDiet }))
                      }
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-followup")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 9: Follow-Up & Review Plan (Fuchsia Theme - Separate Section) */}
                <div
                  id="sec-followup"
                  style={{ zIndex: 24 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-fuchsia-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-fuchsia-50 border-b border-fuchsia-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-fuchsia-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        9
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-fuchsia-950">Follow-Up & Review Plan</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-300 font-mono">
                            NABH Mandatory
                          </span>
                        </div>
                        <p className="text-[11px] text-fuchsia-700/80">Next scheduled visit timeline, emergency SOS warnings, and repeat tests</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-fuchsia-100/70 text-fuchsia-900 border border-fuchsia-200">
                      Review: {rxForm.followUp?.timeline || "Pending"}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <FollowUpPlanModule
                      followUp={rxForm.followUp}
                      onChange={(updatedFollowUp) =>
                        setRxForm((prev) => ({ ...prev, followUp: updatedFollowUp }))
                      }
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-referrals")}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Section 10: Specialist Referrals & Hospital IPD Admission (Blue Theme - Separate Section) */}
                <div
                  id="sec-referrals"
                  style={{ zIndex: 22 }}
                  className="scroll-mt-4 rounded-2xl border-2 border-blue-200/90 bg-white shadow-xs relative overflow-visible"
                >
                  <div className="sticky top-0 z-20 px-4 py-3 bg-blue-50 border-b border-blue-200 rounded-t-xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        10
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-blue-950">Specialist Referrals & Hospital IPD Admission</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-mono">
                            Cross-Consultation
                          </span>
                        </div>
                        <p className="text-[11px] text-blue-700/80">Inter-department transfers, specialist referral reasons, and IPD ward bed requests</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-100/70 text-blue-900 border border-blue-200">
                      {rxForm.isAdmitRecommended ? "Admit Req" : rxForm.referrals?.department ? rxForm.referrals.department : "Outpatient"}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 pt-3">
                    <ReferralsAndIpdModule
                      referrals={rxForm.referrals}
                      isAdmitRecommended={rxForm.isAdmitRecommended}
                      admitDetails={rxForm.admitDetails}
                      onChange={(updatedRefAdmit) =>
                        setRxForm((prev) => ({ ...prev, ...updatedRefAdmit }))
                      }
                    />
                  </div>
                  {/* Section Bottom Nav: Save & Next -> scrolls down to Submission Desk */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Autosaved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveAndNext("sec-submission")}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Save & Next</span>
                      <ChevronDown size={14} className="text-teal-700" />
                    </button>
                  </div>
                </div>

                {/* Full OPD Prescription Submission & Action Desk */}
                <div id="sec-submission" className="scroll-mt-4 rounded-2xl border-2 border-teal-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
                        <h4 className="font-bold text-base text-slate-900">
                          Full OPD Prescription Submission Desk
                        </h4>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                          Full Save (All 10 Sections Combined)
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                        <strong>All 10 sections are unified into a single comprehensive OPD prescription.</strong> You do not need to save each section individually. All changes automatically sync to local database in real-time.
                      </p>
                    </div>

                    {/* Quick mandatory indicators */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold flex-wrap">
                      <span className={`px-2.5 py-1 rounded-lg border ${isComplaintsFilled ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {isComplaintsFilled ? "✓ Complaints" : "○ Complaints"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg border ${isDiagnosisFilled ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {isDiagnosisFilled ? "✓ Diagnosis" : "○ Diagnosis"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg border ${isMedicationsFilled ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {isMedicationsFilled ? "✓ Medications" : "○ Medications"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg border ${isFollowUpFilled ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {isFollowUpFilled ? "✓ Follow-up" : "○ Follow-up"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Save entire draft prescription (Ctrl+S)"
                      >
                        <Save size={14} className="text-slate-600" />
                        <span>Save Full Draft (Ctrl+S)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSendToLabs}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Save draft and send patient to diagnostic lab queue"
                      >
                        <FlaskConical size={14} className="text-indigo-600" />
                        <span>Send to Labs</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLeftPanelStep("preview")}
                        className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Switch to Step 3: Print Preview"
                      >
                        <FileText size={14} />
                        <span>Step 3: Print Preview</span>
                        <ArrowRight size={13} />
                      </button>

                      {isMandatoryComplete ? (
                        <button
                          type="button"
                          onClick={handleFinalizeAndPrint}
                          disabled={isSaving}
                          className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer animate-fade-in"
                          title="Digitally sign and finalize full OPD prescription"
                        >
                          <CheckCircle2 size={16} />
                          <span>Finalize, Sign & Submit Rx</span>
                        </button>
                      ) : (
                        <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-1.5">
                          <AlertCircle size={14} className="text-amber-600 shrink-0" />
                          <span>Complete 4 required sections to unlock Finalize</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AI Copilot & Visuals */}
          {leftPanelStep === "copilot" && (
            <div className="space-y-4 max-w-4xl mx-auto w-full">
              <AiCdssAlertCard
                patient={patient}
                medications={rxForm.medications}
              />
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <AiCopilotPanel
                  patient={patient}
                  rxForm={rxForm}
                  onApplyTemplate={handleApplyTemplate}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Print Preview */}
          {leftPanelStep === "preview" && (
            <div className="max-w-4xl mx-auto w-full">
              <DigitalPrescriptionPreviewPane
                patient={patient}
                prescription={rxForm}
                isSaving={isSaving}
                onSaveDraft={handleSaveDraft}
                onSendToLab={handleSendToLabs}
                onFinalizeAndPrint={handleFinalizeAndPrint}
              />
            </div>
          )}
        </main>

      {/* 3. AI Medical Copilot (Positionable: Bottom-Corner by default, Sticky, Left, Right with Min/Max/Resize) */}
      <AiCopilotPanel
        patient={patient}
        rxForm={rxForm}
        onApplyTemplate={handleApplyTemplate}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 4. Draggable Floating Telehealth Video Window for Tele-Consultations */}
      {isTelehealth && showVideoDock && (
        <TelehealthVideoDock
          patient={patient}
          onEndCall={() => setShowVideoDock(false)}
        />
      )}

      {/* Floating pill to reopen video window if closed during tele-consultation */}
      {isTelehealth && !showVideoDock && (
        <button
          type="button"
          onClick={() => setShowVideoDock(true)}
          className="fixed bottom-6 left-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl border border-teal-500/50 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Video size={15} className="text-teal-400" />
          <span>Reopen Tele-Video Window</span>
        </button>
      )}
    </div>
  );
}
