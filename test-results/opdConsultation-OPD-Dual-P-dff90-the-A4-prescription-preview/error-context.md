# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: opdConsultation.spec.js >> OPD Dual-Pane Consultation & Digital Prescription Workspace (Phase 3) >> allows ordering an investigation and reacts on the A4 prescription preview
- Location: tests\opdConsultation.spec.js:45:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#digital-prescription-sheet').getByText('Complete Blood Count (CBC)')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('#digital-prescription-sheet').getByText('Complete Blood Count (CBC)') with timeout 10000ms
  - waiting for locator('#digital-prescription-sheet').getByText('Complete Blood Count (CBC)')

```

```yaml
- banner:
  - button "Back to Queue":
    - img
  - text: "ABCD Multispecialty Hospital OPD Consultation & AI Rx Desk #W-04"
  - heading "Anita Verma" [level=2]
  - text: "(28y / Female) UHID: UHID-10482 Walk-in Draft in Progress"
  - img
  - text: Pregnant (2nd Tri · 22w)
  - img
  - text: "Allergy: Penicillin (Severe)"
  - button "1 Prescription"
  - button "2 Print Preview"
  - button "Save Draft":
    - img
    - text: Save Draft
  - button "Finalize Rx":
    - img
    - text: Finalize Rx
  - button "Configure Mandatory Rules & Specialty Presets":
    - img
