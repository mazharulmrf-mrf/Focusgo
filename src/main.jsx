import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

// capacitor.config.json এ থাকা GoogleAuth.serverClientId দিয়েই ইনিশিয়ালাইজ হবে
GoogleAuth.initialize();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
