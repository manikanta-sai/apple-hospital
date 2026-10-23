import { test, expect } from '@playwright/test';

test.describe('OPD Dual-Pane Consultation & Digital Prescription Workspace (Phase 3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/opd');
    await page.waitForFunction(() => !!window.hospitalDb && !!window.hospitalDbSeed);
    await page.evaluate(async () => {
      await window.hospitalDbSeed.resetDatabase(window.hospitalDb);
    });
    await page.waitForTimeout(500);
  });

  test('navigates from Active Desk Spotlight Banner to Consultation Workspace', async ({ page }) => {
    // Click Resume Consultation Room on Anita Verma (#W-04)
    const resumeBtn = page.getByRole('button', { name: /Resume Consultation Room/i });
    await expect(resumeBtn).toBeVisible();
    await resumeBtn.click();

    // Verify URL
    await expect(page).toHaveURL(/.*opd-consultation.*/);

    // Verify Consultation Patient Header
    await expect(page.getByText('Anita Verma').first()).toBeVisible();
    await expect(page.getByText('#W-04').first()).toBeVisible();
    await expect(page.getByText('UHID-10482').first()).toBeVisible();
    await expect(page.getByText('Penicillin (Severe)').first()).toBeVisible();
    await expect(page.getByText(/Pregnant/i).first()).toBeVisible();

    // Verify Dual-Pane layout: Section nav pills in left pane
    await expect(page.getByRole('button', { name: 'Complaints' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Examination' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Diagnosis' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Medications (Rx)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Lab Orders' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Advice & Review' })).toBeVisible();

    // Verify Right Pane: Live A4 Prescription Sheet
    await expect(page.getByText('ABCD Multispecialty Hospital').first()).toBeVisible();
    await expect(page.getByText('Live A4 Prescription Preview')).toBeVisible();
    await expect(page.getByText('Dr. Rajesh Sharma, MD').first()).toBeVisible();
    await expect(page.getByText('NMC-48291').first()).toBeVisible();
    await expect(page.getByText('Prescribed Medications')).toBeVisible();
  });

  test('allows ordering an investigation and reacts on the A4 prescription preview', async ({ page }) => {
    // Open Anita Verma consultation
    await page.goto('/opd-consultation?patientId=patient-004');
    await page.waitForFunction(() => !!window.hospitalDb);
    await page.waitForTimeout(400);

    // Click on preset test "Complete Blood Count (CBC)"
    const cbcPreset = page.getByRole('button', { name: /\+ Complete Blood Count \(CBC\)/i });
    await expect(cbcPreset).toBeVisible();
    await cbcPreset.click();

    // Verify it appears in Requisition Queue on the left
    await expect(page.getByText('Complete Blood Count (CBC)').first()).toBeVisible();

    // Verify it is reflected on the right-pane A4 sheet
    const rxSheet = page.locator('#digital-prescription-sheet');
    await expect(rxSheet.getByText('Complete Blood Count (CBC)')).toBeVisible();
  });

  test('allows saving draft prescription and displays confirmation toast', async ({ page }) => {
    await page.goto('/opd-consultation?patientId=patient-004');
    await page.waitForFunction(() => !!window.hospitalDb);
    await page.waitForTimeout(400);

    // Click Save Draft
    const saveDraftBtn = page.getByRole('button', { name: /Save Draft/i }).first();
    await expect(saveDraftBtn).toBeVisible();
    await saveDraftBtn.click();

    // Verify toast notification
    await expect(page.getByText(/Draft prescription saved successfully/i)).toBeVisible();
  });

  test('sends patient to lab queue and redirects back to OPD Lobby', async ({ page }) => {
    await page.goto('/opd-consultation?patientId=patient-004');
    await page.waitForFunction(() => !!window.hospitalDb);
    await page.waitForTimeout(400);

    // Click Mark Draft - Send to Lab
    const sendToLabBtn = page.getByRole('button', { name: /Mark Draft - Send to Lab/i });
    await expect(sendToLabBtn).toBeVisible();
    await sendToLabBtn.click();

    // Redirects back to /opd
    await page.waitForURL('**/opd', { timeout: 8000 });
    await expect(page.getByRole('heading', { name: /OPD Queue & Triage Desk/i })).toBeVisible();

    // Verify Anita Verma is now in Lane 3: Sent for Labs (Draft)
    const labsLane = page.getByRole('heading', { name: /Sent for Labs \(Draft\)/i });
    await expect(labsLane).toBeVisible();
    await expect(page.getByText('Anita Verma')).toBeVisible();
  });

  test('back button returns to OPD Lobby', async ({ page }) => {
    await page.goto('/opd-consultation?patientId=patient-004');
    await page.waitForFunction(() => !!window.hospitalDb);
    await page.waitForTimeout(400);

    // Click Return to OPD Queue
    const backBtn = page.getByRole('button', { name: /Return to OPD Queue/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // Verified on /opd
    await expect(page).toHaveURL(/.*opd.*/);
    await expect(page.getByRole('heading', { name: /OPD Queue & Triage Desk/i })).toBeVisible();
  });
});
