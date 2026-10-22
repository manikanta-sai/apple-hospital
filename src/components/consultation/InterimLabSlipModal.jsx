import React from "react";
import {
  Printer,
  X,
  FlaskConical,
  Building2,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function InterimLabSlipModal({
  isOpen,
  patient = {},
  investigations = [],
  doctorDetails = {},
  onClose = () => {},
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Toolbar (hidden on print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Interim Diagnostic / Lab Requisition Slip
              </h3>
              <p className="text-xs text-slate-500">
                Authorizes sample collection while prescription remains in Draft
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Requisition Document */}
        <div className="flex-1 overflow-y-auto py-4 text-xs text-slate-800 space-y-4">
          {/* Header */}
          <div className="border-b-2 border-indigo-600 pb-2.5 flex items-start justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                APPLE MULTISPECIALTY HOSPITAL
              </h2>
              <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                Department of Laboratory Medicine & Radiodiagnostics
              </p>
              <p className="text-[10px] text-slate-400">
                Sample Collection Center • OPD Basement Wing
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                LAB REQUISITION
              </span>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Date: {new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          {/* Patient Strip */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient</span>
              <strong className="text-slate-900">{patient.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Age / Gender</span>
              <strong>{patient.age}y / {patient.gender}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">UHID</span>
              <strong className="font-mono">{patient.uhid}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Token</span>
              <strong className="font-mono">{patient.tokenNumber}</strong>
            </div>
          </div>

          {/* Ordered Tests List */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Tests Requested by Physician ({investigations.length})
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {investigations.map((test, idx) => (
                <div
                  key={idx}
                  className="p-2.5 flex items-center justify-between hover:bg-slate-50/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <strong className="text-xs text-slate-800">{test.testName}</strong>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {test.category || "Blood / Pathology"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fasting / Pre-test Instructions */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            <strong>Phlebotomy & Patient Note:</strong> Please present this slip at Sample Collection Counter #3. If fasting blood sugar or lipid profile is ordered, ensure 10–12 hours overnight fasting.
          </div>

          {/* Physician Auth Footer */}
          <div className="pt-4 flex items-end justify-between border-t border-slate-200 text-xs">
            <div>
              <p className="text-[10.5px] text-slate-500">
                Ordered by: {doctorDetails.name || "Dr. Rajesh Sharma, MD"}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Doctor Reg No: {doctorDetails.regNo || "NMC-48291"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400">Authorized Medical Officer</p>
              <span className="font-serif italic font-bold text-indigo-900 text-sm">
                Dr. R. Sharma
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer (hidden on print) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Official NABH Interim Slip</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
