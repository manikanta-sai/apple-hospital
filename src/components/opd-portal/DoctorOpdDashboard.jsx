import React from "react";
import PatientVisitsGraph from "./PatientVisitsGraph.jsx";
import PeakHoursHeatmap from "./PeakHoursHeatmap.jsx";
import WalkinVsTeleAppointmentsGraph from "./WalkinVsTeleAppointmentsGraph.jsx";
import ReferralsToMeGraph from "./ReferralsToMeGraph.jsx";
import AdmissionRecommendedGraph from "./AdmissionRecommendedGraph.jsx";
import PendingActionsCard from "./PendingActionsCard.jsx";
import AiTipsCard from "./AiTipsCard.jsx";
import ScrollReveal from "../common/ScrollReveal.jsx";

export default function DoctorOpdDashboard({
  patients = [],
  counts = {},
  doctorStatus = "ON DUTY",
  onSelectPatient = () => {},
  onGoToAppointments = () => {},
}) {
  return (
    <div className="space-y-7 pb-12 animate-slide-up">
      {/* ── Row 1 (2 Graphs per row): Patient Visits Overview & Peak Consultation Hours (9am-4pm) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <ScrollReveal delay={50} className="h-full">
          <div className="h-full">
            <PatientVisitsGraph />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={120} className="h-full">
          <div className="h-full">
            <PeakHoursHeatmap />
          </div>
        </ScrollReveal>
      </div>

      {/* ── Row 2 (2 Graphs per row): Walk-in vs. Tele-Consultations & Inbound Referrals to Me ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <ScrollReveal delay={100} className="h-full">
          <div className="h-full">
            <WalkinVsTeleAppointmentsGraph />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={160} className="h-full">
          <div className="h-full">
            <ReferralsToMeGraph />
          </div>
        </ScrollReveal>
      </div>

      {/* ── Row 3 (2 Cards per row): Inpatient Admissions Recommended & Pending Doctor Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <ScrollReveal delay={100} className="h-full">
          <div className="h-full">
            <AdmissionRecommendedGraph />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={160} className="h-full">
          <div className="h-full">
            <PendingActionsCard
              patients={patients}
              onSelectPatient={onSelectPatient}
              onGoToAppointments={onGoToAppointments}
            />
          </div>
        </ScrollReveal>
      </div>

      {/* ── Row 4: AI Copilot Clinical Practice Insights ── */}
      <ScrollReveal delay={150}>
        <div>
          <AiTipsCard />
        </div>
      </ScrollReveal>
    </div>
  );
}
