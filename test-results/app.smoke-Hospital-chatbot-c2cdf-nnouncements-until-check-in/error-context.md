# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.smoke.spec.js >> Hospital chatbot widget smoke tests >> holds skipped tokens for one minute and allows repeat announcements until check-in
- Location: tests\app.smoke.spec.js:243:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('region', { name: 'Dr. Ananya Rao, room 204' }).locator('[draggable="true"]').filter({ hasText: 'GW-041' }).getByRole('button', { name: 'Skip' })

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - banner [ref=e6]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - button "Back to dashboard" [ref=e9] [cursor=pointer]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: ABCD Multispecialty Hospital
            - generic [ref=e15]: OPD Floor 1 & 2
          - heading "Smart OPD Token Desk" [level=1] [ref=e16]
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e20]: Live Queue Active
          - generic [ref=e21]: · 4 in waiting area
        - button "Audio chime enabled" [ref=e22] [cursor=pointer]
        - button "+ Quick Walk-in Patient" [ref=e27] [cursor=pointer]
    - generic [ref=e32]:
      - button "Generate & Dispense Token" [ref=e33] [cursor=pointer]
      - button "OPD Waiting Pool 4" [ref=e37] [cursor=pointer]:
        - generic [ref=e43]: OPD Waiting Pool
        - generic [ref=e44]: "4"
      - button "Smart TV Call Board 1 Calling" [ref=e45] [cursor=pointer]:
        - generic [ref=e49]: Smart TV Call Board
        - generic [ref=e50]: 1 Calling
  - main [ref=e51]:
    - generic [ref=e52]:
      - generic [ref=e54]:
        - text: Total Issued Today
        - generic [ref=e55]: "43"
        - text: OPD General & Special
      - generic [ref=e61]:
        - text: Currently Waiting
        - generic [ref=e62]: "3"
        - text: Average wait ~12 min
      - generic [ref=e69]:
        - text: Announced & Calling
        - generic [ref=e70]: "1"
        - text: Direct to doctor room
      - generic [ref=e77]:
        - text: In Consultation
        - generic [ref=e78]: "1"
        - text: Doctors actively with patients
      - generic [ref=e86]:
        - text: Completed Visits
        - generic [ref=e87]: "28"
        - text: Consultations closed today
    - generic [ref=e93]:
      - generic [ref=e94]:
        - generic [ref=e95]:
          - heading "OPD Waiting Pool & Room Queue Management" [level=2] [ref=e96]
          - paragraph [ref=e97]: Monitor rooms, drag & drop to reorder patients, announce next in queue, and manage check-ins.
        - generic [ref=e98]:
          - button "+ Generate New Token" [ref=e99] [cursor=pointer]
          - button "Open TV Display Board" [ref=e103] [cursor=pointer]
      - generic [ref=e108]:
        - generic [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]:
              - generic [ref=e112]: AR
              - generic [ref=e113]:
                - generic [ref=e114]: Dr. Ananya Rao
                - generic [ref=e115]: Cardiology · 2nd Floor - Wing A
            - generic [ref=e116]:
              - generic [ref=e117]: Room
              - text: "204"
          - generic [ref=e118]:
            - generic [ref=e119]: 2 active in queue
            - button "Call Next (AMH-041)" [ref=e120] [cursor=pointer]
          - generic [ref=e125]:
            - generic [ref=e126]:
              - generic [ref=e127]:
                - generic [ref=e136]:
                  - generic [ref=e137]: Aarav Sharma
                  - generic [ref=e138]: 9876543210 · UMR-240018
                - generic [ref=e139]:
                  - generic [ref=e140]: AMH-041
                  - text: Waiting
              - generic [ref=e141]: Issued 09:18 AM · Consultation
              - generic [ref=e143]:
                - button "Print Slip" [ref=e144] [cursor=pointer]
                - generic [ref=e149]:
                  - button "Announce" [ref=e150] [cursor=pointer]
                  - button "Skip" [ref=e154] [cursor=pointer]
            - generic [ref=e155]:
              - generic [ref=e156]:
                - generic [ref=e165]:
                  - generic [ref=e166]: Meera Nair
                  - generic [ref=e167]: 9845012345 · UMR-240026
                - generic [ref=e168]:
                  - generic [ref=e169]: AMH-042
                  - text: Announced
              - generic [ref=e170]: Issued 09:24 AM · Follow-up
              - generic [ref=e172]:
                - button "Print Slip" [ref=e173] [cursor=pointer]
                - generic [ref=e178]:
                  - button "Check In" [ref=e179] [cursor=pointer]
                  - button "Recall 📢" [ref=e184] [cursor=pointer]
                  - button "Skip" [ref=e185] [cursor=pointer]
        - generic [ref=e186]:
          - generic [ref=e187]:
            - generic [ref=e188]:
              - generic [ref=e189]: VM
              - generic [ref=e190]:
                - generic [ref=e191]: Dr. Vikram Mehta
                - generic [ref=e192]: Orthopedics · 1st Floor - Wing B
            - generic [ref=e193]:
              - generic [ref=e194]: Room
              - text: "108"
          - generic [ref=e195]: 1 active in queue
          - generic [ref=e198]:
            - generic [ref=e199]:
              - generic [ref=e201]:
                - generic [ref=e202]: Fatima Khan
                - generic [ref=e203]: 9988776655 · UMR-240055
              - generic [ref=e204]:
                - generic [ref=e205]: AMH-043
                - text: Checked in
            - generic [ref=e206]:
              - generic [ref=e207]: Senior Citizen (60+)
              - generic [ref=e208]: Issued 09:31 AM · Consultation
            - generic [ref=e209]:
              - button "Print Slip" [ref=e210] [cursor=pointer]
              - button "Check Out" [ref=e216] [cursor=pointer]
        - generic [ref=e219]:
          - generic [ref=e220]:
            - generic [ref=e221]:
              - generic [ref=e222]: PM
              - generic [ref=e223]:
                - generic [ref=e224]: Dr. Priya Mani
                - generic [ref=e225]: Pediatrics · 3rd Floor - Pediatric Block
            - generic [ref=e226]:
              - generic [ref=e227]: Room
              - text: "302"
          - generic [ref=e228]:
            - generic [ref=e229]: 1 active in queue
            - button "Call Next (AMH-044)" [ref=e230] [cursor=pointer]
          - generic [ref=e236]:
            - generic [ref=e237]:
              - generic [ref=e246]:
                - generic [ref=e247]: Ishaan Kapoor
                - generic [ref=e248]: 9900123456 · UMR-240041
              - generic [ref=e249]:
                - generic [ref=e250]: AMH-044
                - text: Waiting
            - generic [ref=e251]:
              - generic [ref=e252]: Pediatric (<12y)
              - generic [ref=e253]: Issued 09:36 AM · Consultation
            - generic [ref=e254]:
              - button "Print Slip" [ref=e255] [cursor=pointer]
              - generic [ref=e260]:
                - button "Announce" [ref=e261] [cursor=pointer]
                - button "Skip" [ref=e265] [cursor=pointer]
        - generic [ref=e266]:
          - generic [ref=e267]:
            - generic [ref=e268]:
              - generic [ref=e269]: NS
              - generic [ref=e270]:
                - generic [ref=e271]: Dr. Nikhil Shah
                - generic [ref=e272]: Neurology · 2nd Floor - Neuro Wing
            - generic [ref=e273]:
              - generic [ref=e274]: Room
              - text: "215"
          - generic [ref=e275]:
            - generic [ref=e276]: 1 active in queue
            - button "Call Next (AMH-045)" [ref=e277] [cursor=pointer]
          - generic [ref=e283]:
            - generic [ref=e284]:
              - generic [ref=e293]:
                - generic [ref=e294]: Rohan Das
                - generic [ref=e295]: 9811122233 · UMR-240062
              - generic [ref=e296]:
                - generic [ref=e297]: AMH-045
                - text: Waiting
            - generic [ref=e298]: Issued 09:41 AM · Report Review
            - generic [ref=e300]:
              - button "Print Slip" [ref=e301] [cursor=pointer]
              - generic [ref=e306]:
                - button "Announce" [ref=e307] [cursor=pointer]
                - button "Skip" [ref=e311] [cursor=pointer]
        - generic [ref=e312]:
          - generic [ref=e313]:
            - generic [ref=e314]:
              - generic [ref=e315]: KI
              - generic [ref=e316]:
                - generic [ref=e317]: Dr. Kavitha Iyer
                - generic [ref=e318]: Gynecology · 1st Floor - Women Care
            - generic [ref=e319]:
              - generic [ref=e320]: Room
              - text: "116"
          - generic [ref=e321]: 0 active in queue
          - generic [ref=e323]: No patients currently in this room's queue
        - generic [ref=e325]:
          - generic [ref=e326]:
            - generic [ref=e327]:
              - generic [ref=e328]: RV
              - generic [ref=e329]:
                - generic [ref=e330]: Dr. Rajesh Verma
                - generic [ref=e331]: General Medicine · Ground Floor - OPD Main
            - generic [ref=e332]:
              - generic [ref=e333]: Room
              - text: "102"
          - generic [ref=e334]: 0 active in queue
          - generic [ref=e336]: No patients currently in this room's queue
