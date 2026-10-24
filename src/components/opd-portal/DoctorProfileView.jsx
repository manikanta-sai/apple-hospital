import React, { useState, useEffect, useRef } from "react";
import {
  Stethoscope,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  Users,
  Award,
  CheckCircle2,
  Edit2,
  Save,
  Check,
  Phone,
  Mail,
  MapPin,
  X,
  Plus,
  RotateCcw,
  Camera,
  Trash2,
  Upload,
} from "lucide-react";
import { DOCTOR_STATUS_OPTIONS } from "../queue/QueueKpiStats.jsx";

const DEFAULT_PROFILE = {
  name: "Dr. Rajesh Sharma, MD",
  qualifications: "MBBS, MD (General Medicine), FICP",
  regNo: "NMC-48291",
  department: "General Medicine & Clinical Care",
  room: "Room 104, OPD Block - Floor 1",
  experience: "14+ Years Clinical Practice",
  patientsTreated: "14,820+",
  rating: "4.9 / 5.0",
  phone: "+91 98765 43210",
  email: "dr.sharma@abcdhospital.in",
  workingHours: "09:00 AM – 02:00 PM & 04:00 PM – 07:00 PM (Mon–Sat)",
  location: "ABCD Multispecialty Hospital, Healthcare Enclave, New Delhi",
  avatarUrl: "",
  specializations: [
    "Hypertension Management",
    "Type 2 Diabetes Mellitus",
    "Infectious Diseases & Fever",
    "Cardiovascular Preventive Care",
    "Adult Immunizations",
  ],
};

