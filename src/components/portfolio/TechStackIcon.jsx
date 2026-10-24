import React from "react";
import {
  Code2,
  Database,
  Server,
  Cloud,
  Wrench,
  Layers,
  Cpu,
  Globe,
  Radio,
  Building2,
  Activity,
  CreditCard,
  GitBranch,
  Terminal,
  FileCode2,
  Zap,
} from "lucide-react";

/**
 * TechStackIcon
 * Renders authentic, crisp SVG brand logos and domain icons for tech stack chips.
 */
export default function TechStackIcon({ name = "", size = 14, className = "" }) {
  const norm = (name || "").toLowerCase().trim();

  // ── 1. React & React Native ──
  if (norm.includes("react")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00D8FF"
        strokeWidth="1.5"
        className={`shrink-0 ${className}`}
      >
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#00D8FF" stroke="none" />
      </svg>
    );
  }

  // ── 2. Next.js ──
  if (norm.includes("next")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="12" cy="12" r="10.5" fill="#000000" />
        <path
          d="M8.5 7.5V16.5M8.5 7.5L16.2 17M15.5 7.5V13"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // ── 3. TypeScript ──
  if (norm.includes("typescript") || norm === "ts") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path
          d="M5 9H11M8 9V17"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 15.5C14 16.5 15.2 17 16.5 17C18 17 19 16.2 19 15C19 13.8 18 13.2 16.5 12.8C15 12.4 14 11.8 14 10.6C14 9.5 15 8.7 16.3 8.7C17.5 8.7 18.5 9.3 19 10.2"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // ── 4. JavaScript ──
  if (norm.includes("javascript") || norm.includes("js (es6") || norm === "js") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path
          d="M7 14.5C7.5 16 8.5 17 10 17C11.5 17 12 16 12 14.2V9M15 15C15.5 16.2 16.5 17 18 17C19.5 17 20.5 16 20.5 14.5C20.5 13.2 19.5 12.5 18 12C16.5 11.5 15.5 10.8 15.5 9.8C15.5 8.8 16.5 8 17.8 8C19 8 20 8.8 20.5 9.8"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // ── 5. Redux / Redux Toolkit ──
  if (norm.includes("redux")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path
          d="M8.5 8C6 10.5 6 14.5 8.5 17C11 19.5 15 19.5 17.5 17C20 14.5 20 10.5 17.5 8C15 5.5 11 5.5 8.5 8Z"
          stroke="#764ABC"
          strokeWidth="2"
        />
        <circle cx="9" cy="9.5" r="2.2" fill="#764ABC" />
        <circle cx="15.5" cy="14.5" r="2.2" fill="#764ABC" />
      </svg>
    );
  }

  // ── 6. Tailwind CSS ──
  if (norm.includes("tailwind")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#06B6D4"
        className={`shrink-0 ${className}`}
      >
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    );
  }

  // ── 7. Bootstrap ──
  if (norm.includes("bootstrap")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="5" fill="#7952B3" />
        <path
          d="M8 6.5H13C14.8 6.5 16 7.4 16 8.8C16 9.8 15.3 10.6 14.2 11C15.6 11.3 16.5 12.3 16.5 13.7C16.5 15.3 15.1 16.5 13.2 16.5H8V6.5ZM10.5 8.7V10.4H12.8C13.6 10.4 14.1 9.9 14.1 9.3C14.1 8.7 13.6 8.7 12.8 8.7H10.5ZM10.5 12.3V14.3H13.1C14 14.3 14.6 13.7 14.6 13C14.6 12.3 14 12.3 13.1 12.3H10.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // ── 8. Material UI ──
  if (norm.includes("material ui") || norm.includes("mui")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#007FFF"
        className={`shrink-0 ${className}`}
      >
        <path d="M0 2.475v10.39l7 4.041V6.516zm7 4.041l7-4.041v10.39l-7 4.041zm7-4.041l7 4.041-7 4.041V2.475zm3.5 10.39l3.5-2.02v4.041l-3.5 2.02zm-14 0l3.5 2.02v-4.041l-3.5-2.02z" />
      </svg>
    );
  }

  // ── 9. Chakra UI ──
  if (norm.includes("chakra")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#319795"
        className={`shrink-0 ${className}`}
      >
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="#319795" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="4" fill="#319795" />
      </svg>
    );
  }

  // ── 10. Ant Design ──
  if (norm.includes("ant design")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path
          d="M12 2L3 8V16L12 22L21 16V8L12 2Z"
          stroke="#1890FF"
          strokeWidth="2"
          fill="#E6F7FF"
        />
        <circle cx="12" cy="12" r="3" fill="#1890FF" />
      </svg>
    );
  }

  // ── 11. UI-Kitten ──
  if (norm.includes("kitten")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="5" fill="#3366FF" />
        <path
          d="M6 16L10 8L14 16M13 14H7M16 8V16M16 12L19 16M19 8L16.5 11.5"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // ── 12. Highcharts & Chart.js ──
  if (norm.includes("highcharts") || norm.includes("chart.js") || norm.includes("chart")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect x="3" y="12" width="4" height="8" rx="1" fill="#8085E9" />
        <rect x="10" y="6" width="4" height="14" rx="1" fill="#F15C80" />
        <rect x="17" y="9" width="4" height="11" rx="1" fill="#E4D354" />
      </svg>
    );
  }

  // ── 13. Node.js ──
  if (norm.includes("node")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#5FA04E"
        className={`shrink-0 ${className}`}
      >
        <path d="M12 2L3.5 7V17L12 22L20.5 17V7L12 2ZM11 16.5H8.5V10.5H11V16.5ZM15.5 16.5H13V7.5H15.5V16.5Z" />
      </svg>
    );
  }

  // ── 14. Express.js ──
  if (norm.includes("express")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#000000" />
        <text
          x="12"
          y="15.5"
          fill="#FFFFFF"
          fontSize="10"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          ex
        </text>
      </svg>
    );
  }

  // ── 15. REST APIs / APIs ──
  if (norm.includes("rest api") || norm === "api" || norm.includes("apis")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0284C7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 ${className}`}
      >
        <path d="M7 16l-4-4 4-4" />
        <path d="M17 8l4 4-4 4" />
        <path d="M14 4l-4 16" />
      </svg>
    );
  }

  // ── 16. Socket.IO / WebSockets ──
  if (norm.includes("socket") || norm.includes("websocket")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="12" cy="12" r="10" fill="#010101" />
        <path
          d="M13 5L8 13H12L11 19L16 11H12L13 5Z"
          fill="#F59E0B"
          stroke="#F59E0B"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  // ── 17. Webhooks ──
  if (norm.includes("webhook")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6366F1"
        strokeWidth="2"
        strokeLinecap="round"
        className={`shrink-0 ${className}`}
      >
        <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
        <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06l1.97 3.42" />
        <circle cx="18" cy="16.98" r="3" fill="#6366F1" />
      </svg>
    );
  }

  // ── 18. Redis ──
  if (norm.includes("redis")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path
          d="M12 3L2 8L12 13L22 8L12 3Z"
          fill="#DC382D"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="#DC382D"
          strokeWidth="2"
        />
        <path
          d="M2 16L12 21L22 16"
          stroke="#DC382D"
          strokeWidth="2"
        />
      </svg>
    );
  }

  // ── 19. JWT Authentication ──
  if (norm.includes("jwt")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#D63AFF" />
        <path
          d="M6 12L12 6L18 12L12 18L6 12Z"
          fill="#FFFFFF"
        />
        <circle cx="12" cy="12" r="2.5" fill="#D63AFF" />
      </svg>
    );
  }

  // ── 20. Swagger / OpenAPI ──
  if (norm.includes("swagger") || norm.includes("openapi")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="12" cy="12" r="10" fill="#85EA2D" />
        <text
          x="12"
          y="16"
          fill="#000000"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          {}
        </text>
        <circle cx="12" cy="12" r="4" fill="#000000" />
      </svg>
    );
  }

  // ── 21. PM2 ──
  if (norm.includes("pm2")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#2B037A" />
        <path
          d="M6 8H12C13.5 8 14.5 9 14.5 10.5C14.5 12 13.5 13 12 13H8.5V16H6V8Z"
          fill="#00E5FF"
        />
        <path
          d="M15 16H18V14L16 11H18V9H14V11L16 14H14V16Z"
          fill="#00E5FF"
        />
      </svg>
    );
  }

  // ── 22. Multer (Upload) ──
  if (norm.includes("multer")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#EA580C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 ${className}`}
      >
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m8 16 4-4 4 4" />
      </svg>
    );
  }

  // ── 23. Nodemailer ──
  if (norm.includes("nodemailer")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16A34A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 ${className}`}
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  // ── 24. PostgreSQL ──
  if (norm.includes("postgres")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#336791" />
        <path
          d="M7 11C7 8.2 9.2 6 12 6C14.8 6 17 8.2 17 11V16H14.5V11C14.5 9.6 13.4 8.5 12 8.5C10.6 8.5 9.5 9.6 9.5 11V16H7V11Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // ── 25. MongoDB ──
  if (norm.includes("mongo")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#47A248"
        className={`shrink-0 ${className}`}
      >
        <path d="M12 1.5C11.5 3 6.5 7.5 6.5 13.5C6.5 18 10 21.5 12 22.5C14 21.5 17.5 18 17.5 13.5C17.5 7.5 12.5 3 12 1.5ZM12 20.5V3.5C13 5.5 16 9 16 13.5C16 17 13.5 19.5 12 20.5Z" />
      </svg>
    );
  }

  // ── 26. Firebase ──
  if (norm.includes("firebase")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path
          d="M4.5 16.5L7.5 3.5L11.5 10.5L4.5 16.5Z"
          fill="#FFA000"
        />
        <path
          d="M4.5 16.5L16.5 3.5L14 8.5L4.5 16.5Z"
          fill="#F57C00"
        />
        <path
          d="M12 21.5L20 16.5L16.5 3.5L4.5 16.5L12 21.5Z"
          fill="#FFCA28"
        />
      </svg>
    );
  }

  // ── 27. AWS & S3 ──
  if (norm.includes("aws") || norm.includes("s3")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#232F3E" />
        <path
          d="M6 15C9 17.5 15 17.5 18 15"
          stroke="#FF9900"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17 14L18.5 15.5L17.5 17"
          stroke="#FF9900"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <text
          x="12"
          y="11.5"
          fill="#FFFFFF"
          fontSize="7"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          AWS
        </text>
      </svg>
    );
  }

  // ── 28. SQL Query Optimization / SQL ──
  if (norm.includes("sql") || norm.includes("query")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0284C7"
        strokeWidth="1.8"
        className={`shrink-0 ${className}`}
      >
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        <circle cx="17" cy="17" r="2.5" fill="#38BDF8" stroke="none" />
      </svg>
    );
  }

  // ── 29. Meta Business API / WhatsApp / Instagram ──
  if (norm.includes("meta") || norm.includes("whatsapp")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path
          d="M16.5 6C14 6 12.8 7.5 12 8.5C11.2 7.5 10 6 7.5 6C4.5 6 2 8.5 2 12C2 15.5 4.5 18 7.5 18C10 18 11.2 16.5 12 15.5C12.8 16.5 14 18 16.5 18C19.5 18 22 15.5 22 12C22 8.5 19.5 6 16.5 6ZM7.5 15.5C5.8 15.5 4.5 14 4.5 12C4.5 10 5.8 8.5 7.5 8.5C9.2 8.5 10.5 10 11.2 11.5C10.5 13.5 9.2 15.5 7.5 15.5ZM16.5 15.5C14.8 15.5 13.5 13.5 12.8 11.5C13.5 10 14.8 8.5 16.5 8.5C18.2 8.5 19.5 10 19.5 12C19.5 14 18.2 15.5 16.5 15.5Z"
          fill="#0081FB"
        />
      </svg>
    );
  }

  // ── 30. Telephony APIs (Tata, Exotel, PBX) ──
  if (norm.includes("telephony") || norm.includes("exotel") || norm.includes("convox") || norm.includes("smartflo")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 ${className}`}
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        <path d="M14.5 2a8.5 8.5 0 0 1 7.5 7.5" />
      </svg>
    );
  }

  // ── 31. HIMS Integration (Suvarna, Practo, Hospital) ──
  if (norm.includes("hims") || norm.includes("practo") || norm.includes("suvarna")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#0D9488" />
        <path
          d="M10 6H14V10H18V14H14V18H10V14H6V10H10V6Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // ── 32. Dozee / RPM (Remote Patient Monitoring) ──
  if (norm.includes("dozee") || norm.includes("rpm") || norm.includes("monitoring")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E11D48"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 ${className}`}
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    );
  }

  // ── 33. Stripe / Paytm Payment Gateways ──
  if (norm.includes("stripe") || norm.includes("paytm") || norm.includes("payment")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#635BFF" />
        <path
          d="M13.5 9.5C12.8 9.2 12.2 9 11.5 9C10.5 9 9.8 9.5 9.8 10.3C9.8 11.3 11 11.5 12.2 11.9C13.8 12.3 14.8 13.1 14.8 14.5C14.8 16 13.5 17 11.8 17C10.8 17 9.8 16.5 9 16V14.2C9.8 14.8 10.8 15.2 11.8 15.2C12.8 15.2 13.5 14.7 13.5 13.9C13.5 12.9 12.2 12.6 11 12.2C9.5 11.8 8.5 11 8.5 9.7C8.5 8.2 9.8 7.2 11.5 7.2C12.5 7.2 13.2 7.5 14 8V9.5H13.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // ── 34. GitHub Actions / CI/CD ──
  if (norm.includes("github") || norm.includes("ci/cd")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#24292E"
        className={`shrink-0 ${className}`}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    );
  }

  // ── 35. Git & Bitbucket ──
  if (norm.includes("git")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F05032"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 ${className}`}
      >
        <line x1="6" x2="6" y1="3" y2="15" />
        <circle cx="18" cy="6" r="3" fill="#F05032" />
        <circle cx="6" cy="18" r="3" fill="#F05032" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    );
  }

  // ── 36. Docker ──
  if (norm.includes("docker")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#2496ED"
        className={`shrink-0 ${className}`}
      >
        <path d="M2.5 12.5C2.5 16.5 5.5 19.5 11.5 19.5C18 19.5 21.5 15.5 21.5 12C20 12 18.5 13 17 13C16 11 14 10 12 10H2.5V12.5ZM5 8.5H7.5V11H5V8.5ZM8.5 8.5H11V11H8.5V8.5ZM12 8.5H14.5V11H12V8.5ZM8.5 5.5H11V8H8.5V5.5Z" />
      </svg>
    );
  }

  // ── 37. Figma ──
  if (norm.includes("figma")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path d="M6 12C6 10.34 7.34 9 9 9H12V15H9C7.34 15 6 13.66 6 12Z" fill="#A259FF" />
        <path d="M6 6C6 4.34 7.34 3 9 3H12V9H9C7.34 9 6 7.66 6 6Z" fill="#F24E1E" />
        <path d="M12 3H15C16.66 3 18 4.34 18 6C18 7.66 16.66 9 15 9H12V3Z" fill="#FF7262" />
        <circle cx="15" cy="12" r="3" fill="#1ABCFE" />
        <path d="M6 18C6 16.34 7.34 15 9 15H12V18C12 19.66 10.66 21 9 21C7.34 21 6 19.66 6 18Z" fill="#0ACF83" />
      </svg>
    );
  }

  // ── 38. Postman ──
  if (norm.includes("postman")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="12" cy="12" r="10" fill="#FF6C37" />
        <path
          d="M8 12L12 8L16 12M12 9V17"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // ── 39. DBeaver ──
  if (norm.includes("dbeaver")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#38220F" />
        <circle cx="8" cy="9" r="1.5" fill="#FFFFFF" />
        <circle cx="16" cy="9" r="1.5" fill="#FFFFFF" />
        <path
          d="M10 13C11 14 13 14 14 13"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // ── 40. Webpack & Vite ──
  if (norm.includes("vite")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path
          d="M19.5 4.5L12.5 20.5L4.5 4.5"
          stroke="#646CFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M14 3L8 12H13L11 19L18 8H13L14 3Z"
          fill="#FFD62E"
        />
      </svg>
    );
  }

  if (norm.includes("webpack")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#1C78C0" />
        <path
          d="M12 3L19 7V17L12 21L5 17V7L12 3Z"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <path
          d="M12 7L16 9.5V14.5L12 17L8 14.5V9.5L12 7Z"
          fill="#8DD6F9"
        />
      </svg>
    );
  }

  // ── 41. NPM / Yarn ──
  if (norm.includes("npm") || norm.includes("yarn")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#CB3837" />
        <path
          d="M5 6H19V18H12V9H9V18H5V6Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // ── 42. VS Code ──
  if (norm.includes("vs code") || norm.includes("vscode")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path
          d="M17 3L7.5 10.5L3.5 7.5L2 8.5V15.5L3.5 16.5L7.5 13.5L17 21L22 18.5V5.5L17 3Z"
          fill="#007ACC"
        />
        <path
          d="M17 7.5L8.5 14L17 20.5V7.5Z"
          fill="#1F9CF0"
        />
      </svg>
    );
  }

  // ── 43. Stream Chat ──
  if (norm.includes("stream")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#005FFF" />
        <path
          d="M6 14C6 10 9 7 13 7C17 7 18 10 18 12C18 15 15 17 11 17L7 18L8 15C6.8 14 6 13 6 14Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // ── 44. Generic Fallbacks based on category / keywords ──
  if (norm.includes("database") || norm.includes("db") || norm.includes("storage")) {
    return <Database size={size} className={`text-cyan-600 shrink-0 ${className}`} />;
  }
  if (norm.includes("cloud") || norm.includes("server")) {
    return <Cloud size={size} className={`text-sky-600 shrink-0 ${className}`} />;
  }
  if (norm.includes("api") || norm.includes("backend")) {
    return <Server size={size} className={`text-indigo-600 shrink-0 ${className}`} />;
  }
  if (norm.includes("code") || norm.includes("ui") || norm.includes("front")) {
    return <Code2 size={size} className={`text-purple-600 shrink-0 ${className}`} />;
  }

  return <Zap size={size} className={`text-amber-500 shrink-0 ${className}`} />;
}
