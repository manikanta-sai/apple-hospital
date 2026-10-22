import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Link as LinkIcon,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
  X,
} from "lucide-react";
import { db } from "../../db/database";
import { createLinkRecord } from "../../services/shortUrlService";
import SuccessScreen from "./SuccessScreen";

const CONSULTATION_PRESETS = [
  {
    doctorName: "Dr. Ananya Rao",
    doctorDesignation: "Senior Consultant Cardiologist, MD, DM",
    title: "Post-Operative Cardiac Review",
    time: "10:30 AM",
    description: "Please keep your recent ECG and blood pressure readings log accessible before joining.",
    videoUrl: "https://meet.google.com/hsp-card-rev",
  },
  {
    doctorName: "Dr. Rajesh Nair",
    doctorDesignation: "Chief Pediatric Specialist, MD (Pediatrics)",
    title: "Pediatric Growth & Follow-Up",
    time: "11:00 AM",
    description: "Please have the child's immunization card and growth chart available.",
    videoUrl: "https://meet.google.com/pedia-growth-rev",
  },
  {
    doctorName: "Dr. Sunita Deshmukh",
    doctorDesignation: "Consultant Neurologist, MBBS, DM (Neurology)",
    title: "Neurology Follow-Up & Medication Review",
    time: "02:30 PM",
    description: "Review headache diary and current prescription response.",
    videoUrl: "https://zoom.us/j/94827182910",
  },
  {
    doctorName: "Dr. Vikram Seth",
    doctorDesignation: "Consultant Endocrinologist, MD, DM",
    title: "Diabetes Care & HbA1c Consultation",
    time: "04:00 PM",
    description: "Have your fasting blood glucose and latest HbA1c lab reports ready.",
    videoUrl: "https://meet.google.com/diab-care-rev",
  },
];

