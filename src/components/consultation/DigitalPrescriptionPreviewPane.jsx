import React, { useState } from "react";
import {
  Printer,
  Save,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Stethoscope,
  Building2,
  Calendar,
  AlertTriangle,
  Lock,
  Unlock,
  FileCheck,
} from "lucide-react";
import InterimLabSlipModal from "./InterimLabSlipModal.jsx";

export default function DigitalPrescriptionPreviewPane({
  patient = {},
  prescription = {},
  isSaving = false,
  onSaveDraft = () => {},
  onSendToLab = () => {},
  onFinalizeAndPrint = () => {},
}) {
  const [showLabSlipModal, setShowLabSlipModal] = useState(false);
  const [validationAlert, setValidationAlert] = useState(null);

  const medications = prescription.medications || [];
  const complaints = prescription.chiefComplaints || [];
  const investigations = prescription.investigationsOrdered || [];
  const diagnosis = prescription.diagnosis || {};
  const followUp = prescription.followUp || {};
  const referrals = prescription.referrals || {};
  const isFinalized = prescription.status === "finalized";
  const isDraft = !isFinalized;

  const doctor = prescription.doctorDetails || {
    name: "Dr. Rajesh Sharma, MD",
    regNo: "NMC-48291",
    department: "General Medicine",
    room: "Room 104",
  };

  // Check mandatory requirements
  const isDiagnosisFilled = !!(diagnosis.provisional?.trim() || diagnosis.final?.trim());
  const isComplaintsFilled = complaints.length > 0;
  const isMedicationsFilled = medications.length > 0;
  const isFollowUpFilled = !!(followUp.timeline || followUp.date);

  const isMandatoryComplete =
    isDiagnosisFilled &&
    isComplaintsFilled &&
    isMedicationsFilled &&
    isFollowUpFilled;

  const handlePrintClick = () => {
    if (!isFinalized) {
      setValidationAlert(
        "Prescription cannot be printed in DRAFT mode. Please complete mandatory fields and click 'Finalize, Sign & Print'."
      );
      setTimeout(() => setValidationAlert(null), 4000);
      return;
    }
    window.print();
  };

  const handleFinalizeClick = () => {
    if (!isMandatoryComplete) {
      setValidationAlert(
        "Cannot Finalize: Please ensure Chief Complaints, Diagnosis, Medications, and Follow-up are completed."
      );
      setTimeout(() => setValidationAlert(null), 4000);
      return;
    }
    onFinalizeAndPrint();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/70 border-l border-slate-200">
      {/* Top Preview Bar */}
      <div className="px-5 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Live A4 Prescription Preview
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200/60">
            {prescription.status === "finalized"
              ? "Finalized & Signed"
              : prescription.status === "awaiting_labs"
              ? "Lab Draft"
              : "Active Working Draft"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {investigations.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLabSlipModal(true)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Print Interim Lab Requisition Slip"
            >
              <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lab Slip</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrintClick}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
              isFinalized
                ? "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100"
                : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
            }`}
            title={isFinalized ? "Print official prescription" : "Print locked in draft mode"}
          >
            {isFinalized ? (
              <Printer className="w-3.5 h-3.5 text-teal-700" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{isFinalized ? "Quick Print" : "Print Locked"}</span>
          </button>
        </div>
      </div>

      {/* Validation Alert Toast/Banner */}
      {validationAlert && (
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{validationAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationAlert(null)}
            className="text-amber-700 font-bold hover:text-amber-950"
          >
            ✕
          </button>
        </div>
      )}

      {/* Simulated A4 Paper Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-slate-200/50 print:p-0 print:bg-white relative">
        {/* Draft Watermark Overlay */}
        {isDraft && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-10 overflow-hidden">
            <div className="transform -rotate-30 border-4 border-amber-500/20 text-amber-600/20 font-black text-4xl sm:text-5xl tracking-widest uppercase px-8 py-4 rounded-3xl">
              DRAFT • NOT VALID FOR DISPENSING
            </div>
          </div>
        )}
        <div
          id="digital-prescription-sheet"
          className="w-full max-w-[760px] bg-white rounded-xl shadow-lg border border-slate-200/80 p-6 sm:p-8 space-y-5 text-slate-800 print:shadow-none print:border-none print:p-4 print:max-w-none print:rounded-none"
          style={{ minHeight: "850px" }}
        >
          {/* Hospital Letterhead */}
          <div className="border-b-2 border-teal-700 pb-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-black text-lg">
                  +
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                    APPLE MULTISPECIALTY HOSPITAL
                  </h2>
                  <p className="text-[11px] text-teal-800 font-bold uppercase tracking-wider mt-0.5">
                    Center of Excellence in Clinical Care
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Outpatient Department (OPD) • General Medicine Wing • Room 104
              </p>
              <p className="text-[10px] text-slate-400">
                100 Hospital Boulevard, Metro Health District • Tel: +91 44 2839 0000
              </p>
            </div>

            <div className="text-right">
              <h3 className="font-bold text-sm text-slate-900">{doctor.name}</h3>
              <p className="text-xs text-teal-800 font-semibold">{doctor.department}</p>
              <p className="text-[11px] text-slate-500 font-mono">Reg No: {doctor.regNo}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Patient Demographic & Vitals Strip */}
          <div className="bg-slate-50/90 rounded-xl border border-slate-200/80 p-3.5 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name</span>
              <strong className="text-slate-900 text-sm">{patient.name || "Patient"}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Age / Gender</span>
              <strong className="text-slate-800">
                {patient.age} Yrs / {patient.gender}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">UHID / Token</span>
              <strong className="font-mono text-slate-800">
                {patient.uhid} ({patient.tokenNumber})
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Consultation</span>
              <span className="font-semibold text-teal-800 capitalize">
                {(patient.consultationType || "walk_in").replace("_", " ")} ({patient.visitType || "new"})
              </span>
            </div>

            {/* Vitals Row */}
            <div className="col-span-2 sm:col-span-4 pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
              {patient.vitals?.bp && (
                <span>
                  <strong className="text-slate-500 font-normal">BP:</strong>{" "}
                  <strong className="text-slate-900">{patient.vitals.bp} mmHg</strong>
                </span>
              )}
              {patient.vitals?.pulse && (
                <span>
                  <strong className="text-slate-500 font-normal">Pulse:</strong>{" "}
                  <strong className="text-slate-900">{patient.vitals.pulse} bpm</strong>
                </span>
              )}
              {patient.vitals?.temp && (
                <span>
                  <strong className="text-slate-500 font-normal">Temp:</strong>{" "}
                  <strong className="text-slate-900">{patient.vitals.temp} °F</strong>
                </span>
              )}
              {patient.vitals?.spo2 && (
                <span>
                  <strong className="text-slate-500 font-normal">SpO2:</strong>{" "}
                  <strong className="text-slate-900">{patient.vitals.spo2}%</strong>
                </span>
              )}
              {patient.vitals?.weight && (
                <span>
                  <strong className="text-slate-500 font-normal">Wt:</strong>{" "}
                  <strong className="text-slate-900">{patient.vitals.weight} kg</strong>
                </span>
              )}
              {patient.vitals?.bmi && (
                <span>
                  <strong className="text-slate-500 font-normal">BMI:</strong>{" "}
                  <strong className="text-slate-900">{patient.vitals.bmi}</strong>
                </span>
              )}
            </div>

            {/* Allergies and Special Flags */}
            {(patient.allergies?.length > 0 || patient.isPregnant) && (
              <div className="col-span-2 sm:col-span-4 pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                {patient.allergies?.length > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100/80 text-rose-800 border border-rose-200">
                    ⚠️ Allergy: {patient.allergies.join(", ")}
                  </span>
                )}
                {patient.isPregnant && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-pink-800 border border-pink-200">
                    🤰 Pregnant ({patient.pregnancyDetails?.trimester || "2nd"} Trimester)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Chief Complaints */}
          {complaints.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Chief Complaints & History
              </h4>
              <div className="flex flex-wrap gap-2">
                {complaints.map((c) => (
                  <span
                    key={c.id || c.complaint}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-medium"
                  >
                    <strong>{c.complaint}</strong>
                    {c.duration && ` • ${c.duration} ${c.durationUnit || "Days"}`}
                    {c.severity && ` (${c.severity})`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Examination / Systemic Observations */}
          {prescription.clinicalObservations && (
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Systemic Examination & Clinical Findings
              </h4>
              <p className="text-xs text-slate-700 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/70 whitespace-pre-line leading-relaxed">
                {prescription.clinicalObservations}
              </p>
            </div>
          )}

          {/* Diagnosis */}
          {(diagnosis.provisional || diagnosis.final) && (
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Clinical Diagnosis
              </h4>
              <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 font-bold">
                    {diagnosis.final || diagnosis.provisional}
                  </strong>
                  {diagnosis.provisional && diagnosis.final && (
                    <span className="block text-[11px] text-teal-800">
                      Prov: {diagnosis.provisional}
                    </span>
                  )}
                </div>
                {diagnosis.icd10Code && (
                  <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-teal-200/80 text-teal-900 border border-teal-300">
                    ICD-10: {diagnosis.icd10Code}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ℞ Medications Prescribed */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <span className="text-base text-teal-700 font-serif font-black">℞</span>
              Prescribed Medications
            </h4>

            {medications.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Medicine</th>
                      <th className="p-2.5">Form / Dose</th>
                      <th className="p-2.5">Schedule</th>
                      <th className="p-2.5">Timing</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medications.map((med, i) => (
                      <tr key={med.id || i} className="hover:bg-slate-50/60">
                        <td className="p-2.5">
                          <strong className="text-slate-900 block">{med.drugName}</strong>
                          {med.genericName && (
                            <span className="text-[10px] text-slate-400 block">
                              {med.genericName}
                            </span>
                          )}
                          {med.instructions && (
                            <span className="text-[11px] text-teal-700 italic block mt-0.5">
                              {med.instructions}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-medium text-slate-700">
                          {med.form} {med.dosage}
                        </td>
                        <td className="p-2.5 font-bold font-mono text-teal-800">
                          {med.frequency}
                        </td>
                        <td className="p-2.5 text-slate-700">{med.timing}</td>
                        <td className="p-2.5 text-slate-700">{med.durationDays} Days</td>
                        <td className="p-2.5 text-right font-bold text-slate-800">
                          {med.totalQuantity || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No medications prescribed yet.
              </div>
            )}
          </div>

          {/* Investigations & Dietary Advice */}
          {(investigations.length > 0 || prescription.dietaryAdvice) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {investigations.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-700 block mb-1.5 font-bold flex items-center gap-1">
                    <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                    Investigations Ordered:
                  </strong>
                  <ul className="space-y-1">
                    {investigations.map((inv, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{inv.testName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          ({inv.category})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {prescription.dietaryAdvice && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-700 block mb-1.5 font-bold">
                    Dietary & Lifestyle Advice:
                  </strong>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {prescription.dietaryAdvice}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Referrals & IPD Recommendation */}
          {(referrals.department || prescription.isAdmitRecommended) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {referrals.department && (
                <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-indigo-950">
                  <strong>Referral:</strong> {referrals.department}
                  {referrals.doctorName && ` • ${referrals.doctorName}`}
                  {referrals.reason && (
                    <div className="text-[11px] text-indigo-800 mt-0.5">{referrals.reason}</div>
                  )}
                </div>
              )}

              {prescription.isAdmitRecommended && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>IPD Admission Recommended:</strong>{" "}
                    {prescription.admitDetails?.ward || "General Ward"} (
                    {prescription.admitDetails?.priority || "Urgent"})
                    {prescription.admitDetails?.reason && (
                      <div className="text-[11px] text-rose-800 mt-0.5">
                        {prescription.admitDetails.reason}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Follow Up */}
          {followUp.timeline && (
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
              <div>
                <strong>Follow-Up / Review:</strong>{" "}
                <span className="font-bold">{followUp.timeline}</span>
                {followUp.date && ` (on or before ${followUp.date})`}
                {followUp.notes && (
                  <div className="text-[11px] text-emerald-800 mt-0.5">{followUp.notes}</div>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                Review Plan
              </span>
            </div>
          )}

          {/* Doctor Signature & Hospital Stamp Block */}
          <div className="pt-6 mt-4 flex items-end justify-between border-t border-slate-200 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-teal-800 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Authenticated Prescription</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Hospital OPD Electronic Prescription System (EHR v2.4)
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Rx Token: {patient.tokenNumber || "#W-01"} • Timestamp: {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-teal-900 font-bold mb-0.5">
                Dr. Rajesh Sharma
              </div>
              <div className="font-bold text-slate-800">{doctor.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">Reg No: {doctor.regNo}</div>
              <div className="text-[10px] text-teal-700 font-semibold">Consultant Physician</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-300/80 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            type="button"
            onClick={onSendToLab}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200 shadow-2xs"
          >
            <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mark Draft - Send to Lab</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFinalizeClick}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md active:scale-98 ${
              isMandatoryComplete
                ? "bg-teal-700 hover:bg-teal-600 text-white hover:shadow-lg"
                : "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
            }`}
            title={
              isMandatoryComplete
                ? "Sign, lock and print official prescription"
                : "Complete all mandatory checklist sections to finalize"
            }
          >
            {isMandatoryComplete ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Lock className="w-4 h-4 text-amber-600" />
            )}
            <span>
              {isFinalized
                ? "Re-Print Prescription"
                : isMandatoryComplete
                ? "Finalize, Sign & Print Rx"
                : "Finalize Locked (Checklist Incomplete)"}
            </span>
          </button>
        </div>
      </div>

      {/* Interim Diagnostic / Lab Slip Modal */}
      <InterimLabSlipModal
        isOpen={showLabSlipModal}
        patient={patient}
        investigations={investigations}
        doctorDetails={doctor}
        onClose={() => setShowLabSlipModal(false)}
      />
    </div>
  );
}
