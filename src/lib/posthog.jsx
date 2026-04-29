import { PostHogProvider } from "posthog-js/react";

const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY?.trim() ?? "";
const apiHost =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";

export const isPostHogConfigured = Boolean(apiKey);

/**
 * Wraps the app when `VITE_PUBLIC_POSTHOG_KEY` is set.
 * Without a key, children render unchanged (no network calls).
 */
export function PostHogRoot({ children }) {
  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.info("[PostHog] VITE_PUBLIC_POSTHOG_KEY is unset; analytics disabled.");
    }
    return children;
  }

  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{
        api_host: apiHost,
        /* Manual $pageview via PostHogScreenTracker (landing vs onboarding share "/"). */
        capture_pageview: false,
        capture_pageleave: true,
      }}
    >
      {children}
    </PostHogProvider>
  );
}