const QUICK_TIME_SLOTS = ["09:30 AM", "11:00 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

const QUICK_INSTRUCTIONS = [
  "Please keep recent lab reports and prescription list ready.",
  "Join 5 minutes prior to test audio and camera feed.",
  "Ensure a quiet, well-lit room for video consultation.",
];

export default function TelehealthForm({ onNavigate }) {
  // Initialized with realistic consultation preset so preview is immediately complete
  const [doctorName, setDoctorName] = useState("Dr. Ananya Rao");
  const [doctorDesignation, setDoctorDesignation] = useState("Senior Consultant Cardiologist, MD, DM");
  const [meetingTitle, setMeetingTitle] = useState("Post-Operative Cardiac Review");
  const [meetingDate, setMeetingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [meetingTime, setMeetingTime] = useState("10:30 AM");
  const [description, setDescription] = useState(
    "Please keep your recent ECG and blood pressure readings log accessible before joining."
  );
  const [videoMeetingUrl, setVideoMeetingUrl] = useState("https://meet.google.com/hsp-card-rev");
  const [expiration, setExpiration] = useState("7 days");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);

  // Inline editing state for each section of the main preview
  const [editingSections, setEditingSections] = useState({
    title: false,
    doctorSchedule: false,
    video: false,
    instructions: false,
  });

  const toggleSection = (key) => {
    setEditingSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeSection = (key) => {
    setEditingSections((prev) => ({ ...prev, [key]: false }));
  };

  const applyPreset = (preset) => {
    setDoctorName(preset.doctorName);
    setDoctorDesignation(preset.doctorDesignation);
    setMeetingTitle(preset.title);
    setMeetingTime(preset.time);
    setDescription(preset.description);
    if (preset.videoUrl) setVideoMeetingUrl(preset.videoUrl);
    setErrorMessage("");
  };

  // Real-time validation checks
  const isDoctorNameValid = doctorName.trim().length > 0;
  const isDoctorDesignationValid = doctorDesignation.trim().length > 0;
  const isMeetingTitleValid = meetingTitle.trim().length > 0;
  const isScheduleValid = Boolean(meetingDate && meetingTime.trim().length > 0);
  const isVideoUrlValid = (() => {
    const trimmed = videoMeetingUrl.trim();
    if (!trimmed) return false;
    const testUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      new URL(testUrl);
      return true;
    } catch {
      return false;
    }
  })();

  const validationChecks = [
    { label: "Doctor Name", valid: isDoctorNameValid, key: "doctorSchedule" },
    { label: "Doctor Designation", valid: isDoctorDesignationValid, key: "doctorSchedule" },
    { label: "Consultation Title", valid: isMeetingTitleValid, key: "title" },
    { label: "Date & Time Schedule", valid: isScheduleValid, key: "doctorSchedule" },
    { label: "Video Meeting URL", valid: isVideoUrlValid, key: "video" },
  ];

  const validCount = validationChecks.filter((c) => c.valid).length;
  const isFormComplete = validCount === validationChecks.length;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    if (!doctorName.trim()) {
      setErrorMessage("Doctor Name is required.");
      setEditingSections((prev) => ({ ...prev, doctorSchedule: true }));
      return;
    }
    if (!doctorDesignation.trim()) {
      setErrorMessage("Doctor Designation is required.");
      setEditingSections((prev) => ({ ...prev, doctorSchedule: true }));
      return;
    }
    if (!meetingTitle.trim()) {
      setErrorMessage("Consultation Title is required.");
      setEditingSections((prev) => ({ ...prev, title: true }));
      return;
    }
    if (!meetingDate || !meetingTime.trim()) {
      setErrorMessage("Consultation Date and Time slot are required.");
      setEditingSections((prev) => ({ ...prev, doctorSchedule: true }));
      return;
    }

    let trimmedVideoUrl = videoMeetingUrl.trim();
    if (!trimmedVideoUrl) {
      setErrorMessage("Video Meeting Link is required.");
      setEditingSections((prev) => ({ ...prev, video: true }));
      return;
    }

    if (!/^https?:\/\//i.test(trimmedVideoUrl)) {
      trimmedVideoUrl = `https://${trimmedVideoUrl}`;
    }

    try {
      new URL(trimmedVideoUrl);
    } catch {
      setErrorMessage("Please enter a valid HTTP or HTTPS video meeting link.");
      setEditingSections((prev) => ({ ...prev, video: true }));
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
      setErrorMessage("An error occurred while saving the consultation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDoctorName("");
    setDoctorDesignation("");
    setMeetingTitle("");
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setMeetingDate(d.toISOString().split("T")[0]);
    setMeetingTime("");
    setDescription("");
    setVideoMeetingUrl("");
    setExpiration("7 days");
    setErrorMessage("");
    setCreatedRecord(null);
    setEditingSections({
      title: true,
      doctor: true,
      schedule: true,
      video: true,
      instructions: false,
    });
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

  // Format appointment date for clean display
  const formattedDate = meetingDate
    ? new Date(meetingDate).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select Consultation Date";

  return (
    <div
      style={{
        width: "70%",
        minWidth: 320,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Sticky Top Navigation & Validation Bar */}
      <div
        style={{
          position: "sticky",
          top: 122,
          zIndex: 35,
          background: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(12px)",
          padding: "10px 0",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            padding: "4px 0",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0d9488")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Links Dashboard
        </button>

        {/* Sticky Validation Readiness Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 999,
              background: isFormComplete ? "#dcfce7" : "#fef3c7",
              color: isFormComplete ? "#15803d" : "#b45309",
              border: isFormComplete ? "1px solid #86efac" : "1px solid #fde68a",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <ShieldCheck size={13} />
            {isFormComplete ? "All Details Configured" : `${validCount}/5 Fields Ready`}
          </span>
        </div>
      </div>

      {/* Quick Consultation Presets Bar */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "12px 18px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#059669",
          }}
        >
          <Sparkles size={13} /> Presets:
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CONSULTATION_PRESETS.map((preset, idx) => {
            const isMatch = meetingTitle === preset.title;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 11px",
                  borderRadius: 20,
                  background: isMatch ? "#ecfdf5" : "#f8fafc",
                  border: isMatch ? "1.5px solid #059669" : "1px solid #e2e8f0",
                  color: isMatch ? "#065f46" : "#475569",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {isMatch && <Check size={12} />}
                <span>{preset.doctorName} · {preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error alert banner if any */}
      {errorMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 14,
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#9f1239",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MAIN VIEW: SLEEK PREVIEW WITH INLINE EDITABLE FORM SECTIONS */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 24px -2px rgba(15, 23, 42, 0.05)",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          position: "relative",
        }}
      >
        {/* SECTION 1: CONSULTATION TITLE & SCOPE */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              border: editingSections.title ? "1.5px solid #059669" : "1px solid #e2e8f0",
              background: editingSections.title ? "#f0fdf4" : "#ffffff",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#059669",
                  background: "#ecfdf5",
                  padding: "2px 8px",
                  borderRadius: 999,
                }}
              >
                Consultation Topic
              </span>
              <button
                type="button"
                onClick={() => toggleSection("title")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: editingSections.title ? "1px solid #059669" : "1px solid #cbd5e1",
                  background: editingSections.title ? "#059669" : "#ffffff",
                  color: editingSections.title ? "#ffffff" : "#475569",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                title="Edit consultation title inline"
              >
                {editingSections.title ? (
                  <>
                    <Check size={12} />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Pencil size={12} />
                    <span>Edit Title</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview State vs Inline Form State */}
            {!editingSections.title ? (
              <div
                onClick={() => toggleSection("title")}
                style={{ cursor: "pointer" }}
                title="Click to edit title"
              >
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: meetingTitle.trim() ? "#0f172a" : "#94a3b8",
                    margin: "4px 0 2px 0",
                    lineHeight: 1.3,
                  }}
                >
                  {meetingTitle.trim() || "Click to enter Consultation Title..."}
                </h2>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Official specialty tele-consultation appointment for scheduled patient review.
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                <input
                  type="text"
                  autoFocus
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g. 2-Week Post-Operative Cardiac Review"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #059669",
                    background: "#ffffff",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0f172a",
                    outline: "none",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      closeSection("title");
                    }
                  }}
                />
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {[
                    "Post-Operative Review",
                    "Pediatric Follow-Up",
                    "Diabetes Consultation",
                    "Neurology Medication Review",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setMeetingTitle(chip)}
                      style={{
                        padding: "3px 8px",
                        fontSize: 11,
                        borderRadius: 6,
                        border: "1px solid #bbf7d0",
                        background: "#ffffff",
                        color: "#047857",
                        cursor: "pointer",
                      }}
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MERGED SECTION: ATTENDING PHYSICIAN & SCHEDULED APPOINTMENT SLOT */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 14,
              border: editingSections.doctorSchedule ? "1.5px solid #059669" : "1px solid #e2e8f0",
              background: editingSections.doctorSchedule ? "#f0fdf4" : "#ffffff",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stethoscope size={15} color="#0f766e" />
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f766e" }}>
                  Attending Physician & Appointment Schedule
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSection("doctorSchedule")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: editingSections.doctorSchedule ? "1px solid #059669" : "1px solid #cbd5e1",
                  background: editingSections.doctorSchedule ? "#059669" : "#ffffff",
                  color: editingSections.doctorSchedule ? "#ffffff" : "#475569",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                title="Edit physician and appointment schedule details inline"
              >
                {editingSections.doctorSchedule ? (
                  <>
                    <Check size={12} />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Pencil size={12} />
                    <span>Edit Details</span>
                  </>
                )}
              </button>
            </div>

            {!editingSections.doctorSchedule ? (
              <div
                onClick={() => toggleSection("doctorSchedule")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  cursor: "pointer",
                  flexWrap: "wrap",
                }}
                title="Click to edit physician and appointment schedule"
              >
                {/* Physician credentials */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: "1 1 280px" }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: "#0d9488",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(13, 148, 136, 0.2)",
                    }}
                  >
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: doctorName.trim() ? "#0f172a" : "#94a3b8" }}>
                      {doctorName.trim() || "Click to enter Doctor Name..."}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: doctorDesignation.trim() ? "#0f766e" : "#94a3b8", marginTop: 2 }}>
                      {doctorDesignation.trim() || "Click to enter Doctor Designation"}
                    </div>
                  </div>
                </div>

                {/* Appointment Schedule Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f8fafc", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <Calendar size={15} color="#059669" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                      {formattedDate}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f8fafc", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <Clock size={15} color="#0284c7" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                      {meetingTime.trim() || "Set Time"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
                  {/* Left Column: Physician details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Doctor Name <span style={{ color: "#e11d48" }}>*</span>
                      </label>
                      <input
                        type="text"
                        autoFocus
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="e.g. Dr. Ananya Rao"
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "9px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #059669",
                          background: "#ffffff",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0f172a",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Doctor Designation <span style={{ color: "#e11d48" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={doctorDesignation}
                        onChange={(e) => setDoctorDesignation(e.target.value)}
                        placeholder="e.g. Senior Consultant Cardiologist, MD, DM"
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "9px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #059669",
                          background: "#ffffff",
                          fontSize: 13,
                          color: "#0f172a",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {["Cardiology", "Pediatrics", "Neurology", "Endocrinology"].map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => {
                            if (!doctorDesignation.includes(spec)) {
                              setDoctorDesignation(`Senior Consultant ${spec}, MD`);
                            }
                          }}
                          style={{
                            padding: "2px 7px",
                            fontSize: 10,
                            borderRadius: 5,
                            border: "1px solid #ccfbf1",
                            background: "#f0fdfa",
                            color: "#0f766e",
                            cursor: "pointer",
                          }}
                        >
                          + {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Schedule details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Date <span style={{ color: "#e11d48" }}>*</span>
                      </label>
                      <input
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "9px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #059669",
                          background: "#ffffff",
                          fontSize: 13,
                          color: "#0f172a",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Time Slot <span style={{ color: "#e11d48" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        placeholder="e.g. 10:30 AM"
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "9px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #059669",
                          background: "#ffffff",
                          fontSize: 13,
                          color: "#0f172a",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {QUICK_TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setMeetingTime(slot)}
                          style={{
                            padding: "2px 7px",
                            fontSize: 10,
                            borderRadius: 5,
                            border: meetingTime === slot ? "1px solid #059669" : "1px solid #cbd5e1",
                            background: meetingTime === slot ? "#ecfdf5" : "#ffffff",
                            color: meetingTime === slot ? "#065f46" : "#475569",
                            cursor: "pointer",
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: VIDEO PLATFORM & MEETING URL */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              border: editingSections.video ? "1.5px solid #059669" : "1px solid #e2e8f0",
              background: editingSections.video ? "#f0fdf4" : "#ffffff",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Video size={15} color="#059669" />
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#334155" }}>
                  Video Conference Link
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleSection("video")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: editingSections.video ? "1px solid #059669" : "1px solid #cbd5e1",
                  background: editingSections.video ? "#059669" : "#ffffff",
                  color: editingSections.video ? "#ffffff" : "#475569",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                title="Edit video meeting URL inline"
              >
                {editingSections.video ? (
                  <>
                    <Check size={12} />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Pencil size={12} />
                    <span>Edit Video Link</span>
                  </>
                )}
              </button>
            </div>

            {!editingSections.video ? (
              <div
                onClick={() => toggleSection("video")}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
                title="Click to edit video conference URL"
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: isVideoUrlValid ? "#059669" : "#dc2626",
                    fontWeight: 700,
                  }}
                >
                  <LinkIcon size={13} />
                  <span>{videoMeetingUrl.trim() || "Click to add Video Meeting URL..."}</span>
                </div>
                {isVideoUrlValid ? (
                  <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>✓ Valid URL Configured</span>
                ) : (
                  <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700 }}>• Video Link Missing</span>
                )}
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    autoFocus
                    value={videoMeetingUrl}
                    onChange={(e) => setVideoMeetingUrl(e.target.value)}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "9px 12px 9px 34px",
                      borderRadius: 10,
                      border: "1.5px solid #059669",
                      background: "#ffffff",
                      fontSize: 13,
                      fontFamily: "monospace",
                      color: "#0f172a",
                      outline: "none",
                    }}
                  />
                  <LinkIcon
                    size={14}
                    style={{
                      position: "absolute",
                      left: 11,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Fast platform switcher buttons placed below the input field */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Quick Platforms:</span>
              {[
                {
                  name: "Google Meet",
                  genUrl: () => `https://meet.google.com/tele-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`,
                  checkMatch: (url) => url.includes("meet.google.com"),
                },
                {
                  name: "Zoom",
                  genUrl: () => `https://zoom.us/j/${Math.floor(70000000000 + Math.random() * 29000000000)}`,
                  checkMatch: (url) => url.includes("zoom.us"),
                },
                {
                  name: "MS Teams",
                  genUrl: () => `https://teams.microsoft.com/l/meetup-join/telehealth-${Math.random().toString(36).substring(2, 7)}`,
                  checkMatch: (url) => url.includes("teams.microsoft.com"),
                },
              ].map((p) => {
                const isMatch = p.checkMatch(videoMeetingUrl);

                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setVideoMeetingUrl(p.genUrl());
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 10px",
                      fontSize: 11,
                      borderRadius: 6,
                      border: isMatch ? "1.5px solid #059669" : "1px solid #cbd5e1",
                      background: isMatch ? "#ecfdf5" : "#ffffff",
                      color: isMatch ? "#065f46" : "#475569",
                      fontWeight: isMatch ? 700 : 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isMatch ? <Check size={11} /> : "+"}
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 5: PATIENT PREPARATION INSTRUCTIONS */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              border: editingSections.instructions ? "1.5px solid #059669" : "1px solid #fef3c7",
              background: editingSections.instructions ? "#f0fdf4" : "#fffbeb",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#92400e" }}>
                Patient Preparation & Guidelines
              </span>
              <button
                type="button"
                onClick={() => toggleSection("instructions")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: editingSections.instructions ? "1px solid #059669" : "1px solid #fde68a",
                  background: editingSections.instructions ? "#059669" : "#ffffff",
                  color: editingSections.instructions ? "#ffffff" : "#92400e",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                title="Edit instructions inline"
              >
                {editingSections.instructions ? (
                  <>
                    <Check size={12} />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Pencil size={12} />
                    <span>Edit Instructions</span>
                  </>
                )}
              </button>
            </div>

            {!editingSections.instructions ? (
              <div
                onClick={() => toggleSection("instructions")}
                style={{ fontSize: 13, color: description.trim() ? "#78350f" : "#b45309", lineHeight: 1.5, cursor: "pointer" }}
                title="Click to edit patient instructions"
              >
                {description.trim() || "Click to add specific instructions for the patient before entering..."}
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <textarea
                  rows={2}
                  autoFocus
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Please keep your recent ECG and blood pressure readings log accessible before joining."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1.5px solid #059669",
                    background: "#ffffff",
                    fontSize: 13,
                    color: "#0f172a",
                    outline: "none",
                    lineHeight: 1.4,
                  }}
                />
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {QUICK_INSTRUCTIONS.map((hint, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDescription(hint)}
                      style={{
                        padding: "3px 8px",
                        fontSize: 11,
                        borderRadius: 6,
                        border: "1px dashed #cbd5e1",
                        background: "#ffffff",
                        color: "#475569",
                        cursor: "pointer",
                      }}
                    >
                      + {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

      </div>

      {/* SECTION 7: LINK EXPIRATION WINDOW CARD (Matching Reference Image) */}
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          padding: "16px 20px",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#f1f5f9",
              color: "#334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              Link Expiration Window
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Standard telehealth sessions automatically expire post-consultation
            </div>
          </div>
        </div>

        <select
          id="telehealthExpiry"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
          style={{
            minWidth: 260,
            padding: "8px 14px",
            borderRadius: 10,
            border: "1.5px solid #cbd5e1",
            background: "#f8fafc",
            fontSize: 13,
            fontWeight: 600,
            color: "#0f172a",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="1 day">1 day (Single day appointment)</option>
          <option value="7 days">7 days (Standard consultation window)</option>
          <option value="30 days">30 days (Follow-up period)</option>
          <option value="90 days">90 days (Quarterly care plan)</option>
          <option value="Never expires">Never expires</option>
        </select>
      </div>

      {/* FORM ACTIONS FOOTER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          paddingTop: 8,
          marginBottom: 24,
        }}
      >
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: "10px 18px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            fontSize: 13,
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          Reset All
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 10,
            border: "none",
            background: isSubmitting
              ? "#94a3b8"
              : "linear-gradient(135deg, #059669 0%, #047857 100%)",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 700,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            boxShadow: "0 4px 14px rgba(5, 150, 105, 0.3)",
            transition: "all 0.15s ease",
          }}
        >
          <Video size={16} />
          {isSubmitting ? "Generating Consultation Link..." : "Generate Telehealth Link"}
        </button>
      </div>
    </div>
  );
}
