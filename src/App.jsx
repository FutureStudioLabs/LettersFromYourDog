import React, { useState } from "react";
import DogLandingPage from "./components/DogLandingPage";
import OnboardingFlow from "./components/OnboardingFlow";
import PaymentSuccessPage from "./components/PaymentSuccessPage";
import { isPostHogConfigured } from "./lib/posthog";
import { PostHogScreenTracker } from "./lib/posthogAnalytics";

function isPaymentConfirmationPath() {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname.replace(/\/+$/, "") || "/";
  return p === "/confirmation";
}

export default function App() {
  const [view, setView] = useState("landing");
  const onConfirmation = isPaymentConfirmationPath();
  const screen =
    onConfirmation ? "confirmation" : view === "onboarding" ? "onboarding" : "landing";

  return (
    <>
      {isPostHogConfigured ? <PostHogScreenTracker screen={screen} /> : null}
      {onConfirmation ? (
        <PaymentSuccessPage />
      ) : view === "onboarding" ? (
        <div className="hero-page">
          <OnboardingFlow
            onExit={() => setView("landing")}
            onComplete={() => {
              setView("landing");
            }}
          />
        </div>
      ) : (
        <DogLandingPage onGetStarted={() => setView("onboarding")} />
      )}
    </>
  );
}
