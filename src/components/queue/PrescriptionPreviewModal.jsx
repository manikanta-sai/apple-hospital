import React from "react";
import { X, Printer, CheckCircle2, ShieldCheck, HeartPulse, Stethoscope, Building2 } from "lucide-react";

/**
 * PrescriptionPreviewModal
 * -------------------------
 * Renders a clean printable view of a finalized digital prescription.
 */
export default function PrescriptionPreviewModal({
  isOpen = false,
  onClose = () => {},
  patient = null,
  prescription = null,
}) {
  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  const rx = prescription || {};
  const medications = rx.medications || [];
  const investigations = rx.investigationsOrdered || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">
              Finalized Clinical Prescription • {patient.name} ({patient.tokenNumber})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Rx</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription Paper */}
        <div className="p-6 overflow-y-auto space-y-4 bg-white text-slate-800 print:p-0">
          {/* Hospital Header */}
          <div className="border-b-2 border-teal-800 pb-3 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">APPLE MULTISPECIALTY HOSPITAL</h2>
              <p className="text-xs text-slate-500">Outpatient Department (OPD) • General Medicine • Room 104</p>
              <p className="text-xs text-slate-500">100 Hospital Boulevard, Metro Health District</p>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-sm text-slate-900">{rx.doctorDetails?.name || "Dr. Rajesh Sharma, MD"}</h4>
              <p className="text-xs text-teal-800 font-semibold">{rx.doctorDetails?.department || "General Medicine"}</p>
              <p className="text-xs text-slate-500 font-mono">Reg: {rx.doctorDetails?.regNo || "NMC-48291"}</p>
            </div>
          </div>

          {/* Patient Details Bar */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-slate-400">Patient:</span>{" "}
              <strong className="text-slate-900">{patient.name}</strong>
            </div>
            <div>
              <span className="text-slate-400">Age/Gender:</span>{" "}
              <strong>{patient.age}y / {patient.gender}</strong>
            </div>
            <div>
              <span className="text-slate-400">UHID:</span>{" "}
              <strong className="font-mono">{patient.uhid}</strong>
            </div>
            <div>
              <span className="text-slate-400">Date:</span>{" "}
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
            {patient.vitals?.bp && (
              <div>
                <span className="text-slate-400">Vitals BP:</span>{" "}
                <strong>{patient.vitals.bp}</strong>
              </div>
            )}
            {patient.vitals?.pulse && (
              <div>
                <span className="text-slate-400">Pulse:</span>{" "}
                <strong>{patient.vitals.pulse} bpm</strong>
              </div>
            )}
            {patient.allergies?.length > 0 && (
              <div className="col-span-2 text-rose-700">
                <span className="text-slate-400">Allergies:</span>{" "}
                <strong>{patient.allergies.join(", ")}</strong>
              </div>
            )}
          </div>

          {/* Diagnosis */}
          {rx.diagnosis && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Diagnosis</h4>
              <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-200 text-xs">
                <strong>{rx.diagnosis.final || rx.diagnosis.provisional || "Clinical Examination Done"}</strong>
                {rx.diagnosis.icd10Code && (
                  <span className="ml-2 font-mono text-[11px] text-teal-700">
                    (ICD-10: {rx.diagnosis.icd10Code})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rx Medications */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="text-base text-teal-800 font-serif">℞</span>
              Medications Prescribed
            </h4>

            {medications.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-2.5">Medicine</th>
                      <th className="p-2.5">Dosage / Frequency</th>
                      <th className="p-2.5">Timing</th>
                      <th className="p-2.5">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medications.map((med, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5">
                          <strong className="text-slate-900">{med.drugName}</strong>
                          <div className="text-[11px] text-slate-500">{med.genericName}</div>
                          {med.instructions && (
                            <div className="text-[11px] text-teal-700 mt-0.5 italic">{med.instructions}</div>
                          )}
                        </td>
                        <td className="p-2.5 font-medium">{med.dosage} ({med.frequency})</td>
                        <td className="p-2.5">{med.timing}</td>
                        <td className="p-2.5">{med.durationDays} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No oral medications prescribed.</p>
            )}
          </div>

          {/* Investigations & Dietary Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {investigations.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-700 block mb-1">Investigations Ordered:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {investigations.map((inv, idx) => (
                    <li key={idx}>{inv.testName} ({inv.category})</li>
                  ))}
                </ul>
              </div>
            )}

            {rx.dietaryAdvice && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-700 block mb-1">Dietary & Lifestyle Advice:</strong>
                <p className="text-slate-600">{rx.dietaryAdvice}</p>
              </div>
            )}
          </div>

          {/* Follow Up */}
          {rx.followUp?.timeline && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div>
                <strong>Review / Follow-Up:</strong> {rx.followUp.timeline} ({rx.followUp.date || "SOS"})
                {rx.followUp.notes && <span className="block text-[11px] text-emerald-700 mt-0.5">{rx.followUp.notes}</span>}
              </div>
              <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          )}

          {/* Doctor Signature Block */}
          <div className="pt-6 flex justify-between items-end border-t border-slate-200">
            <div className="text-[11px] text-slate-400">
              Digitally Generated & Verified via HospitalOPD AI System
            </div>
            <div className="text-right">
              <div className="font-serif italic text-sm text-teal-900 font-bold mb-1">Dr. Rajesh Sharma</div>
              <div className="text-xs font-semibold text-slate-700">{rx.doctorDetails?.name || "Dr. Rajesh Sharma, MD"}</div>
              <div className="text-[10px] text-slate-400">Reg No: {rx.doctorDetails?.regNo || "NMC-48291"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
