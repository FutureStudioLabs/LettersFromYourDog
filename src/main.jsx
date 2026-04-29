import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PostHogRoot } from "./lib/posthog";
import "./lib/supabaseClient";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PostHogRoot>
      <App />
    </PostHogRoot>
  </React.StrictMode>,
);
