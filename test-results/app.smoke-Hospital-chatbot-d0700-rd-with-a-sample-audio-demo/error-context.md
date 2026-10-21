# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.smoke.spec.js >> Hospital chatbot widget smoke tests >> dashboard tile opens the Insights analytics dashboard with a sample audio demo
- Location: tests\app.smoke.spec.js:103:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Playing audio...')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Playing audio...') with timeout 10000ms
  - waiting for getByText('Playing audio...')

```

```yaml
- heading "AI SALES CALL MONITORING AND SCORING" [level=1]
- text: CallInsights Sep 1, 2024 - Sep 30, 2024
- heading "Sales Call Analysis" [level=2]
- button "Back to dashboard"
- text: Total Calls 482 + 28% vs. last month Average Score 78/100 + 12% vs. last month Conversion Rate 24% + 18% vs. last month Coaching Opportunities 136 Identified by AI vs. last month Recent Calls
- button "AI Agents"
- button "View All"
- table:
  - rowgroup:
    - row "Contact Agent Date & Time Duration Score Outcome":
      - columnheader "Contact"
      - columnheader "Agent"
      - columnheader "Date & Time"
      - columnheader "Duration"
      - columnheader "Score"
      - columnheader "Outcome"
  - rowgroup:
    - row "RO Robert Smith +1 (415) 555-1234 Robert Smith Sep 1, 2024 10:24 AM 00:02:24 92 Interested":
      - cell "RO Robert Smith +1 (415) 555-1234"
      - cell "Robert Smith"
      - cell "Sep 1, 2024 10:24 AM"
      - cell "00:02:24"
      - cell "92"
      - cell "Interested"
    - row "JE Jennifer Davis +1 (415) 555-9876 Jennifer Davis Sep 2, 2024 09:12 AM 00:01:57 76 Follow up":
      - cell "JE Jennifer Davis +1 (415) 555-9876"
      - cell "Jennifer Davis"
      - cell "Sep 2, 2024 09:12 AM"
      - cell "00:01:57"
      - cell "76"
      - cell "Follow up"
    - row "MI Michael Kim +1 (213) 505-6769 Michael Kim Sep 2, 2024 06:47 PM 00:02:16 51 Not interested":
      - cell "MI Michael Kim +1 (213) 505-6769"
      - cell "Michael Kim"
      - cell "Sep 2, 2024 06:47 PM"
      - cell "00:02:16"
      - cell "51"
      - cell "Not interested"
    - row "SA Sarah Lee +1 (408) 555-2124 Sarah Lee Sep 3, 2024 11:17 AM 00:02:03 81 Interested":
      - cell "SA Sarah Lee +1 (408) 555-2124"
      - cell "Sarah Lee"
      - cell "Sep 3, 2024 11:17 AM"
      - cell "00:02:03"
      - cell "81"
      - cell "Interested"
- complementary:
  - text: Robert Smith +1 (415) 555-1234 92 00:02:24
  - button "Play audio"
  - text: Call waveform Audio preview unavailable in this browser Call Summary
  - paragraph: The prospect is interested in a multi-location rollout and asked follow-up questions about onboarding time.
  - text: Key Highlights
  - list:
    - listitem: Discussed budget and implementation timeline with clarity.
    - listitem: Asked about onboarding support and migration options.
    - listitem: Strong signal for a discovery call follow-up.
  - text: Outcome Interested
- list:
  - listitem: AI automatically analyzes sales calls, scores conversations, and evaluates sales performance at scale.
  - listitem: It identifies mistakes, missed opportunities, objections, and areas where sales teams can improve.
  - listitem: Gives managers actionable insights and coaching recommendations from every conversation.
