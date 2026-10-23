import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function generateDeveloperOgImage() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #080c14;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #f8fafc;
      padding: 56px 64px;
    }

    /* Ambient Glowing Gradients */
    .glow-cyan {
      position: absolute;
      top: -100px;
      left: 100px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, rgba(14, 165, 233, 0) 70%);
      filter: blur(50px);
      pointer-events: none;
    }

    .glow-purple {
      position: absolute;
      bottom: -120px;
      right: 150px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(147, 51, 234, 0.24) 0%, rgba(147, 51, 234, 0) 70%);
      filter: blur(60px);
      pointer-events: none;
    }

    .glow-teal {
      position: absolute;
      top: 150px;
      right: 50px;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, rgba(20, 184, 166, 0) 70%);
      filter: blur(50px);
      pointer-events: none;
    }

    /* Subtle Grid Pattern */
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    /* Outer Border & Accent Glow */
    .outer-border {
      position: absolute;
      inset: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      pointer-events: none;
    }

    .content-wrap {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 48px;
      height: 100%;
    }

    .left-col {
      flex: 1.2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 20px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(13, 148, 136, 0.15);
      border: 1px solid rgba(20, 184, 166, 0.35);
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #2dd4bf;
      width: fit-content;
      text-transform: uppercase;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
    }

    .hero-title {
      font-size: 44px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 30%, #cbd5e1 70%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .role-title {
      font-size: 21px;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .role-title span.sep {
      color: #475569;
    }

    .bio-text {
      font-size: 15px;
      line-height: 1.55;
      color: #94a3b8;
      max-width: 540px;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .tech-chip {
      padding: 6px 12px;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-size: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .tech-chip.primary {
      background: rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.4);
      color: #a5b4fc;
    }

    .tech-chip.emerald {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.4);
      color: #6ee7b7;
    }

    /* Right: Code Terminal Card */
    .right-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .code-card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.1);
      overflow: hidden;
    }

    .code-header {
      background: rgba(30, 41, 59, 0.6);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .window-controls {
      display: flex;
      gap: 7px;
    }

    .control-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #10b981; }

    .file-name {
      font-size: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #94a3b8;
      font-weight: 500;
    }

    .code-body {
      padding: 20px 22px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      line-height: 1.7;
    }

    .c-keyword { color: #f43f5e; font-weight: 600; }
    .c-type { color: #38bdf8; font-weight: 600; }
    .c-prop { color: #e2e8f0; }
    .c-str { color: #34d399; }
    .c-num { color: #fbbf24; }
    .c-comment { color: #64748b; font-style: italic; }

    /* Footer Strip */
    .card-footer {
      position: absolute;
      bottom: 24px;
      left: 64px;
      right: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #64748b;
      font-family: ui-monospace, monospace;
      z-index: 10;
    }

    .footer-links {
      display: flex;
      gap: 20px;
    }

    .footer-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="grid-pattern"></div>
  <div class="glow-cyan"></div>
  <div class="glow-purple"></div>
  <div class="glow-teal"></div>
  <div class="outer-border"></div>

  <div class="content-wrap">
    <div class="left-col">
      <div class="status-pill">
        <span class="status-dot"></span>
        Senior Software Engineer · 7+ Yrs Exp
      </div>

      <div>
        <h1 class="hero-title">Manikanta Sai Tanguturi</h1>
        <div class="role-title">
          <span>Healthcare SaaS</span>
          <span class="sep">·</span>
          <span>CRM Architect</span>
          <span class="sep">·</span>
          <span>Full Stack AI</span>
        </div>
      </div>

      <p class="bio-text">
        Architecting high-scale healthcare software, multi-tenant EHR/HIMS systems, omnichannel CRM unified inboxes, telephony PBX integrations, and clinical AI copilots.
      </p>

      <div class="tech-stack">
        <div class="tech-chip primary">⚛ React 18 / Vite</div>
        <div class="tech-chip">TypeScript</div>
        <div class="tech-chip">Node.js</div>
        <div class="tech-chip emerald">🏥 Healthcare EHR / NABH</div>
        <div class="tech-chip">📞 Telephony / WebRTC</div>
        <div class="tech-chip">🤖 Clinical AI</div>
        <div class="tech-chip">Multi-Tenant CRM</div>
      </div>
    </div>

    <div class="right-col">
      <div class="code-card">
        <div class="code-header">
          <div class="window-controls">
            <div class="control-dot dot-red"></div>
            <div class="control-dot dot-yellow"></div>
            <div class="control-dot dot-green"></div>
          </div>
          <span class="file-name">manikanta.profile.ts</span>
          <span style="font-size: 10px; color: #10b981; font-weight: 700; font-family: monospace;">● Live</span>
        </div>
        <div class="code-body">
          <span class="c-keyword">const</span> <span class="c-type">developer</span> = {<br>
          &nbsp;&nbsp;<span class="c-prop">name:</span> <span class="c-str">"Manikanta Sai Tanguturi"</span>,<br>
          &nbsp;&nbsp;<span class="c-prop">experience:</span> <span class="c-str">"7+ Years"</span>,<br>
          &nbsp;&nbsp;<span class="c-prop">expertise:</span> [<span class="c-str">"Healthcare SaaS"</span>, <span class="c-str">"EHR"</span>, <span class="c-str">"CRM"</span>],<br>
          &nbsp;&nbsp;<span class="c-prop">architecture:</span> <span class="c-str">"Multi-Tenant / Micro-Frontend"</span>,<br>
          &nbsp;&nbsp;<span class="c-prop">products:</span> [<span class="c-str">"Apple CRM"</span>, <span class="c-str">"OPD Queue"</span>, <span class="c-str">"Voice AI"</span>],<br>
          &nbsp;&nbsp;<span class="c-prop">status:</span> <span class="c-str">"Available for Senior Roles"</span> 🚀<br>
          };<br>
          <span class="c-comment">// 10x care team productivity & 99.9% uptime</span>
        </div>
      </div>
    </div>
  </div>

  <div class="card-footer">
    <div class="footer-links">
      <div class="footer-link">
        <span style="color: #38bdf8;">🌐</span> tanguturi.dev
      </div>
      <div class="footer-link">
        <span style="color: #a855f7;">💼</span> linkedin.com/in/manikanta-sai
      </div>
      <div class="footer-link">
        <span style="color: #2dd4bf;">⚡</span> github.com/manikanta-sai
      </div>
    </div>
    <div>
      <span style="color: #10b981;">●</span> Verified Engineering Portfolio
    </div>
  </div>
</body>
</html>
  `;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2
  });

  await page.setContent(htmlContent);
  await page.waitForTimeout(300);

  // Save to public/og-developer.png and public/og-image.png
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const ogDevPath = path.join(publicDir, 'og-developer.png');
  const ogImgPath = path.join(publicDir, 'og-image.png');

  await page.screenshot({ path: ogDevPath, type: 'png' });
  await page.screenshot({ path: ogImgPath, type: 'png' });

  await browser.close();
  console.log('Successfully generated:', ogDevPath, 'and', ogImgPath);
}

generateDeveloperOgImage().catch(console.error);
