import React, { useState } from "react";
import DogLandingPage from "./components/DogLandingPage";
import OnboardingFlow from "./components/OnboardingFlow";
import PaymentSuccessPage from "./components/PaymentSuccessPage";

function isPaymentConfirmationPath() {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname.replace(/\/+$/, "") || "/";
  return p === "/confirmation";
}

export default function App() {
  const [view, setView] = useState("landing");

  if (isPaymentConfirmationPath()) {
    return <PaymentSuccessPage />;
  }

  if (view === "onboarding") {
    return (
      <div className="hero-page">
        <OnboardingFlow
          onExit={() => setView("landing")}
          onComplete={() => {
            setView("landing");
          }}
        />
      </div>
    );
  }

  return <DogLandingPage onGetStarted={() => setView("onboarding")} />;
}