```

# Test source

```ts
  13  |         start() {
  14  |           this.startCount += 1;
  15  |         }
  16  |         stop() {
  17  |           this.onend?.();
  18  |         }
  19  |         emitResult(resultIndex, segments) {
  20  |           const results = segments.map(({ transcript, isFinal }) => {
  21  |             const result = [{ transcript }];
  22  |             result.isFinal = isFinal;
  23  |             return result;
  24  |           });
  25  |           this.onresult?.({ resultIndex, results });
  26  |         }
  27  |       };
  28  |     });
  29  |     await page.goto('/');
  30  | 
  31  |     await page.getByRole('link', { name: /Speech to Text/ }).click();
  32  |     await expect(page).toHaveURL(/\/speech-to-text$/);
  33  |     await expect(page.getByText('Voice workspace')).toHaveCount(0);
  34  |     await expect(page.getByRole('heading', { name: 'New transcript' })).toHaveCount(0);
  35  |     await expect(page.getByText('Dictate directly into an editable draft.')).toBeVisible();
  36  |     await expect(page.getByText('Ready to listen')).toBeVisible();
  37  |     await expect(page.getByText('Press Start to let your browser microphone listen.')).toBeVisible();
  38  |     await expect(page.getByText('Browser recognition uses the selected language. Mixed English, Hindi, and Telugu may be transcribed inaccurately.')).toBeVisible();
  39  |     await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-IN');
  40  |     await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  41  |     await expect(page.getByRole('button', { name: 'Pause', exact: true })).toHaveCount(0);
  42  |     await expect(page.getByRole('button', { name: 'Resume', exact: true })).toHaveCount(0);
  43  |     await expect(page.getByRole('button', { name: 'Stop', exact: true })).toHaveCount(0);
  44  | 
  45  |     await page.getByRole('button', { name: 'Start', exact: true }).click();
  46  |     await expect(page.getByText('Listening', { exact: true })).toBeVisible();
  47  |     await expect(page.getByText('Transcribing into your draft. Click Stop when you finish speaking. Listening stops automatically after 2 minutes.')).toBeVisible();
  48  |     await expect(page.locator('.speech-wave')).toBeVisible();
  49  |     const transcript = page.getByLabel('Transcript text');
  50  |     await expect(transcript).toHaveCSS('min-height', '256px');
  51  |     await page.evaluate(() => {
  52  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  53  |       instance.emitResult(0, [{ transcript: 'Patient needs', isFinal: false }]);
  54  |     });
  55  |     await expect(transcript).toHaveValue('Patient needs');
  56  |     await page.evaluate(() => {
  57  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  58  |       instance.emitResult(0, [
  59  |         { transcript: 'Patient needs', isFinal: true },
  60  |         { transcript: 'an appointment', isFinal: false },
  61  |       ]);
  62  |     });
  63  |     await expect(transcript).toHaveValue('Patient needs an appointment');
  64  |     await page.evaluate(() => {
  65  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  66  |       instance.emitResult(1, [
  67  |         { transcript: 'Patient needs', isFinal: true },
  68  |         { transcript: 'an appointment tomorrow.', isFinal: true },
  69  |       ]);
  70  |     });
  71  |     await expect(transcript).toHaveValue('Patient needs an appointment tomorrow.');
  72  |     await page.evaluate(() => {
  73  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  74  |       instance.onend();
  75  |     });
  76  |     await expect.poll(() => page.evaluate(() => {
  77  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  78  |       return instance.startCount;
  79  |     })).toBeGreaterThan(1);
  80  |     await expect(page.getByText('Listening', { exact: true })).toBeVisible();
  81  |     await expect(page.getByRole('button', { name: 'Pause', exact: true })).toHaveCount(0);
  82  |     await expect(page.getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
  83  |     await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeVisible();
  84  |     await page.getByRole('button', { name: 'Stop', exact: true }).click();
  85  |     await expect(page.getByText('Ready to listen')).toBeVisible();
  86  |     await expect(page.locator('.speech-wave')).toHaveCount(0);
  87  |     await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  88  |     await expect(page.getByRole('button', { name: 'Stop', exact: true })).toHaveCount(0);
  89  | 
  90  |     await transcript.fill('Patient requested an appointment next week.');
  91  |     await expect(transcript).toHaveValue('Patient requested an appointment next week.');
  92  |     await page.getByRole('button', { name: 'Clear' }).click();
  93  |     await expect(transcript).toHaveValue('');
  94  | 
  95  |     await page.clock.install();
  96  |     await page.getByRole('button', { name: 'Start', exact: true }).click();
  97  |     await page.clock.fastForward(120_000);
  98  |     await expect(page.getByText('Two-minute listening limit reached')).toBeVisible();
  99  |     await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  100 |     await expect(page.getByRole('button', { name: 'Stop', exact: true })).toHaveCount(0);
  101 |   });
  102 | 
  103 |   test('dashboard tile opens the Insights analytics dashboard with a sample audio demo', async ({ page }) => {
  104 |     await page.goto('/');
  105 | 
  106 |     await expect(page.getByRole('link', { name: /Insights/ })).toBeVisible();
  107 |     await page.getByRole('link', { name: /Insights/ }).click();
  108 |     await expect(page).toHaveURL(/\/insights$/);
  109 |     await expect(page.getByRole('heading', { name: /AI Sales Call Monitoring And Scoring/i })).toBeVisible();
  110 |     await expect(page.getByText('Sales Call Analysis')).toBeVisible();
  111 |     await expect(page.getByRole('button', { name: /Play audio/i })).toBeVisible();
  112 |     await page.getByRole('button', { name: /Play audio/i }).first().click();
> 113 |     await expect(page.getByText('Playing audio...')).toBeVisible();
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  114 |   });
  115 | 
  116 |   test('dashboard tile opens the existing chatbot screen', async ({ page }, testInfo) => {
  117 |     const metrics = await attachTestMetrics(page, testInfo);
  118 | 
  119 |     await page.goto('/');
  120 | 
  121 |     await expect(page.getByRole('heading', { name: 'Apple Multispecialty Hospital' })).toBeVisible();
  122 |     await expect(page.getByText('Digital tools for patient support and smoother hospital workflows.')).toBeVisible();
  123 |     await expect(page.getByText('Speech to Text', { exact: true })).toBeVisible();
  124 |     await expect(page.getByText('Audio File to Text', { exact: true })).toBeVisible();
  125 |     await expect(page.getByText('PDF to Form Auto Fill', { exact: true })).toBeVisible();
  126 |     await expect(page.getByText('OP Token Generator', { exact: true })).toBeVisible();
  127 |     await expect(page.getByText('Token Number Announcer', { exact: true })).toBeVisible();
  128 |     await expect(page.getByRole('link', { name: /Chatbot/ })).toBeVisible();
  129 |     await expect(page.getByRole('button')).toHaveCount(0);
  130 | 
  131 |     await page.getByRole('link', { name: /Chatbot/ }).click();
  132 |     await expect(page).toHaveURL(/\/chatbot$/);
  133 |     await expect(page.getByText('Patient Portal')).toBeVisible();
  134 |     await expect(page.getByRole('button', { name: 'Open chat with AI Assist' })).toBeVisible();
  135 | 
  136 |     await page.getByRole('button', { name: 'Open chat with AI Assist' }).click();
  137 |     await expect(page.locator('input[type="text"]').first()).toBeVisible();
  138 |     await page.getByRole('button', { name: 'cardiology' }).click();
  139 |     await expect(page.getByRole('button', { name: 'Open chat with AI Assist' })).toBeVisible();
  140 |     await expect(page.locator('input[type="text"]').first()).toHaveCount(0);
  141 |     await expect(page.getByText("Looking for a heart specialist? I can help you check Dr. Rao's availability.")).toBeVisible();
  142 |     await page.getByRole('button', { name: 'Clear' }).click();
  143 |     await expect(page.getByText("Looking for a heart specialist? I can help you check Dr. Rao's availability.")).toHaveCount(0);
  144 |     await page.getByRole('button', { name: 'cardiology' }).click();
  145 |     await expect(page.getByRole('button', { name: 'Chat now' })).toBeVisible();
  146 |     await page.getByRole('button', { name: 'Chat now' }).click();
  147 |     await expect(page.locator('input[type="text"]').first()).toBeVisible();
  148 |     await page.getByRole('button', { name: 'Close chat' }).click();
  149 |     await page.getByRole('button', { name: 'Clear' }).click();
  150 | 
  151 |     await page.getByRole('link', { name: 'Back to dashboard' }).click();
  152 |     await expect(page).toHaveURL(/\/$/);
  153 |     await expect(page.getByText('Digital tools for patient support and smoother hospital workflows.')).toBeVisible();
  154 | 
  155 |     await page.goto('/chatbot');
  156 |     await expect(page.getByText('Patient Portal')).toBeVisible();
  157 |     await page.getByRole('link', { name: 'Back to dashboard' }).click();
  158 |     await expect(page).toHaveURL(/\/$/);
  159 | 
  160 |     const summary = await metrics.finalize();
  161 |     expect(summary.jsErrors).toEqual([]);
  162 |     expect(summary.failedRequests).toEqual([]);
  163 |   });
  164 | 
  165 |   test('opens the chat panel and sends a message', async ({ page }, testInfo) => {
  166 |     const metrics = await attachTestMetrics(page, testInfo);
  167 | 
  168 |     await page.goto('/');
  169 | 
  170 |     await page.getByRole('link', { name: /Chatbot/ }).click();
  171 |     await page.getByRole('button', { name: 'Open chat with AI Assist' }).click();
  172 | 
  173 |     const input = page.locator('input[type="text"]').first();
  174 |     await expect(input).toBeVisible();
  175 | 
  176 |     await input.fill('Timings');
  177 |     await page.getByRole('button', { name: 'Send message' }).click();
  178 | 
  179 |     await expect(page.getByText('Our OPD is open Monday to Saturday, 8:00 AM to 8:00 PM. Would you like help booking a visit?')).toBeVisible({ timeout: 15000 });
  180 | 
  181 |     const summary = await metrics.finalize();
  182 |     expect(summary.jsErrors).toEqual([]);
  183 |     expect(summary.failedRequests).toEqual([]);
  184 |   });
  185 | 
  186 |   test('generates a patient token, moves it through the queue, and shows the five-doctor announcer', async ({ page }) => {
  187 |     await page.goto('/');
  188 |     await page.getByRole('link', { name: /OP Token Generator/ }).click();
  189 |     await expect(page).toHaveURL(/\/tokens$/);
  190 | 
  191 |     await page.getByLabel('Mobile number or UMR number').fill('9876543210');
  192 |     await page.getByRole('button', { name: /Aarav Sharma/ }).click();
  193 |     await page.getByLabel('Search doctors or departments').fill('Cardiology');
  194 |     await page.getByRole('button', { name: /^AR Dr\. Ananya Rao/ }).click();
  195 |     await page.getByRole('main').getByRole('button', { name: 'Generate token' }).click();
  196 |     await expect(page.getByRole('status')).toContainText('GW-046 created for Aarav Sharma');
  197 |     await expect(page.getByRole('dialog', { name: 'Token generated' })).toBeVisible();
  198 |     await expect(page.getByLabel('Mobile number or UMR number')).toHaveValue('');
  199 |     await page.getByRole('button', { name: 'Done' }).click();
  200 | 
  201 |     await page.getByRole('navigation', { name: 'Token tools' }).getByRole('button', { name: 'Waiting pool' }).click();
  202 |     await expect(page.getByText('GW-046')).toBeVisible();
  203 |     const generatedTokenRow = page.locator('[draggable="true"]').filter({ hasText: 'GW-046' });
  204 |     await generatedTokenRow.getByRole('button', { name: 'Announce' }).click();
  205 |     await generatedTokenRow.getByRole('button', { name: 'Check in' }).click();
  206 |     await generatedTokenRow.getByRole('button', { name: 'Check out' }).click();
  207 |     await expect(page.getByText('Completed', { exact: true })).toBeVisible();
  208 | 
  209 |     await page.getByRole('button', { name: 'TV announcer' }).click();
  210 |     await expect(page.getByText('Dr. Ananya Rao', { exact: true })).toBeVisible();
  211 |     await expect(page.getByText('Dr. Vikram Mehta', { exact: true })).toBeVisible();
  212 |     await expect(page.getByText('Dr. Priya Mani', { exact: true })).toBeVisible();
  213 |     await expect(page.getByText('Dr. Nikhil Shah', { exact: true })).toBeVisible();
```