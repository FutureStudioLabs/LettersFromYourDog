import React, { useState } from "react";
import DogLandingPage from "./components/DogLandingPage";
import OnboardingFlow from "./components/OnboardingFlow";
import PaymentSuccessPage from "./components/PaymentSuccessPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import { isPostHogConfigured } from "./lib/posthog";
import { PostHogScreenTracker } from "./lib/posthogAnalytics";

function normalizedPathname() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function isPaymentConfirmationPath() {
  return normalizedPathname() === "/confirmation";
}

function isPrivacyPolicyPath() {
  const p = normalizedPathname();
  return p === "/privacy" || p === "/privacy-policy";
}

export default function App() {
  const [view, setView] = useState("landing");
  const onConfirmation = isPaymentConfirmationPath();
  const onPrivacy = isPrivacyPolicyPath();
  const screen = onPrivacy
    ? "privacy"
    : onConfirmation
      ? "confirmation"
      : view === "onboarding"
        ? "onboarding"
        : "landing";

  return (
    <>
      {isPostHogConfigured ? <PostHogScreenTracker screen={screen} /> : null}
      {onPrivacy ? (
        <PrivacyPolicyPage />
      ) : onConfirmation ? (
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
