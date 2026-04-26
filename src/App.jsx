import React, { useState } from "react";
import DogLandingPage from "./components/DogLandingPage";
import OnboardingFlow from "./components/OnboardingFlow";

export default function App() {
  const [view, setView] = useState("landing");

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
