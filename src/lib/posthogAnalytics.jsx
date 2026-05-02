import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";

const TOTAL_ONBOARDING_STEPS = 11;

/** Stable virtual URL for SPA screens (real path is often still `/`). */
function virtualCurrentUrl(screen) {
  if (typeof window === "undefined") return "";
  const { origin, pathname, search } = window.location;
  if (screen === "confirmation" || screen === "privacy") {
    return `${origin}${pathname}${search}`;
  }
  if (screen === "onboarding") {
    return `${origin}/onboarding`;
  }
  return `${origin}/`;
}

/**
 * Emits `$pageview` when top-level app screen changes (requires `capture_pageview: false` on client).
 */
export function PostHogScreenTracker({ screen }) {
  const posthog = usePostHog();
  const prevScreen = useRef(null);

  useEffect(() => {
    if (!posthog || screen === prevScreen.current) return;
    prevScreen.current = screen;

    const $current_url = virtualCurrentUrl(screen);
    posthog.register({ app_screen: screen });
    posthog.capture("$pageview", { $current_url });
  }, [screen, posthog]);

  return null;
}

/**
 * Identify subscriber + funnel step events inside onboarding (only mount when PostHog is configured).
 */
export function PostHogOnboardingAnalytics({ step, subscriberId }) {
  const posthog = usePostHog();
  const prevStep = useRef(null);

  useEffect(() => {
    if (!subscriberId) return;
    posthog.identify(subscriberId);
  }, [subscriberId, posthog]);

  useEffect(() => {
    if (!posthog || step === prevStep.current) return;
    prevStep.current = step;
    posthog.capture("onboarding_step_viewed", {
      step,
      total_steps: TOTAL_ONBOARDING_STEPS,
    });
  }, [step, posthog]);

  return null;
}
