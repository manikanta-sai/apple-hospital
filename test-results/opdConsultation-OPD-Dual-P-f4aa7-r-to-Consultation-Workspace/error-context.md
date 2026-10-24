# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: opdConsultation.spec.js >> OPD Dual-Pane Consultation & Digital Prescription Workspace (Phase 3) >> navigates from Active Desk Spotlight Banner to Consultation Workspace
- Location: tests\opdConsultation.spec.js:13:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Resume Consultation Room/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('button', { name: /Resume Consultation Room/i }) with timeout 10000ms
  - waiting for getByRole('button', { name: /Resume Consultation Room/i })

```

```yaml
- complementary:
  - img
  - button "Expand menu":
    - img
  - navigation:
    - button "Dashboard":
      - img
    - button "Appointments":
      - img
    - button "Doctor Profile":
      - img
- main:
  - button "Back to Home":
    - img
  - text: ABCD Multispecialty Hospital OPD CLINICAL PORTAL • ROOM 104
  - heading "Doctor OPD Consultation Workspace & Analytics" [level=1]
  - text: "Doctor: ON DUTY"
  - button "Open Live Queue (14)"
  - heading "Patient Visits Overview" [level=3]
  - paragraph: Doctor consultation throughput & patient volume distribution
  - button "Weekly":
    - text: Weekly
    - img
  - text: 10k 8k 6k 5k 4k 2k 0 Target Benchmark
  - paragraph: Total Patients
  - text: "860"
  - img
  - text: Mon High Rush
  - paragraph: Total Patients
  - text: "320"
  - img
  - text: Tue Low Visits
  - paragraph: Total Patients
  - text: "710"
  - img
  - text: Wed Midweek
  - paragraph: Total Patients
  - text: "660"
  - img
  - text: Thu Normal
  - paragraph: Total Patients
  - text: "540"
  - img
  - text: Fri Average
  - paragraph: Total Patients
  - text: "520"
  - img
  - text: Sat Weekend Clinic
  - img
  - text: "Total Patients:"
  - strong: 3,610
  - img
  - text: Optimal Clinical Capacity • 94% Completion
  - heading "Peak Consultation Hours" [level=3]
  - text: 09:00 AM – 04:00 PM
  - paragraph: Hourly patient arrival rush & OPD desk density (Core consultation hours)
  - button "13 Oct – 19 Oct 2026":
    - img
    - text: 13 Oct – 19 Oct 2026
    - img
  - text: 09:00 AM 10:00 AM 11:00 AM 12:00 PM 01:00 PM 02:00 PM 03:00 PM 04:00 PM Sun Mon Tue Wed Thu Fri Sat
  - img
  - text: "Peak Slot:"
  - strong: Mon, 10:00 AM – 11:00 AM (22 Pts)
  - text: Light Peak Rush
  - heading "Walk-In vs. Telehealth Consultations" [level=3]
  - paragraph: Consultation volume comparison by channel (In-Person OPD Lobby vs. Virtual Tele-Clinic)
  - button "Weekly":
    - img
    - text: Weekly
    - img
  - img
  - text: Walk-In OPD 2,680 (74%) Avg 14 min
  - img
  - text: Tele-Consult 930 (26%) Avg 9 min 640 220 Mon Peak Rush 240 80 Tue Low Visits 530 180 Wed Midweek Steady 490 170 Thu Normal 400 140 Fri Average 380 140 Sat Weekend Clinic Walk-In (In-Person) Telehealth Consultation Tuesday is Lowest Volume • Friday is Weekly Average
  - heading "Inbound Referrals to Me" [level=3]
  - text: Cross-Dept
  - paragraph: Patients routed to General Medicine by other clinical departments
  - button "Past 30 Days":
    - img
    - text: Past 30 Days
    - img
  - text: Total Inbound
  - strong: "48"
  - img
  - text: Pending Review
  - strong: "9"
  - img
  - text: Evaluated & Rx
  - strong: "35"
  - text: Cardiology via Dr. Arvind Swamy
  - strong: "14"
  - text: cases Orthopedics via Dr. Meera Iyer
  - strong: "11"
  - text: cases Gynecology & OB via Dr. Sunita Rao
  - strong: "9"
  - text: cases General Surgery via Dr. V. K. Bansal
  - strong: "7"
  - text: cases Emergency Triage via Dr. Sameer Khan
  - strong: "5"
  - text: cases Oncology Daycare via Dr. Anita Desai
  - strong: "2"
  - text: cases
  - img
  - text: "Top Referring Dept:"
  - strong: Cardiology (HTN/Metabolic)
  - text: Fast-Track OPD Active
  - heading "Admissions Recommended" [level=3]
  - text: Inpatient Triage
  - paragraph: Doctor recommendations for Emergency & Inpatient Ward admission
  - button "Past 30 Days":
    - img
    - text: Past 30 Days
    - img
  - text: Total Admissions
  - strong: "24"
  - img
  - text: Admission Rate
  - strong: 10.9%
  - img
  - text: OPD Managed
  - strong: "196"
  - text: General Medical Ward Standard inpatient bed
  - strong: "16"
  - text: (67%) ICU / High Dependency (HDU) Critical hemodynamic care
  - strong: "3"
  - text: (12%) Daycare Observation (6–8h) IV Fluids & Monitored Rx
  - strong: "5"
  - text: (21%)
  - img
  - text: "Bed Management:"
  - strong: Direct IPD Desk Route
  - text: NABH Standard Compliant
  - img
  - heading "Pending Actions 5 Action Items" [level=4]
  - paragraph: Requires doctor review or signature
  - text: Urgent Attention
  - img
  - strong: Complete Active Consultation (Anita Verma)
  - paragraph: "Token #W-04 • Prescription drafted. Awaiting doctor final review & sign."
  - button "Resume Desk":
    - text: Resume Desk
    - img
  - img
  - strong: Lab Investigation Reports Ready (Rahul Roy)
  - paragraph: "Token #W-01 • CBC, LFT & Ultrasound ready. Print locked until finalized."
  - button "Review Labs":
    - text: Review Labs
    - img
  - img
  - strong: Lab Investigation Reports Ready (Sunil Hegde)
  - paragraph: "Token #W-14 • CBC, LFT & Ultrasound ready. Print locked until finalized."
  - button "Review Labs":
    - text: Review Labs
    - img
  - img
  - strong: Lab Investigation Reports Ready (Pooja Chawla)
  - paragraph: "Token #W-15 • CBC, LFT & Ultrasound ready. Print locked until finalized."
  - button "Review Labs":
    - text: Review Labs
    - img
  - img
  - strong: Lab Investigation Reports Ready (Dinesh Pillai)
  - paragraph: "Token #W-16 • CBC, LFT & Ultrasound ready. Print locked until finalized."
  - button "Review Labs":
    - text: Review Labs
    - img
  - img
  - strong: Critical Clinical Allergy Notice (Anita Verma)
  - paragraph: "Token #W-04 has recorded Penicillin allergy. Beta-lactams contraindicated."
  - button "Inspect":
    - text: Inspect
    - img
  - text: Auto-synced with hospital laboratory
  - button "View Queue Board →"
  - img
  - heading "AI Clinical Copilot Tips Live Insights" [level=4]
  - paragraph: Proactive intelligence for your OPD shift
  - text: "Updated: 12:36 PM"
  - img
  - text: Expected Queue Influx at 11:30 AM – 01:00 PM Predictive Analytics
  - paragraph: Based on online appointment slots and typical walk-in velocity, expect 8–10 arrivals in this window. Consider pre-triaging routine follow-ups.
  - img
  - text: Seasonal Viral Pharyngitis Protocol Clinical Protocol
  - paragraph: 72% of cough/fever presentations this week are viral. Recommend symptomatic hydration and steam inhalation before second-line antibiotics.
  - img
  - text: Active Allergy Flags in Waiting Room Patient Safety
  - paragraph: 2 patients in today's pool have severe Penicillin allergies. AI CDSS will automatically block contraindications during prescription drafting.
  - img
  - text: 88% Follow-Up Return Rate Quality Metric
  - paragraph: Your outpatient prescription clarity score has increased follow-up compliance by +12% compared to the hospital department baseline.
  - img
  - text: NABH Evidence-Based Guidance Model Auto-Refreshed
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('OPD Dual-Pane Consultation & Digital Prescription Workspace (Phase 3)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/opd');
  6   |     await page.waitForFunction(() => !!window.hospitalDb && !!window.hospitalDbSeed);
  7   |     await page.evaluate(async () => {
  8   |       await window.hospitalDbSeed.resetDatabase(window.hospitalDb);
  9   |     });
  10  |     await page.waitForTimeout(500);
  11  |   });
  12  | 
  13  |   test('navigates from Active Desk Spotlight Banner to Consultation Workspace', async ({ page }) => {
  14  |     // Click Resume Consultation Room on Anita Verma (#W-04)
  15  |     const resumeBtn = page.getByRole('button', { name: /Resume Consultation Room/i });
> 16  |     await expect(resumeBtn).toBeVisible();
      |                             ^ Error: expect(locator).toBeVisible() failed
  17  |     await resumeBtn.click();
  18  | 
  19  |     // Verify URL
  20  |     await expect(page).toHaveURL(/.*opd-consultation.*/);
  21  | 
  22  |     // Verify Consultation Patient Header
  23  |     await expect(page.getByText('Anita Verma').first()).toBeVisible();
  24  |     await expect(page.getByText('#W-04').first()).toBeVisible();
  25  |     await expect(page.getByText('UHID-10482').first()).toBeVisible();
  26  |     await expect(page.getByText('Penicillin (Severe)').first()).toBeVisible();
  27  |     await expect(page.getByText(/Pregnant/i).first()).toBeVisible();
  28  | 
  29  |     // Verify Dual-Pane layout: Section nav pills in left pane
  30  |     await expect(page.getByRole('button', { name: 'Complaints' })).toBeVisible();
  31  |     await expect(page.getByRole('button', { name: 'Examination' })).toBeVisible();
  32  |     await expect(page.getByRole('button', { name: 'Diagnosis' })).toBeVisible();
  33  |     await expect(page.getByRole('button', { name: 'Medications (Rx)' })).toBeVisible();
  34  |     await expect(page.getByRole('button', { name: 'Lab Orders' })).toBeVisible();
  35  |     await expect(page.getByRole('button', { name: 'Advice & Review' })).toBeVisible();
  36  | 
  37  |     // Verify Right Pane: Live A4 Prescription Sheet
  38  |     await expect(page.getByText('ABCD Multispecialty Hospital').first()).toBeVisible();
  39  |     await expect(page.getByText('Live A4 Prescription Preview')).toBeVisible();
  40  |     await expect(page.getByText('Dr. Rajesh Sharma, MD').first()).toBeVisible();
  41  |     await expect(page.getByText('NMC-48291').first()).toBeVisible();
  42  |     await expect(page.getByText('Prescribed Medications')).toBeVisible();
  43  |   });
  44  | 
  45  |   test('allows ordering an investigation and reacts on the A4 prescription preview', async ({ page }) => {
  46  |     // Open Anita Verma consultation
  47  |     await page.goto('/opd-consultation?patientId=patient-004');
  48  |     await page.waitForFunction(() => !!window.hospitalDb);
  49  |     await page.waitForTimeout(400);
  50  | 
  51  |     // Click on preset test "Complete Blood Count (CBC)"
  52  |     const cbcPreset = page.getByRole('button', { name: /\+ Complete Blood Count \(CBC\)/i });
  53  |     await expect(cbcPreset).toBeVisible();
  54  |     await cbcPreset.click();
  55  | 
  56  |     // Verify it appears in Requisition Queue on the left
  57  |     await expect(page.getByText('Complete Blood Count (CBC)').first()).toBeVisible();
  58  | 
  59  |     // Verify it is reflected on the right-pane A4 sheet
  60  |     const rxSheet = page.locator('#digital-prescription-sheet');
  61  |     await expect(rxSheet.getByText('Complete Blood Count (CBC)')).toBeVisible();
  62  |   });
  63  | 
  64  |   test('allows saving draft prescription and displays confirmation toast', async ({ page }) => {
  65  |     await page.goto('/opd-consultation?patientId=patient-004');
  66  |     await page.waitForFunction(() => !!window.hospitalDb);
  67  |     await page.waitForTimeout(400);
  68  | 
  69  |     // Click Save Draft
  70  |     const saveDraftBtn = page.getByRole('button', { name: /Save Draft/i }).first();
  71  |     await expect(saveDraftBtn).toBeVisible();
  72  |     await saveDraftBtn.click();
  73  | 
  74  |     // Verify toast notification
  75  |     await expect(page.getByText(/Draft prescription saved successfully/i)).toBeVisible();
  76  |   });
  77  | 
  78  |   test('sends patient to lab queue and redirects back to OPD Lobby', async ({ page }) => {
  79  |     await page.goto('/opd-consultation?patientId=patient-004');
  80  |     await page.waitForFunction(() => !!window.hospitalDb);
  81  |     await page.waitForTimeout(400);
  82  | 
  83  |     // Click Mark Draft - Send to Lab
  84  |     const sendToLabBtn = page.getByRole('button', { name: /Mark Draft - Send to Lab/i });
  85  |     await expect(sendToLabBtn).toBeVisible();
  86  |     await sendToLabBtn.click();
  87  | 
  88  |     // Redirects back to /opd
  89  |     await page.waitForURL('**/opd', { timeout: 8000 });
  90  |     await expect(page.getByRole('heading', { name: /OPD Queue & Triage Desk/i })).toBeVisible();
  91  | 
  92  |     // Verify Anita Verma is now in Lane 3: Sent for Labs (Draft)
  93  |     const labsLane = page.getByRole('heading', { name: /Sent for Labs \(Draft\)/i });
  94  |     await expect(labsLane).toBeVisible();
  95  |     await expect(page.getByText('Anita Verma')).toBeVisible();
  96  |   });
  97  | 
  98  |   test('back button returns to OPD Lobby', async ({ page }) => {
  99  |     await page.goto('/opd-consultation?patientId=patient-004');
  100 |     await page.waitForFunction(() => !!window.hospitalDb);
  101 |     await page.waitForTimeout(400);
  102 | 
  103 |     // Click Return to OPD Queue
  104 |     const backBtn = page.getByRole('button', { name: /Return to OPD Queue/i });
  105 |     await expect(backBtn).toBeVisible();
  106 |     await backBtn.click();
  107 | 
  108 |     // Verified on /opd
  109 |     await expect(page).toHaveURL(/.*opd.*/);
  110 |     await expect(page.getByRole('heading', { name: /OPD Queue & Triage Desk/i })).toBeVisible();
  111 |   });
  112 | });
  113 | 
```