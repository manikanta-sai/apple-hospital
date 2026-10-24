# Configuration & Deployment Manual
[Back to Master Index](README.md)

This document provides complete instructions for environment configuration, development, automated testing, production builds, and cloud deployment on Vercel.

---

## 1. Environment Variables

Environment variables are managed using standard Vite conventions. Create a `.env` or `.env.local` file in the project root:

| Variable Name | Default Value | Required? | Purpose |
| :--- | :--- | :--- | :--- |
| **`VITE_API_BASE_URL`** | `http://localhost:5000/api` | No | Base URL for the backend HTTP REST API. Used by `src/services/chatApi.js` when mock mode is deactivated. |
| **`VITE_CHAT_MOCK_MODE`** | `true` | No | When set to `"false"`, disables client mock fallbacks and forces live HTTP requests to `VITE_API_BASE_URL`. Default is `true` for offline/demo resiliency. |

```ini
# Example .env.production
VITE_API_BASE_URL=https://api.hospital.health/api
VITE_CHAT_MOCK_MODE=false
```

---

## 2. Command Scripts Catalog

All commands documented from [`package.json`](../package.json):

### Development & Build
- **Start Local Dev Server**:
  ```bash
  npm run dev
  ```
  Launches Vite HMR server on `http://localhost:5173`.
- **Compile Production Build**:
  ```bash
  npm run build
  ```
  Compiles production-ready assets into the `dist/` directory with code splitting and minification.
- **Preview Production Build**:
  ```bash
  npm run preview
  ```
  Locally serves the compiled `dist/` folder for pre-deployment verification.

### Automated End-to-End Testing (Playwright)
- **Run All Tests**:
  ```bash
  npm test
  ```
  Executes Playwright tests headlessly.
- **Run Tests with HTML Report**:
  ```bash
  npm run test:html
  ```
- **Show Last Test Report**:
  ```bash
  npm run test:report
  ```
- **Run Tests in Headed Mode**:
  ```bash
  npm run test:headed
  ```
  Runs tests in a visible browser window for interactive debugging.
- **Run Tests & Open Report**:
  ```bash
  npm run test:report:open
  ```

---

## 3. Bundler Configuration (`vite.config.js`)

Located at [`vite.config.js`](../vite.config.js):

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-db': ['dexie'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
```

### Key Optimizations:
1. **Manual Chunking**:
   - `vendor-react`: Isolates React and React DOM (~134 kB) into a stable cached chunk.
   - `vendor-icons`: Isolates `lucide-react` (~73 kB).
   - `vendor-db`: Isolates `dexie` (~96 kB).
2. **Chunk Size Threshold**: Set to `800 kB` to accommodate data-intensive clinical analytics bundles without triggering false build warnings.

---

## 4. Vercel SPA Client-Side Routing Configuration

Located at [`vercel.json`](../vercel.json):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Why This Is Required:
Because this application uses client-side routing via HTML5 `window.history` (`pushState` and `replaceState`), directly loading or refreshing sub-routes (such as `/opd-queue`, `/crm`, `/opd-consultation`, or `/insights`) makes a direct GET request to the hosting server. 

Without `vercel.json`, Vercel returns `404 NOT_FOUND` because no matching physical directory or file exists on disk. The rewrite rule instructs Vercel to serve `index.html` for all requests, allowing the React application to mount and handle the route seamlessly.

---

## 5. Tailwind CSS & Styling Design System

- **Configuration File**: [`tailwind.config.js`](../tailwind.config.js)
- **Primary Color Palettes**:
  - `clinical`: Medical slate and teal hues (`#0d9488`, `#0f766e`, `#134e4a`).
  - `ink`: High-contrast typography slate colors (`#0f172a`, `#334155`, `#64748b`).
  - `status`: Semantic badge colors (`available: #22c55e`, `busy: #f59e0b`, `emergency: #ef4444`).
- **Custom Keyframe Animations**:
  - `slide-up`: Smooth elevation on modal/workspace enter.
  - `fade-in` / `fade-in-up`: Gentle transition for chat messages and cards.
  - `pop-in`: Spring-like entry for tooltips and contextual triggers.

---

## 6. External Third-Party Assets & CDNs

### Fonts
Loaded via Google Fonts in [`index.html`](../index.html):
- **Inter**: Primary UI typography.
- **Plus Jakarta Sans**: High-impact headings, metrics, and KPI cards.
- **JetBrains Mono**: Monospace font for tokens (`#W-04`), short codes, and medical dosages.

### Security Meta Tags (`index.html`)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- OpenGraph and Twitter Card tags configured with developer profile graphics.
