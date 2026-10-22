import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { hospitalDb } from "./db/hospitalDb.js";
import * as seedData from "./db/seedData.js";

// Expose on window for runtime testing & dev inspection
if (typeof window !== "undefined") {
  window.hospitalDb = hospitalDb;
  window.hospitalDbSeed = seedData;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
