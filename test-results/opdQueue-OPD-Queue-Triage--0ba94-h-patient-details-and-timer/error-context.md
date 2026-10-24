# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: opdQueue.spec.js >> OPD Queue & Triage Screen (Phase 2) >> displays Active Desk Spotlight Banner with patient details and timer
- Location: tests\opdQueue.spec.js:33:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Live Consultation in Progress')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Live Consultation in Progress') with timeout 10000ms
  - waiting for getByText('Live Consultation in Progress')

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
  - text: "Updated: 12:40 PM"
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
  3   | test.describe('OPD Queue & Triage Screen (Phase 2)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/opd');
  6   |     await page.waitForFunction(() => !!window.hospitalDb && !!window.hospitalDbSeed);
  7   |     // Reset database to ensure clean baseline for tests
  8   |     await page.evaluate(async () => {
  9   |       await window.hospitalDbSeed.resetDatabase(window.hospitalDb);
  10  |     });
  11  |     // Wait for reactive render
  12  |     await page.waitForTimeout(500);
  13  |   });
  14  | 
  15  |   test('displays hospital branding and real-time KPI counters', async ({ page }) => {
  16  |     // Branding & Single Hospital Eyebrow
  17  |     await expect(page.getByText('ABCD Multispecialty Hospital').first()).toBeVisible();
  18  |     await expect(page.getByRole('heading', { name: /OPD Queue & Triage Desk/i })).toBeVisible();
  19  |     await expect(page.getByText('Dept: General Medicine', { exact: false })).toBeVisible();
  20  |     await expect(page.getByText('Dr. Rajesh Sharma, MD', { exact: false }).first()).toBeVisible();
  21  | 
  22  |     // KPI Counters (Non-clickable clean summary cards)
  23  |     await expect(page.getByText('Total Today')).toBeVisible();
  24  |     await expect(page.getByText('In Waiting')).toBeVisible();
  25  |     await expect(page.getByText('Active Desk')).toBeVisible();
  26  |     await expect(page.getByText('At Lab (Drafts)')).toBeVisible();
  27  |     await expect(page.getByText('Finished Visits')).toBeVisible();
  28  | 
  29  |     // Active Desk has live badge
  30  |     await expect(page.getByText('LIVE', { exact: true })).toBeVisible();
  31  |   });
  32  | 
  33  |   test('displays Active Desk Spotlight Banner with patient details and timer', async ({ page }) => {
  34  |     // In-consultation patient Anita Verma
> 35  |     await expect(page.getByText('Live Consultation in Progress')).toBeVisible();
      |                                                                   ^ Error: expect(locator).toBeVisible() failed
  36  |     await expect(page.getByText('#W-04').first()).toBeVisible();
  37  |     await expect(page.getByRole('heading', { name: 'Anita Verma' })).toBeVisible();
  38  |     await expect(page.getByText('UHID: UHID-10482')).toBeVisible();
  39  |     await expect(page.getByText('BP: 110/70', { exact: false })).toBeVisible();
  40  |     await expect(page.getByText('2nd Trimester', { exact: false })).toBeVisible();
  41  |     await expect(page.getByText('Penicillin', { exact: false }).first()).toBeVisible();
  42  | 
  43  |     // Actions
  44  |     await expect(page.getByRole('button', { name: /Resume Consultation Room/ })).toBeVisible();
  45  |     await expect(page.getByRole('button', { name: /Mark Draft - Send to Lab/ })).toBeVisible();
  46  |     await expect(page.getByRole('button', { name: /Complete & Sign/ })).toBeVisible();
  47  |   });
  48  | 
  49  |   test('displays all multi-lane triage columns with merged walk-in & online lane', async ({ page }) => {
  50  |     // Lane 1: OPD Lobby (Waiting Pool)
  51  |     await expect(page.getByRole('heading', { name: /OPD Lobby \(Waiting Pool\)/i })).toBeVisible();
  52  |     await expect(page.getByText('Vikram Singh')).toBeVisible();
  53  |     await expect(page.getByText('#W-05')).toBeVisible();
  54  |     await expect(page.getByText('Rajesh Patel')).toBeVisible();
  55  |     await expect(page.getByText('#ON-12')).toBeVisible();
  56  | 
  57  |     // Lane 2: Tele-Consult
  58  |     await expect(page.getByRole('heading', { name: /Tele-Consult \(Waiting\)/i })).toBeVisible();
  59  |     await expect(page.getByText('Sunita Devi')).toBeVisible();
  60  |     await expect(page.getByText('#TC-02')).toBeVisible();
  61  | 
  62  |     // Lane 3: Sent for Labs (Drafts)
  63  |     await expect(page.getByRole('heading', { name: /Sent for Labs \(Draft\)/i })).toBeVisible();
  64  |     await expect(page.getByText('Rahul Roy')).toBeVisible();
  65  |     await expect(page.getByText('#W-01')).toBeVisible();
  66  | 
  67  |     // Lane 4: Completed
  68  |     await expect(page.getByRole('heading', { name: /Completed & Finalized/i })).toBeVisible();
  69  |     await expect(page.getByText('Priya Das')).toBeVisible();
  70  |     await expect(page.getByText('#W-02')).toBeVisible();
  71  | 
  72  |     // Lane 5: No-Show / Cancelled
  73  |     await expect(page.getByRole('heading', { name: /No-Show \/ Cancelled/i })).toBeVisible();
  74  |   });
  75  | 
  76  |   test('filters patients in real-time by search query', async ({ page }) => {
  77  |     const searchInput = page.getByPlaceholder(/Search by Patient Name, UHID/i);
  78  | 
  79  |     // Search by Name
  80  |     await searchInput.fill('Vikram');
  81  |     await expect(page.getByText('Vikram Singh')).toBeVisible();
  82  |     await expect(page.getByText('Rajesh Patel')).toHaveCount(0);
  83  |     await expect(page.getByText('Sunita Devi')).toHaveCount(0);
  84  | 
  85  |     // Search by UHID
  86  |     await searchInput.fill('10484');
  87  |     await expect(page.getByText('Rajesh Patel')).toBeVisible();
  88  |     await expect(page.getByText('Vikram Singh')).toHaveCount(0);
  89  | 
  90  |     // Clear search
  91  |     await searchInput.fill('');
  92  |     await expect(page.getByText('Vikram Singh')).toBeVisible();
  93  |     await expect(page.getByText('Rajesh Patel')).toBeVisible();
  94  |   });
  95  | 
  96  |   test('toggles doctor duty status between ON DUTY, ON ROUNDS, IN SURGERY, OUT OF OFFICE, STANDBY', async ({ page }) => {
  97  |     // Open duty menu in top header
  98  |     const dutyButton = page.getByRole('button', { name: /ON DUTY/i }).first();
  99  |     await dutyButton.click();
  100 | 
  101 |     // Select "ON ROUNDS"
  102 |     await page.getByRole('button', { name: /ON ROUNDS/i }).first().click();
  103 |     await expect(page.getByRole('button', { name: /ON ROUNDS/i }).first()).toBeVisible();
  104 | 
  105 |     // Change to "IN SURGERY"
  106 |     const onRoundsButton = page.getByRole('button', { name: /ON ROUNDS/i }).first();
  107 |     await onRoundsButton.click();
  108 |     await page.getByRole('button', { name: /IN SURGERY/i }).first().click();
  109 |     await expect(page.getByRole('button', { name: /IN SURGERY/i }).first()).toBeVisible();
  110 |   });
  111 | 
  112 |   test('opens quick walk-in intake modal and captures 2-field BP, height, weight, pulse with no blood group', async ({ page }) => {
  113 |     await page.getByRole('button', { name: /\+ Quick Walk-in Intake/i }).click();
  114 | 
  115 |     // Modal is visible
  116 |     await expect(page.getByText('Quick Walk-in Patient Intake')).toBeVisible();
  117 | 
  118 |     // Verify BP has SYS and DIA fields
  119 |     await expect(page.getByPlaceholder('120')).toBeVisible();
  120 |     await expect(page.getByPlaceholder('80')).toBeVisible();
  121 |     await expect(page.getByText('SYS')).toBeVisible();
  122 |     await expect(page.getByText('DIA')).toBeVisible();
  123 | 
  124 |     // Verify weight, height, pulse and BMI
  125 |     await expect(page.getByText('Weight (kg)')).toBeVisible();
  126 |     await expect(page.getByText('Height (cm)')).toBeVisible();
  127 |     await expect(page.getByText('Pulse (BPM)')).toBeVisible();
  128 |     await expect(page.getByText(/BMI:/i)).toBeVisible();
  129 | 
  130 |     // Verify Blood Group field is removed
  131 |     await expect(page.getByText('Blood Group')).toHaveCount(0);
  132 | 
  133 |     // Close modal
  134 |     await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  135 |     await expect(page.getByText('Quick Walk-in Patient Intake')).toHaveCount(0);
```