```

# Test source

```ts
  149 |     await expect(page.getByText('PDF to Form Auto Fill', { exact: true })).toBeVisible();
  150 |     await expect(page.getByText('OP Token Generator', { exact: true })).toBeVisible();
  151 |     await expect(page.getByText('Token Number Announcer', { exact: true })).toBeVisible();
  152 |     await expect(page.getByRole('link', { name: /Chatbot/ })).toBeVisible();
  153 |     await expect(page.getByRole('button')).toHaveCount(0);
  154 | 
  155 |     await page.getByRole('link', { name: /Chatbot/ }).click();
  156 |     await expect(page).toHaveURL(/\/chatbot$/);
  157 |     await expect(page.getByText('Patient Portal')).toBeVisible();
  158 |     await expect(page.getByRole('button', { name: 'Open chat with AI Assist' })).toBeVisible();
  159 | 
  160 |     await page.getByRole('button', { name: 'Open chat with AI Assist' }).click();
  161 |     await expect(page.locator('input[type="text"]').first()).toBeVisible();
  162 |     await page.getByRole('button', { name: 'cardiology' }).click();
  163 |     await expect(page.getByRole('button', { name: 'Open chat with AI Assist' })).toBeVisible();
  164 |     await expect(page.locator('input[type="text"]').first()).toHaveCount(0);
  165 |     await expect(page.getByText("Looking for a heart specialist? I can help you check Dr. Rao's availability.")).toBeVisible();
  166 |     await page.getByRole('button', { name: 'Clear' }).click();
  167 |     await expect(page.getByText("Looking for a heart specialist? I can help you check Dr. Rao's availability.")).toHaveCount(0);
  168 |     await page.getByRole('button', { name: 'cardiology' }).click();
  169 |     await expect(page.getByRole('button', { name: 'Chat now' })).toBeVisible();
  170 |     await page.getByRole('button', { name: 'Chat now' }).click();
  171 |     await expect(page.locator('input[type="text"]').first()).toBeVisible();
  172 |     await page.getByRole('button', { name: 'Close chat' }).click();
  173 |     await page.getByRole('button', { name: 'Clear' }).click();
  174 | 
  175 |     await page.getByRole('link', { name: 'Back to dashboard' }).click();
  176 |     await expect(page).toHaveURL(/\/$/);
  177 |     await expect(page.getByText('Digital tools for patient support and smoother hospital workflows.')).toBeVisible();
  178 | 
  179 |     await page.goto('/chatbot');
  180 |     await expect(page.getByText('Patient Portal')).toBeVisible();
  181 |     await page.getByRole('link', { name: 'Back to dashboard' }).click();
  182 |     await expect(page).toHaveURL(/\/$/);
  183 | 
  184 |     const summary = await metrics.finalize();
  185 |     expect(summary.jsErrors).toEqual([]);
  186 |     expect(summary.failedRequests).toEqual([]);
  187 |   });
  188 | 
  189 |   test('opens the chat panel and sends a message', async ({ page }, testInfo) => {
  190 |     const metrics = await attachTestMetrics(page, testInfo);
  191 | 
  192 |     await page.goto('/');
  193 | 
  194 |     await page.getByRole('link', { name: /Chatbot/ }).click();
  195 |     await page.getByRole('button', { name: 'Open chat with AI Assist' }).click();
  196 | 
  197 |     const input = page.locator('input[type="text"]').first();
  198 |     await expect(input).toBeVisible();
  199 | 
  200 |     await input.fill('Timings');
  201 |     await page.getByRole('button', { name: 'Send message' }).click();
  202 | 
  203 |     await expect(page.getByText('Our OPD is open Monday to Saturday, 8:00 AM to 8:00 PM. Would you like help booking a visit?')).toBeVisible({ timeout: 15000 });
  204 | 
  205 |     const summary = await metrics.finalize();
  206 |     expect(summary.jsErrors).toEqual([]);
  207 |     expect(summary.failedRequests).toEqual([]);
  208 |   });
  209 | 
  210 |   test('generates a patient token, moves it through the queue, and shows the five-doctor announcer', async ({ page }) => {
  211 |     await page.goto('/');
  212 |     await page.getByRole('link', { name: /OP Token Generator/ }).click();
  213 |     await expect(page).toHaveURL(/\/tokens$/);
  214 | 
  215 |     await page.getByLabel('Mobile number or UMR number').fill('9876543210');
  216 |     await page.getByRole('button', { name: /Aarav Sharma/ }).click();
  217 |     await page.getByLabel('Search doctors or departments').fill('Cardiology');
  218 |     await page.getByRole('button', { name: /^AR Dr\. Ananya Rao/ }).click();
  219 |     await page.getByRole('main').getByRole('button', { name: 'Generate token' }).click();
  220 |     await expect(page.getByRole('status')).toContainText('GW-046 created for Aarav Sharma');
  221 |     await expect(page.getByRole('dialog', { name: 'Token generated' })).toBeVisible();
  222 |     await expect(page.getByLabel('Mobile number or UMR number')).toHaveValue('');
  223 |     await page.getByRole('button', { name: 'Done' }).click();
  224 | 
  225 |     await page.getByRole('navigation', { name: 'Token tools' }).getByRole('button', { name: 'Waiting pool' }).click();
  226 |     await expect(page.getByText('GW-046')).toBeVisible();
  227 |     const generatedTokenRow = page.locator('[draggable="true"]').filter({ hasText: 'GW-046' });
  228 |     await generatedTokenRow.getByRole('button', { name: 'Announce' }).click();
  229 |     await generatedTokenRow.getByRole('button', { name: 'Check in' }).click();
  230 |     await generatedTokenRow.getByRole('button', { name: 'Check out' }).click();
  231 |     await expect(page.getByText('Completed', { exact: true })).toBeVisible();
  232 | 
  233 |     await page.getByRole('button', { name: 'TV announcer' }).click();
  234 |     await expect(page.getByText('Dr. Ananya Rao', { exact: true })).toBeVisible();
  235 |     await expect(page.getByText('Dr. Vikram Mehta', { exact: true })).toBeVisible();
  236 |     await expect(page.getByText('Dr. Priya Mani', { exact: true })).toBeVisible();
  237 |     await expect(page.getByText('Dr. Nikhil Shah', { exact: true })).toBeVisible();
  238 |     await expect(page.getByText('Dr. Kavitha Iyer', { exact: true })).toBeVisible();
  239 |     await expect(page.getByText('Room 204', { exact: true })).toBeVisible();
  240 |     await expect(page.getByText('MBBS, MD, DM', { exact: true })).toBeVisible();
  241 |   });
  242 | 
  243 |   test('holds skipped tokens for one minute and allows repeat announcements until check-in', async ({ page }) => {
  244 |     await page.clock.install({ time: new Date('2026-10-04T09:00:00') });
  245 |     await page.goto('/waiting-pool');
  246 | 
  247 |     const roomQueue = page.getByRole('region', { name: 'Dr. Ananya Rao, room 204' });
  248 |     const waitingToken = roomQueue.locator('[draggable="true"]').filter({ hasText: 'GW-041' });
> 249 |     await waitingToken.getByRole('button', { name: 'Skip' }).click();
      |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  250 |     await expect(waitingToken.getByText(/Hold · 60s/)).toBeVisible();
  251 |     await expect(waitingToken.getByRole('button')).toHaveCount(0);
  252 | 
  253 |     await page.clock.fastForward(60_000);
  254 |     await expect(waitingToken.getByRole('button', { name: 'Announce' })).toBeVisible();
  255 | 
  256 |     await waitingToken.getByRole('button', { name: 'Announce' }).click();
  257 |     await expect(waitingToken.getByRole('button', { name: 'Check in' })).toBeVisible();
  258 |     await expect(waitingToken.getByRole('button', { name: 'Announce again' })).toHaveCount(0);
  259 |     await page.clock.fastForward(60_000);
  260 |     await expect(waitingToken.getByRole('button', { name: 'Announce again' })).toBeVisible();
  261 |     await waitingToken.getByRole('button', { name: 'Check in' }).click();
  262 |     await expect(waitingToken.getByRole('button', { name: 'Announce again' })).toHaveCount(0);
  263 |   });
  264 | 
  265 |   test('plays the announce bell on the TV route and identifies the patient', async ({ page }) => {
  266 |     await page.goto('/waiting-pool');
  267 |     await page.evaluate(() => {
  268 |       window.__bellOscillatorCount = 0;
  269 |       const originalCreateOscillator = AudioContext.prototype.createOscillator;
  270 |       AudioContext.prototype.createOscillator = function () {
  271 |         window.__bellOscillatorCount += 1;
  272 |         return originalCreateOscillator.call(this);
  273 |       };
  274 |     });
  275 | 
  276 |     const patientToken = page.locator('[draggable="true"]').filter({ hasText: 'GW-041' });
  277 |     await patientToken.getByRole('button', { name: 'Announce' }).click();
  278 |     expect(await page.evaluate(() => window.__bellOscillatorCount)).toBe(0);
  279 | 
  280 |     await page.getByRole('navigation', { name: 'Token tools' }).getByRole('button', { name: 'TV announcer' }).click();
  281 |     await expect.poll(() => page.evaluate(() => window.__bellOscillatorCount)).toBeGreaterThan(0);
  282 |     const announcedCard = page.locator('article').filter({ hasText: 'GW-041' });
  283 |     await expect(announcedCard.getByText('Now announcing', { exact: true })).toBeVisible();
  284 |     await expect(announcedCard.locator('.announce-wave > span')).toHaveCount(4);
  285 |     await expect(announcedCard.getByText('Aarav Sharma', { exact: true })).toBeVisible();
  286 |     await expect(announcedCard.getByText('204', { exact: true })).toBeVisible();
  287 |   });
  288 | 
  289 |   test('reorders patients only inside the assigned doctor room', async ({ page }) => {
  290 |     await page.goto('/waiting-pool');
  291 |     const roomQueue = page.getByRole('region', { name: 'Dr. Ananya Rao, room 204' });
  292 | 
  293 |     await expect(roomQueue.getByText('Aarav Sharma', { exact: true }).first()).toBeVisible();
  294 |     await expect(roomQueue.getByText('Meera Nair', { exact: true })).toBeVisible();
  295 |     await expect(roomQueue.getByText('Queue position')).toHaveCount(0);
  296 |     const sourceCard = roomQueue.locator('[draggable="true"]').filter({ hasText: 'GW-042' });
  297 |     const targetCard = roomQueue.locator('[draggable="true"]').filter({ hasText: 'GW-041' });
  298 |     const targetBox = await targetCard.boundingBox();
  299 |     await sourceCard.evaluate((element) => element.dispatchEvent(new DragEvent('dragstart', {
  300 |       bubbles: true,
  301 |       dataTransfer: new DataTransfer(),
  302 |     })));
  303 |     await targetCard.evaluate((element, targetY) => element.dispatchEvent(new DragEvent('dragover', {
  304 |       bubbles: true,
  305 |       cancelable: true,
  306 |       clientY: targetY,
  307 |       dataTransfer: new DataTransfer(),
  308 |     })), targetBox.y + 2);
  309 |     await expect(targetCard).toHaveAttribute('data-drop-position', 'before');
  310 |     await targetCard.evaluate((element) => element.dispatchEvent(new DragEvent('drop', {
  311 |       bubbles: true,
  312 |       cancelable: true,
  313 |       dataTransfer: new DataTransfer(),
  314 |     })));
  315 |     const tokenOrder = await roomQueue.locator('[draggable="true"]').evaluateAll((cards) =>
  316 |       cards.map((card) => card.textContent.match(/GW-\d+/)?.[0]).filter(Boolean),
  317 |     );
  318 |     expect(tokenOrder.indexOf('GW-042')).toBeLessThan(tokenOrder.indexOf('GW-041'));
  319 |   });
  320 | 
  321 |   test('performance budget: page loads with a reasonable DOM and timing', async ({ page }, testInfo) => {
  322 |     const metrics = await attachTestMetrics(page, testInfo);
  323 |     const response = await page.goto('/');
  324 | 
  325 |     expect(response?.status()).toBe(200);
  326 | 
  327 |     const performance = await page.evaluate(async () => {
  328 |       const nav = performance.getEntriesByType('navigation')[0];
  329 |       const paint = performance.getEntriesByType('paint');
  330 |       const paintMap = {};
  331 |       for (const entry of paint) {
  332 |         paintMap[entry.name] = entry.startTime;
  333 |       }
  334 | 
  335 |       const bodyText = document.body.innerText.length;
  336 |       const interactiveControls = document.querySelectorAll('button, a').length;
  337 | 
  338 |       return {
  339 |         domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart : 0,
  340 |         load: nav ? nav.loadEventEnd - nav.loadEventStart : 0,
  341 |         firstPaint: paintMap['first-paint'] ?? 0,
  342 |         firstContentfulPaint: paintMap['first-contentful-paint'] ?? 0,
  343 |         bodyTextLength: bodyText,
  344 |         interactiveControlCount: interactiveControls,
  345 |       };
  346 |     });
  347 | 
  348 |     expect(performance.bodyTextLength).toBeGreaterThan(200);
  349 |     expect(performance.interactiveControlCount).toBeGreaterThan(0);
```