export default function DoctorProfileView({
  doctorStatus = "ON DUTY",
  onDoctorStatusChange = () => {},
  onGoToAppointments = () => {},
}) {
  // Load profile from localStorage if available
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("opd_doctor_profile_data");
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_PROFILE;
  });

  // Edit states: whole form inline edit mode & modal edit mode
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [newTag, setNewTag] = useState("");
  const [toastMsg, setToastMsg] = useState(null);

  const fileInputRef = useRef(null);

  // Sync formData with profile when profile changes
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Avatar Image Upload Handler (reads as Base64 data URL)
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    // Limit to 3MB
    if (file.size > 3 * 1024 * 1024) {
      showToast("Image size must be under 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result;
      setFormData((prev) => ({ ...prev, avatarUrl: base64Url }));
      setProfile((prev) => {
        const updated = { ...prev, avatarUrl: base64Url };
        try {
          localStorage.setItem("opd_doctor_profile_data", JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast("Doctor avatar uploaded successfully!");
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be re-uploaded if needed
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
    setProfile((prev) => {
      const updated = { ...prev, avatarUrl: "" };
      try {
        localStorage.setItem("opd_doctor_profile_data", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast("Doctor avatar removed (using default monogram)");
  };

  const handleAddSpecialization = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (formData.specializations.includes(trimmed)) {
      showToast("Specialization already added");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      specializations: [...prev.specializations, trimmed],
    }));
    setNewTag("");
  };

  const handleRemoveSpecialization = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    setProfile(formData);
    try {
      localStorage.setItem("opd_doctor_profile_data", JSON.stringify(formData));
      window.dispatchEvent(new Event("doctor_profile_updated"));
    } catch {}
    setIsEditingAll(false);
    setIsEditModalOpen(false);
    showToast("Doctor profile updated successfully!");
  };

  const handleCancelAll = () => {
    setFormData(profile);
    setIsEditingAll(false);
    setIsEditModalOpen(false);
  };

  const handleResetDefault = () => {
    if (window.confirm("Reset profile to original hospital defaults?")) {
      setProfile(DEFAULT_PROFILE);
      setFormData(DEFAULT_PROFILE);
      try {
        localStorage.removeItem("opd_doctor_profile_data");
        window.dispatchEvent(new Event("doctor_profile_updated"));
      } catch {}
      setIsEditingAll(false);
      setIsEditModalOpen(false);
      showToast("Reset to default doctor profile");
    }
  };

  // Current active avatar (formData in edit mode, profile in view mode)
  const currentAvatar = isEditingAll ? formData.avatarUrl : profile.avatarUrl;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ── Hidden File Input for Avatar Upload ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />

      {/* ── Top Bar Controls: Sticky Edit Bar ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl p-4 sm:p-4.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center justify-between flex-wrap gap-4 transition-all">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Stethoscope className="text-teal-700" size={20} />
            <span>Doctor Profile & OPD Credentials</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isEditingAll
              ? "Editing mode active: Modify credentials directly and click Save All Changes."
              : "View clinical registration, consultation timings, and OPD credentials."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isEditingAll ? (
            <>
              <button
                type="button"
                onClick={handleCancelAll}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Save All Changes</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                title="Reset to initial seed credentials"
              >
                <RotateCcw size={13} />
                <span>Reset Default</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(profile);
                  setIsEditingAll(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-teal-700 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                title="Edit doctor profile inline directly on page"
              >
                <Edit2 size={13} />
                <span>Edit Profile</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── 1. Doctor Profile Hero Card ── */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(20px)",
          border: isEditingAll ? "2px solid #0d9488" : "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: 24,
          boxShadow: isEditingAll
            ? "0 4px 24px rgba(13, 148, 136, 0.12)"
            : "0 4px 24px rgba(0, 0, 0, 0.04)",
        }}
        className="p-6 sm:p-8 transition-all"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-5 w-full">
            {/* Avatar / Portrait with Image Upload */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-gradient-to-tr from-teal-700 to-sky-600 flex items-center justify-center text-white text-2xl font-black">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>DR</span>
                )}
              </div>

              {/* Upload Trigger Button Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white shadow-md border-2 border-white transition-all cursor-pointer flex items-center justify-center"
                title="Upload or Change Doctor Photo"
              >
                <Camera size={13} />
              </button>

              {/* Remove button if avatar exists */}
              {currentAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-white transition-all cursor-pointer flex items-center justify-center"
                  title="Remove custom photo"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-2">
              {isEditingAll ? (
                /* Inline Edit for Doctor Primary Info */
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Full Name & Title
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-teal-300 bg-teal-50/30 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Dr. Full Name, Degrees"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        value={formData.regNo}
                        onChange={(e) => handleInputChange("regNo", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-teal-300 bg-teal-50/30 text-xs font-mono font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="NMC-XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Degrees & Medical Qualifications
                    </label>
                    <input
                      type="text"
                      value={formData.qualifications}
                      onChange={(e) => handleInputChange("qualifications", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. MBBS, MD (General Medicine)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Hospital Department
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Department name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Consultation Room & Floor
                      </label>
                      <input
                        type="text"
                        value={formData.room}
                        onChange={(e) => handleInputChange("room", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Room 104, Floor 1"
                      />
                    </div>
                  </div>

                  {/* Photo upload shortcut hint */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                    >
                      <Upload size={12} />
                      <span>{currentAvatar ? "Change Photo" : "Upload Doctor Photo"}</span>
                    </button>
                    {currentAvatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={11} />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Read-Only Display Mode */
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {profile.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 font-mono">
                      {profile.regNo}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                      <ShieldCheck size={13} />
                      <span>NABH Verified</span>
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-teal-800 mt-1">
                    {profile.qualifications}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Building2 size={13} />
                    <span>
                      {profile.department} • {profile.room}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Duty Status Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block sm:hidden">
              Duty Status
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs">
              {DOCTOR_STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onDoctorStatusChange(opt.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    doctorStatus === opt.id
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid: Patients Treated and Satisfaction Rating are ALWAYS READ-ONLY */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          {/* Experience (Editable) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Experience
            </span>
            {isEditingAll ? (
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                className="w-full mt-1 px-2 py-1 text-center rounded border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            ) : (
              <strong className="text-lg font-bold text-slate-900 mt-0.5 block">
                {profile.experience}
              </strong>
            )}
          </div>

          {/* Patients Treated (ALWAYS READ-ONLY) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Patients Treated
            </span>
            <strong className="text-lg font-bold text-slate-900 mt-0.5 block font-mono">
              {profile.patientsTreated}
            </strong>
          </div>

          {/* Satisfaction Rating (ALWAYS READ-ONLY) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Satisfaction Rating
            </span>
            <strong className="text-lg font-bold text-amber-600 mt-0.5 block flex items-center justify-center gap-1">
              <Star size={16} fill="currentColor" />
              <span>{profile.rating}</span>
            </strong>
          </div>

          {/* Active Desk (ALWAYS READ-ONLY) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Desk
            </span>
            <strong className="text-lg font-bold text-teal-700 mt-0.5 block">
              {profile.room.split(",")[0] || "Room 104"}
            </strong>
          </div>
        </div>
      </div>

      {/* ── 2. Credentials, Schedule & Specializations ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Schedule */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
            border: isEditingAll ? "2px solid #0d9488" : "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 24,
            boxShadow: isEditingAll
              ? "0 4px 24px rgba(13, 148, 136, 0.12)"
              : "0 4px 24px rgba(0, 0, 0, 0.04)",
          }}
          className="p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-teal-700" />
              <span>Consultation Schedule & Contact</span>
            </h3>
            {isEditingAll && (
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Editing Schedule
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            {/* OPD Timings */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Calendar size={16} className="text-slate-400 shrink-0 mt-1" />
              <div className="flex-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  OPD Timings / Consultation Hours
                </span>
                {isEditingAll ? (
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => handleInputChange("workingHours", e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. 09:00 AM – 02:00 PM (Mon-Sat)"
                  />
                ) : (
                  <strong className="text-slate-800 text-xs">{profile.workingHours}</strong>
                )}
              </div>
            </div>

            {/* Clinic Desk Phone */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Phone size={16} className="text-slate-400 shrink-0 mt-1" />
              <div className="flex-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Clinic Desk Direct Line
                </span>
                {isEditingAll ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                ) : (
                  <strong className="text-slate-800 text-xs">{profile.phone}</strong>
                )}
              </div>
            </div>

            {/* Official Email */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Mail size={16} className="text-slate-400 shrink-0 mt-1" />
              <div className="flex-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Official Hospital Email
                </span>
                {isEditingAll ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="doctor@hospital.in"
                  />
                ) : (
                  <strong className="text-slate-800 text-xs">{profile.email}</strong>
                )}
              </div>
            </div>

            {/* Hospital Location */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin size={16} className="text-slate-400 shrink-0 mt-1" />
              <div className="flex-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Hospital Location & Campus
                </span>
                {isEditingAll ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="Hospital campus address"
                  />
                ) : (
                  <strong className="text-slate-800 text-xs">{profile.location}</strong>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Specializations */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
            border: isEditingAll ? "2px solid #0d9488" : "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 24,
            boxShadow: isEditingAll
              ? "0 4px 24px rgba(13, 148, 136, 0.12)"
              : "0 4px 24px rgba(0, 0, 0, 0.04)",
          }}
          className="p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award size={16} className="text-teal-700" />
                <span>Core Clinical Focus Areas</span>
              </h3>
              {isEditingAll && (
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Tag Editor
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Registered specialties for outpatient appointments and triage routing
            </p>

            {/* Specialization Tags */}
            <div className="flex flex-wrap gap-2">
              {(isEditingAll ? formData.specializations : profile.specializations).map((spec) => (
                <span
                  key={spec}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isEditingAll
                      ? "bg-teal-50 border border-teal-300 text-teal-900"
                      : "bg-teal-50 border border-teal-200/80 text-teal-900"
                  }`}
                >
                  <CheckCircle2 size={12} className="text-teal-700 shrink-0" />
                  <span>{spec}</span>
                  {isEditingAll && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(spec)}
                      className="ml-1 p-0.5 hover:bg-teal-200 rounded-full text-teal-700 hover:text-rose-700 cursor-pointer"
                      title={`Remove ${spec}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Add New Tag Input in Edit Mode */}
            {isEditingAll && (
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSpecialization();
                    }
                  }}
                  placeholder="Add specialty (e.g. Geriatric Care)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialization}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus size={13} />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">Digital Prescription Sign Active</span>
            {isEditingAll ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelAll}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onGoToAppointments}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Open Appointments Desk →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Doctor Profile Modal Dialog ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center font-bold text-sm shadow-2xs">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Edit Doctor Profile & OPD Credentials
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update physician registration, clinic hours, and contact details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelAll}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/60"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: Scrollable Form */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* Photo & Identity Section */}
              <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-gradient-to-tr from-teal-700 to-sky-600 flex items-center justify-center text-white text-xl font-black shrink-0">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>DR</span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-sm">
                    Doctor Portrait / Photo
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Supports PNG, JPG, or WebP (max 3MB). Appears on digital prescriptions and patient queue.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Camera size={13} />
                      <span>{formData.avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                    </button>
                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Profile Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  Physician Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Full Name & Title *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Dr. Full Name, MD"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      NMC / State Registration No. *
                    </label>
                    <input
                      type="text"
                      value={formData.regNo}
                      onChange={(e) => handleInputChange("regNo", e.target.value)}
                      placeholder="NMC-XXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono font-bold text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Qualifications & Fellowships
                  </label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => handleInputChange("qualifications", e.target.value)}
                    placeholder="e.g. MBBS, MD (General Medicine), FICP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium text-slate-800 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      placeholder="General Medicine"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Consultation Room & Floor
                    </label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => handleInputChange("room", e.target.value)}
                      placeholder="Room 104, Floor 1"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Experience & Schedule */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  Schedule & Experience
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Clinical Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="14+ Years Clinical Practice"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      OPD Working Hours
                    </label>
                    <input
                      type="text"
                      value={formData.workingHours}
                      onChange={(e) => handleInputChange("workingHours", e.target.value)}
                      placeholder="09:00 AM – 02:00 PM (Mon–Sat)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Hospital Location & Address
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Hospital campus location"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  Direct Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Desk Phone Line
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono font-medium text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="dr.sharma@abcdhospital.in"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Specializations & Focus Tags */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  Specialties & Clinical Focus
                </h4>

                <div className="flex flex-wrap gap-2">
                  {formData.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-semibold text-xs flex items-center gap-1.5"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialization(spec)}
                        className="p-0.5 hover:bg-teal-200/80 rounded-full text-teal-700 hover:text-rose-700 cursor-pointer"
                        title={`Remove ${spec}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSpecialization();
                      }
                    }}
                    placeholder="Add focus area (e.g. Geriatric Medicine)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium text-slate-800 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialization}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <button
                type="button"
                onClick={handleCancelAll}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                className="px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={15} className="text-teal-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
