import { test, expect } from '@playwright/test';

test.describe('OPD Queue & Triage Screen (Phase 2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/opd');
    await page.waitForFunction(() => !!window.hospitalDb && !!window.hospitalDbSeed);
    // Reset database to ensure clean baseline for tests
    await page.evaluate(async () => {
      await window.hospitalDbSeed.resetDatabase(window.hospitalDb);
    });
    // Wait for reactive render
    await page.waitForTimeout(500);
  });

  test('displays hospital branding and real-time KPI counters', async ({ page }) => {
    // Branding & Single Hospital Eyebrow
    await expect(page.getByText('ABCD Multispecialty Hospital').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /OPD Queue & Triage Desk/i })).toBeVisible();
    await expect(page.getByText('Dept: General Medicine', { exact: false })).toBeVisible();
    await expect(page.getByText('Dr. Rajesh Sharma, MD', { exact: false }).first()).toBeVisible();

    // KPI Counters (Non-clickable clean summary cards)
    await expect(page.getByText('Total Today')).toBeVisible();
    await expect(page.getByText('In Waiting')).toBeVisible();
    await expect(page.getByText('Active Desk')).toBeVisible();
    await expect(page.getByText('At Lab (Drafts)')).toBeVisible();
    await expect(page.getByText('Finished Visits')).toBeVisible();

    // Active Desk has live badge
    await expect(page.getByText('LIVE', { exact: true })).toBeVisible();
  });

  test('displays Active Desk Spotlight Banner with patient details and timer', async ({ page }) => {
    // In-consultation patient Anita Verma
    await expect(page.getByText('Live Consultation in Progress')).toBeVisible();
    await expect(page.getByText('#W-04').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Anita Verma' })).toBeVisible();
    await expect(page.getByText('UHID: UHID-10482')).toBeVisible();
    await expect(page.getByText('BP: 110/70', { exact: false })).toBeVisible();
    await expect(page.getByText('2nd Trimester', { exact: false })).toBeVisible();
    await expect(page.getByText('Penicillin', { exact: false }).first()).toBeVisible();

    // Actions
    await expect(page.getByRole('button', { name: /Resume Consultation Room/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Mark Draft - Send to Lab/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Complete & Sign/ })).toBeVisible();
  });

  test('displays all multi-lane triage columns with merged walk-in & online lane', async ({ page }) => {
    // Lane 1: OPD Lobby (Waiting Pool)
    await expect(page.getByRole('heading', { name: /OPD Lobby \(Waiting Pool\)/i })).toBeVisible();
    await expect(page.getByText('Vikram Singh')).toBeVisible();
    await expect(page.getByText('#W-05')).toBeVisible();
    await expect(page.getByText('Rajesh Patel')).toBeVisible();
    await expect(page.getByText('#ON-12')).toBeVisible();

    // Lane 2: Tele-Consult
    await expect(page.getByRole('heading', { name: /Tele-Consult \(Waiting\)/i })).toBeVisible();
    await expect(page.getByText('Sunita Devi')).toBeVisible();
    await expect(page.getByText('#TC-02')).toBeVisible();

    // Lane 3: Sent for Labs (Drafts)
    await expect(page.getByRole('heading', { name: /Sent for Labs \(Draft\)/i })).toBeVisible();
    await expect(page.getByText('Rahul Roy')).toBeVisible();
    await expect(page.getByText('#W-01')).toBeVisible();

    // Lane 4: Completed
    await expect(page.getByRole('heading', { name: /Completed & Finalized/i })).toBeVisible();
    await expect(page.getByText('Priya Das')).toBeVisible();
    await expect(page.getByText('#W-02')).toBeVisible();

    // Lane 5: No-Show / Cancelled
    await expect(page.getByRole('heading', { name: /No-Show \/ Cancelled/i })).toBeVisible();
  });

  test('filters patients in real-time by search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by Patient Name, UHID/i);

    // Search by Name
    await searchInput.fill('Vikram');
    await expect(page.getByText('Vikram Singh')).toBeVisible();
    await expect(page.getByText('Rajesh Patel')).toHaveCount(0);
    await expect(page.getByText('Sunita Devi')).toHaveCount(0);

    // Search by UHID
    await searchInput.fill('10484');
    await expect(page.getByText('Rajesh Patel')).toBeVisible();
    await expect(page.getByText('Vikram Singh')).toHaveCount(0);

    // Clear search
    await searchInput.fill('');
    await expect(page.getByText('Vikram Singh')).toBeVisible();
    await expect(page.getByText('Rajesh Patel')).toBeVisible();
  });

  test('toggles doctor duty status between ON DUTY, ON ROUNDS, IN SURGERY, OUT OF OFFICE, STANDBY', async ({ page }) => {
    // Open duty menu in top header
    const dutyButton = page.getByRole('button', { name: /ON DUTY/i }).first();
    await dutyButton.click();

    // Select "ON ROUNDS"
    await page.getByRole('button', { name: /ON ROUNDS/i }).first().click();
    await expect(page.getByRole('button', { name: /ON ROUNDS/i }).first()).toBeVisible();

    // Change to "IN SURGERY"
    const onRoundsButton = page.getByRole('button', { name: /ON ROUNDS/i }).first();
    await onRoundsButton.click();
    await page.getByRole('button', { name: /IN SURGERY/i }).first().click();
    await expect(page.getByRole('button', { name: /IN SURGERY/i }).first()).toBeVisible();
  });

  test('opens quick walk-in intake modal and captures 2-field BP, height, weight, pulse with no blood group', async ({ page }) => {
    await page.getByRole('button', { name: /\+ Quick Walk-in Intake/i }).click();

    // Modal is visible
    await expect(page.getByText('Quick Walk-in Patient Intake')).toBeVisible();

    // Verify BP has SYS and DIA fields
    await expect(page.getByPlaceholder('120')).toBeVisible();
    await expect(page.getByPlaceholder('80')).toBeVisible();
    await expect(page.getByText('SYS')).toBeVisible();
    await expect(page.getByText('DIA')).toBeVisible();

    // Verify weight, height, pulse and BMI
    await expect(page.getByText('Weight (kg)')).toBeVisible();
    await expect(page.getByText('Height (cm)')).toBeVisible();
    await expect(page.getByText('Pulse (BPM)')).toBeVisible();
    await expect(page.getByText(/BMI:/i)).toBeVisible();

    // Verify Blood Group field is removed
    await expect(page.getByText('Blood Group')).toHaveCount(0);

    // Close modal
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.getByText('Quick Walk-in Patient Intake')).toHaveCount(0);
  });

  test('opens Admin Config modal and toggles section requirements', async ({ page }) => {
    await page.getByRole('button', { name: /Admin Config/i }).click();

    // Admin modal is visible
    await expect(page.getByText('OPD Clinical & Admin Settings')).toBeVisible();
    await expect(page.getByText('Chief Complaints')).toBeVisible();
    await expect(page.getByText('Vitals Monitoring')).toBeVisible();
    await expect(page.getByText('Lab Investigations')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.getByText('OPD Clinical & Admin Settings')).toHaveCount(0);
  });

  test('opens prescription preview modal for completed patient', async ({ page }) => {
    // Click View / Print Prescription on Priya Das
    await page.getByRole('button', { name: /View \/ Print Prescription/i }).click();

    // Prescription Modal
    await expect(page.getByText(/Finalized Clinical Prescription/i)).toBeVisible();
    await expect(page.locator('h2', { hasText: 'ABCD Multispecialty Hospital' })).toBeVisible();
    await expect(page.getByText(/Allergic Rhinitis/i)).toBeVisible();
    await expect(page.getByText('Tab. Bilastine 20mg', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: /Print Rx/i })).toBeVisible();

    // Close preview
    await page.locator('button:has(svg.lucide-x)').first().click();
    await expect(page.getByText(/Finalized Clinical Prescription/i)).toHaveCount(0);
  });

  test('calls waiting patient into active consultation desk', async ({ page }) => {
    // Click "Call / Start Consultation" on Vikram Singh
    const callButton = page.getByRole('button', { name: /Call \/ Start Consultation/i }).first();
    await callButton.click();

    // Active desk spotlight updates to Vikram Singh!
    await expect(page.getByRole('heading', { name: 'Vikram Singh' })).toBeVisible();
    await expect(page.getByText('#W-05').first()).toBeVisible();
    await expect(page.getByText('UHID: UHID-10483')).toBeVisible();
  });

  test('supports marking patient as No-Show and viewing via No-Show filter', async ({ page }) => {
    // Locate Vikram Singh card 3-dots menu button and click
    const menuButton = page.getByRole('button', { name: 'Update patient status' }).first();
    await menuButton.click();

    // Mark as No-Show
    await page.getByRole('button', { name: /Mark as No-Show \/ Cancel/i }).click();

    // Select the No-Show filter pill
    await page.getByRole('button', { name: /No-Show \/ Cancelled/i }).click();

    // Verify Vikram Singh is in the No-Show lane
    await expect(page.getByRole('heading', { name: 'Vikram Singh' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Re-admit to Queue/i })).toBeVisible();
  });
});