- main:
  - button "Expand Prescription Overview & NABH Checklist":
    - img
  - text: 6/6
  - button "Chief Complaints (Completed)":
    - img
  - button "Vitals Monitoring (Completed)":
    - img
  - button "Allergies & ADR (Completed)":
    - img
  - button "Clinical Examination (Completed)":
    - img
  - button "Diagnosis (ICD-10) (Completed)":
    - img
  - button "Medications Prescribed (℞) (Completed)":
    - img
  - button "Lab & Diagnostics (Completed)":
    - img
  - button "Dietary & Lifestyle Advice (Completed)":
    - img
  - button "Follow-Up & Review Plan (Completed)":
    - img
  - button "Referrals & Hospital IPD (Completed)":
    - img
  - button "Open Prescription Overview & NABH Checklist":
    - img
    - text: Open Prescription Overview & NABH Checklist
  - text: "Active: medications 1"
  - heading "Chief Complaints" [level=3]
  - text: NABH Mandatory
  - paragraph: Primary symptoms, duration, onset, and severity profile
  - text: 2 Recorded Severe morning nausea and persistent vomiting ⏱️ 4 Days Severe GI
  - button "Remove complaint":
    - img
  - text: Burning epigastric discomfort, retrosternal heartburn ⏱️ 4 Days Moderate GI
  - button "Remove complaint":
    - img
  - text: "Frequent OPD Complaints (Search or Type Free Text):"
  - textbox "Type or search complaint (e.g. Acute Fever, Cough, Headache)..."
  - button:
    - img
  - text: Duration
  - spinbutton: "3"
  - combobox:
    - option "Days" [selected]
    - option "Weeks"
    - option "Months"
  - text: Severity
  - combobox:
    - option "Mild"
    - option "Moderate" [selected]
    - option "Severe"
  - text: System / Part
  - combobox:
    - option "General" [selected]
    - option "ENT"
    - option "Respiratory"
    - option "Cardiovascular"
    - option "Gastrointestinal"
    - option "Musculoskeletal"
    - option "Dermatology"
    - option "Neurology"
    - option "Urology"
  - button "Add Complaint":
    - img
    - text: Add Complaint
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "2"
  - heading "Vitals & Biometric Parameters" [level=3]
  - text: NABH Mandatory
  - paragraph: Blood pressure, heart rate, temperature, SpO2, and BMI monitoring
  - text: "BP: 110/70"
  - img
  - text: Blood Pressure mmHg
  - textbox "120/80": 110/70
  - text: "Standard: 120/80 mmHg"
  - img
  - text: Heart Rate / Pulse bpm
  - spinbutton "72": "82"
  - text: "Normal: 60–100 bpm"
  - img
  - text: Oxygen (SpO2) %
  - spinbutton "99"
  - text: "Normal: 95%–100%"
  - img
  - text: Temperature °F
  - textbox "98.6": "98.4"
  - text: "Afebrile: 98.6°F"
  - img
  - text: Body Weight kg
  - spinbutton "65": "58"
  - text: Kilograms (kg)
  - img
  - text: Height cm
  - spinbutton "165"
  - text: Centimeters (cm) Body Mass Index (BMI) kg/m²
  - textbox: "22.5"
  - text: Normal (Healthy) Auto-derived
  - img
  - text: Blood Glucose (RBS) mg/dL
  - spinbutton "110"
  - text: Random blood sugar Vitals Clinical Remarks (Optional)
  - textbox "e.g. Patient rested 10 mins before BP check, bilateral arms equal..."
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "3"
  - heading "Allergies & Adverse Drug Reactions (ADR)" [level=3]
  - text: NABH Mandatory
  - paragraph: Medication contraindication screening and allergens
  - text: 1 Logged Screen patient for drug, food, and environmental hypersensitivity
  - button "Confirm NKDA":
    - img
    - text: Confirm NKDA
  - text: "Quick-Add Common Hospital Drug Allergies:"
  - button "Add Custom Allergen":
    - img
    - text: Add Custom Allergen
  - button "Penicillin":
    - img
    - text: Penicillin
  - button "Sulfa Drugs":
    - img
    - text: Sulfa Drugs
  - button "NSAIDs (Aspirin/Ibuprofen)":
    - img
    - text: NSAIDs (Aspirin/Ibuprofen)
  - button "Cephalosporins":
    - img
    - text: Cephalosporins
  - button "Ciprofloxacin":
    - img
    - text: Ciprofloxacin
  - button "Contrast Dye (Iodine)":
    - img
    - text: Contrast Dye (Iodine)
  - button "Latex":
    - img
    - text: Latex
  - button "Peanuts":
    - img
    - text: Peanuts
  - img
  - strong: Penicillin (Severe)
  - text: "Drug Severe Reaction: Urticaria / Rash"
  - button "Remove this allergy entry":
    - img
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "4"
  - heading "Clinical Examination & Systemic Observations" [level=3]
  - text: Clinical Notes
  - paragraph: General physical condition, systemic examination, and doctor notes
  - text: Document physical, systemic, and general examination findings
  - button "Insert Normal Template":
    - img
    - text: Insert Normal Template
  - text: "Quick Findings:"
  - button "+ Normal Chest Clear"
  - button "+ Bilateral Wheezing"
  - button "+ Inferior Turbinate Edema"
  - button "+ Epigastric Tenderness"
  - button "+ Knee Crepitus"
  - textbox "Enter systemic clinical examination findings (General, CVS, Resp, GI, CNS)...": Patient is 22 weeks gravid. Epigastric tenderness on palpation, no rebound or guarding. Mucous membranes slightly dry. Fetal heart sounds audible and rhythmic.
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "5"
  - heading "Clinical Diagnosis (ICD-10 Codification)" [level=3]
  - text: NABH Mandatory
  - paragraph: Provisional diagnosis, differential assessment, and WHO ICD-10 codes
  - text: Diagnosed Provisional Diagnosis (Type or Search)
  - textbox "Type or search diagnosis (e.g. Acute Viral Bronchitis)...": Hyperemesis Gravidarum with Acute Reflux Gastritis
  - button:
    - img
  - text: Final Diagnosis (Type or Search)
  - textbox "Type or search diagnosis (e.g. Essential Hypertension)..."
  - button:
    - img
  - text: ICD-10 Code Override (Optional)
  - textbox "e.g. I10, J06.9, E11.9...": O21.0
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "6"
  - heading "Medications Matrix Prescribed (℞)" [level=3]
  - text: NABH Mandatory
  - paragraph: Standard pharmacopeia dosing, timing, frequency, and total unit calculation
  - text: "2 Prescribed Frequent OPD Prescriptions (Quick Add):"
  - button "Tab. Paracetamol 650mg":
    - text: Tab. Paracetamol 650mg
    - img
  - button "Cap. Amox-Clav 625mg":
    - text: Cap. Amox-Clav 625mg
    - img
  - button "Tab. Azithromycin 500mg":
    - text: Tab. Azithromycin 500mg
    - img
  - button "Tab. Pantoprazole 40mg":
    - text: Tab. Pantoprazole 40mg
    - img
  - button "Tab. Montelukast 10mg + Levocetirizine 5mg":
    - text: Tab. Montelukast 10mg + Levocetirizine 5mg
    - img
  - button "Tab. Bilastine 20mg":
    - text: Tab. Bilastine 20mg
    - img
  - text: "Tab. Doxylamine + Pyridoxine Tablet 0-0-1 Before Food x 14 days Qty: 14"
  - paragraph: ↳ Take 1 tablet at bedtime for morning nausea control.
  - button "Remove medicine":
    - img
  - text: "Sucralfate Oral Suspension Syrup 1-0-1 Empty Stomach x 7 days Qty: 1"
  - paragraph: ↳ Take 10ml 1 hour before morning breakfast and dinner.
  - button "Remove medicine":
    - img
  - text: "Add New Medication: Frequent OPD Prescriptions (Search or Type Free Text) *"
  - textbox "Search prescription or type free text..."
  - button:
    - img
  - text: Dosage
  - textbox "e.g. 500mg": 500mg
  - text: Form
  - combobox:
    - option "Tablet" [selected]
    - option "Capsule"
    - option "Syrup"
    - option "Injection"
    - option "Drops"
    - option "Ointment"
    - option "Inhaler"
  - text: Frequency (Daily Dosing)
  - button "1-0-1"
  - button "1-0-0"
  - button "0-0-1"
  - button "1-1-1"
  - button "SOS"
  - text: Meal Timing
  - combobox:
    - option "After Food" [selected]
    - option "Before Food"
    - option "Empty Stomach"
    - option "At Bedtime"
  - text: Days (Duration)
  - spinbutton: "5"
  - textbox "Special instructions (e.g. take with plenty of water)...": Take after meals with water
  - button "Add Medication":
    - img
    - text: Add Medication
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "7"
  - heading "Diagnostic Lab & Radiology Investigations" [level=3]
  - text: Requisition Order
  - paragraph: Blood tests, urine analytics, imaging scans, and cardiology panels
  - text: 4 Ordered
  - img
  - text: "Frequent Hospital OPD Panels (Quick Add):"
  - button "✓ Complete Blood Count (CBC)" [disabled]
  - button "+ Liver Function Test (LFT)"
  - button "+ Kidney Function Test (KFT)"
  - button "+ HbA1c & Fasting Blood Sugar"
  - button "+ Lipid Profile"
  - button "+ Thyroid Profile (T3, T4, TSH)"
  - button "+ Urine Routine & Microscopy"
  - button "+ Chest X-Ray (PA View)"
  - text: "Frequent Hospital OPD Panels (Search or Type Free Text):"
  - textbox "Search hospital panel or type custom test..."
  - button:
    - img
  - combobox:
    - option "Blood" [selected]
    - option "Radiology"
    - option "Urine"
    - option "Cardiology"
    - option "Pathology"
    - option "Other"
  - button "Add" [disabled]:
    - img
    - text: Add
  - paragraph: "Requisition Queue:"
  - text: Urine Urine Routine & Ketones
  - button "Remove test":
    - img
  - text: Blood Serum Electrolytes (Na+, K+, Cl-)
  - button "Remove test":
    - img
  - text: Radiology Obstetric Ultrasound (Fetal Wellbeing)
  - button "Remove test":
    - img
  - text: Blood Complete Blood Count (CBC)
  - button "Remove test":
    - img
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "8"
  - heading "Dietary & Lifestyle Advice" [level=3]
  - text: Patient Instructions
  - paragraph: Patient care instructions, dietary precautions, and hydration guidance
  - text: "Documented Quick Dietary Presets:"
  - button "+ Low sodium, low fat diet. Regular 30-min walk…"
  - 'button "+ Diabetic diet: Avoid refined sugars, juices &…"'
  - button "+ Bland high-protein diet with plenty of oral f…"
  - button "+ Drink 3-4 liters of boiled water daily. Incre…"
  - button "+ Elevate head of bed during sleep. Avoid lying…"
  - textbox "Enter dietary guidelines, hydration instructions, physical activity restrictions...": Eat small, dry, bland meals (crackers, toast). Avoid spicy, fried, or acidic foods. Keep hydrated by sipping cold electrolyte or tender coconut water between meals.
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "9"
  - heading "Follow-Up & Review Plan" [level=3]
  - text: NABH Mandatory
  - paragraph: Next scheduled visit timeline, emergency SOS warnings, and repeat tests
  - text: "Review: 1 Week Select Review Schedule:"
  - button "3 Days"
  - button "5 Days"
  - button "1 Week"
  - button "2 Weeks"
  - button "1 Month"
  - button "SOS"
  - text: Follow-Up Target Date
  - textbox: 2026-10-29
  - text: Special Review Instructions & Warning Signs
  - textbox "e.g. Review with CBC report, or seek emergency SOS if fever spikes": Review with urine ketone and electrolyte results; seek emergency care if intractable vomiting occurs.
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - text: "10"
  - heading "Specialist Referrals & Hospital IPD Admission" [level=3]
  - text: Cross-Consultation
  - paragraph: Inter-department transfers, specialist referral reasons, and IPD ward bed requests
  - text: Obstetrics & Gynecology
  - img
  - heading "Inter-Department Specialist Referral" [level=4]
  - combobox:
    - option "-- No Department Referral --"
    - option "Cardiology"
    - option "Orthopedics"
    - option "Obstetrics & Gynecology" [selected]
    - option "General Surgery"
    - option "Pediatrics"
    - option "Neurology"
    - option "Pulmonology"
    - option "ENT"
    - option "Dermatology"
    - option "Gastroenterology"
    - option "Nephrology"
  - textbox "Doctor Name (Optional)": Dr. Sunita Kulkarni, MS (OBGYN)
  - textbox "Clinical reason for cross-consultation...": Antenatal review for hyperemesis management in 2nd trimester.
  - img
  - heading "Hospital IPD Admission" [level=4]
  - checkbox "Recommend Admit"
  - text: Recommend Admit
  - paragraph: Patient will be discharged home on outpatient medical therapy.
  - text: Autosaved
  - button "Save & Next":
    - text: Save & Next
    - img
  - heading "Full OPD Prescription Submission Desk" [level=4]
  - text: Full Save (All 10 Sections Combined)
  - paragraph:
    - strong: All 10 sections are unified into a single comprehensive OPD prescription.
    - text: You do not need to save each section individually. All changes automatically sync to local database in real-time.
  - text: ✓ Complaints ✓ Diagnosis ✓ Medications ✓ Follow-up
  - button "Save Full Draft (Ctrl+S)":
    - img
    - text: Save Full Draft (Ctrl+S)
  - button "Send to Labs":
    - img
    - text: Send to Labs
  - 'button "Step 3: Print Preview"':
    - img
    - text: "Step 3: Print Preview"
    - img
  - button "Finalize, Sign & Submit Rx":
    - img
    - text: Finalize, Sign & Submit Rx
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
  16  |     await expect(resumeBtn).toBeVisible();
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
> 61  |     await expect(rxSheet.getByText('Complete Blood Count (CBC)')).toBeVisible();
      |                                                                   ^ Error: expect(locator).toBeVisible() failed
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