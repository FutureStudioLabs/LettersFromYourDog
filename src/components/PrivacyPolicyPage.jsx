import React, { useEffect } from "react";

import SiteFooter from "./SiteFooter";
import SiteTopBar from "./SiteTopBar";

const SUPPORT_EMAIL = "hello@lettersfromyourdog.com";
const SITE = "Letters From Your Dog";

const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Privacy — Letters From Your Dog")}`;

export default function PrivacyPolicyPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = `Privacy Policy — ${SITE}`;
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="hero-page legal-page legal-page--chrome">
      <div className="page-shell legal-page-stack">
        <SiteTopBar />
        <div className="legal-page-main">
          <div className="legal-page-inner">
        <header className="legal-page-header">
          <h1 className="legal-page-title">Privacy Policy</h1>
          <p className="legal-page-meta">
            <strong>{SITE}</strong>
            <span aria-hidden="true"> · </span>
            Effective April 29, 2026
          </p>
        </header>

        <article className="legal-page-body">
          <section>
            <h2>Overview</h2>
            <p>
              {SITE} (“we,” “us,” or “our”) respects your privacy. This policy describes how we collect,
              use, store, and share personal information when you visit our website, use our onboarding
              flow, subscribe, or communicate with us.
            </p>
            <p>
              If you have questions, contact us at{" "}
              <a className="legal-page-link" href={MAILTO}>
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Information we collect</h2>
            <ul>
              <li>
                <strong>Account and session data.</strong> We use authentication services (including
                anonymous sessions where applicable) to keep your experience secure and to associate
                your activity with your subscriber profile.
              </li>
              <li>
                <strong>Contact and profile details.</strong> When you sign up or complete onboarding, we
                may collect your name, email address, mailing address, and information about your dog that
                you choose to provide so we can deliver letters and illustrations.
              </li>
              <li>
                <strong>Photos.</strong> If you upload a photo of your dog, we store it to create your
                illustrated postcard and related content. Uploading a photo is voluntary.
              </li>
              <li>
                <strong>Payment information.</strong> Payments are processed by our payment provider
                (Stripe). We do not store full payment card numbers on our servers; Stripe provides us with
                identifiers and transaction metadata needed to fulfill subscriptions.
              </li>
              <li>
                <strong>Technical and usage data.</strong> We may collect device/browser type, general
                location derived from IP (e.g. for analytics or fraud prevention), and how you use our site
                (e.g. pages viewed, funnel steps). We may use product analytics tools for this purpose.
              </li>
              <li>
                <strong>Communications.</strong> When you email us, we keep those messages and our replies
                as needed to support you.
              </li>
            </ul>
          </section>

          <section>
            <h2>How we use information</h2>
            <p>We use personal information to:</p>
            <ul>
              <li>Provide, operate, and improve {SITE} and your subscription</li>
              <li>Process payments, prevent fraud, and handle billing-related communications</li>
              <li>Create and mail letters, postcards, and related creative assets you have requested</li>
              <li>Send transactional and service emails (e.g. confirmations, subscription updates)</li>
              <li>Analyze usage and improve our product experience</li>
              <li>Comply with law, enforce our terms, and protect our rights and users</li>
            </ul>
          </section>

          <section>
            <h2>How we share information</h2>
            <p>
              We do not sell your personal information. We share data with service providers who process
              it on our behalf under contractual protections, including for example:
            </p>
            <ul>
              <li>
                <strong>Hosting and database</strong> (e.g. Supabase) for storing account and application
                data
              </li>
              <li>
                <strong>Payments</strong> (Stripe) for checkout and subscription management
              </li>
              <li>
                <strong>Email delivery</strong> (e.g. SMTP/email providers) for messages we send you
              </li>
              <li>
                <strong>Analytics</strong> (e.g. product analytics) to understand product usage
              </li>
            </ul>
            <p>
              We may also disclose information if required by law, to respond to lawful requests, or to
              protect the safety, rights, or property of {SITE}, our users, or others.
            </p>
          </section>

          <section>
            <h2>Retention</h2>
            <p>
              We keep information only as long as needed for the purposes above, including to provide the
              service, meet legal obligations, resolve disputes, and enforce our agreements. Retention
              periods can vary depending on the type of data and legal requirements.
            </p>
          </section>

          <section>
            <h2>Security</h2>
            <p>
              We use reasonable technical and organizational measures designed to protect personal
              information. No method of transmission or storage is completely secure; we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2>Your choices and rights</h2>
            <p>
              Depending on where you live, you may have rights to access, correct, delete, or export
              certain personal information, or to object to or restrict certain processing. To make a
              request, email{" "}
              <a className="legal-page-link" href={MAILTO}>
                {SUPPORT_EMAIL}
              </a>
              . We may need to verify your identity before responding.
            </p>
          </section>

          <section>
            <h2>Children</h2>
            <p>
              {SITE} is not directed at children under 13, and we do not knowingly collect personal
              information from children under 13. If you believe we have collected such information,
              contact us and we will take appropriate steps to delete it.
            </p>
          </section>

          <section>
            <h2>International users</h2>
            <p>
              We may process and store information in the United States or other countries where we or our
              service providers operate. Those countries may have different data protection rules than your
              country of residence.
            </p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the updated version on this
              page and revise the “Effective” date. Material changes may be communicated by email or a
              notice on the site where appropriate.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              <strong>{SITE}</strong>
              <br />
              Email:{" "}
              <a className="legal-page-link" href={MAILTO}>
                {SUPPORT_EMAIL}
              </a>
            </p>
          </section>
        </article>
          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
