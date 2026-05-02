import React, { useEffect } from "react";

import SiteFooter from "./SiteFooter";
import SiteTopBar from "./SiteTopBar";

const SUPPORT_EMAIL = "hello@lettersfromyourdog.com";
const SITE = "Letters From Your Dog";
const LEGAL_ENTITY = "Future Studio LLC";
const WEBSITE = "lettersfromyourdog.com";
const WEBSITE_URL = `https://${WEBSITE}`;

const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Privacy — Letters From Your Dog")}`;

const LINK_STRIPE_PRIVACY = "https://stripe.com/privacy";
const LINK_SUPABASE_PRIVACY = "https://supabase.com/privacy";
const LINK_RESEND_PRIVACY = "https://resend.com/legal/privacy-policy";
const LINK_POSTHOG_PRIVACY = "https://posthog.com/privacy";

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
                Last updated: May 1, 2026
              </p>
            </header>

            <article className="legal-page-body">
              <section>
                <h2>1. Introduction</h2>
                <p>
                  {LEGAL_ENTITY} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates {SITE} at{" "}
                  <a className="legal-page-link" href={WEBSITE_URL}>
                    {WEBSITE}
                  </a>
                  . This Privacy Policy explains how we collect, use, and protect your personal information
                  when you use our Service.
                </p>
                <p>
                  By using our Service, you agree to the collection and use of information as described in
                  this policy.
                </p>
              </section>

              <section>
                <h2>2. Information we collect</h2>
                <p>
                  <strong>Information you provide directly:</strong>
                </p>
                <ul>
                  <li>Your name and email address</li>
                  <li>Your shipping address</li>
                  <li>
                    Information about your dog (name, breed, age, gender, personality, photo)
                  </li>
                  <li>Monthly prompt responses about your experiences with your dog</li>
                  <li>Any communications you send to us by email</li>
                </ul>
                <p>
                  <strong>Information collected automatically:</strong>
                </p>
                <ul>
                  <li>
                    Usage data and analytics collected via PostHog, including pages visited, buttons
                    clicked, and how you navigate through our website
                  </li>
                  <li>Your IP address and browser type</li>
                </ul>
                <p>
                  <strong>Information collected by third parties:</strong>
                </p>
                <p>
                  Payment information is collected and processed directly by Stripe. We do not receive or
                  store your credit card details. Please review Stripe&apos;s Privacy Policy at{" "}
                  <a className="legal-page-link" href={LINK_STRIPE_PRIVACY}>
                    stripe.com/privacy
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2>3. How we use your information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Create and deliver your monthly personalised letter and illustrated portrait</li>
                  <li>Process and manage your subscription and payments</li>
                  <li>
                    Send you transactional emails including subscription confirmations, monthly prompt
                    requests, and service updates
                  </li>
                  <li>
                    Send you marketing and promotional emails (you may opt out at any time)
                  </li>
                  <li>Improve our Service through analytics</li>
                  <li>Respond to your questions and support requests</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2>4. Third party service providers</h2>
                <p>
                  We share your information with the following third party service providers only to the
                  extent necessary to operate our Service:
                </p>
                <ul>
                  <li>
                    <strong>Stripe</strong> — Payment processing. Privacy policy at{" "}
                    <a className="legal-page-link" href={LINK_STRIPE_PRIVACY}>
                      stripe.com/privacy
                    </a>
                    .
                  </li>
                  <li>
                    <strong>Supabase</strong> — Database and file storage. Privacy policy at{" "}
                    <a className="legal-page-link" href={LINK_SUPABASE_PRIVACY}>
                      supabase.com/privacy
                    </a>
                    .
                  </li>
                  <li>
                    <strong>Resend</strong> — Transactional and marketing email delivery. Privacy policy at{" "}
                    <a className="legal-page-link" href={LINK_RESEND_PRIVACY}>
                      resend.com/privacy
                    </a>
                    .
                  </li>
                  <li>
                    <strong>PostHog</strong> — Product analytics. Privacy policy at{" "}
                    <a className="legal-page-link" href={LINK_POSTHOG_PRIVACY}>
                      posthog.com/privacy
                    </a>
                    .
                  </li>
                </ul>
                <p>
                  We do not sell your personal information to any third party. We do not share your
                  information with any third party for their own marketing purposes.
                </p>
                <p>
                  Your dog&apos;s photo and information is used solely to generate your personalised letter
                  and illustrated portrait. We use AI-powered image generation tools to create your
                  dog&apos;s portrait. Your photo is stored securely and is not shared publicly or used for
                  any purpose other than creating your portrait.
                </p>
              </section>

              <section>
                <h2>5. Data retention</h2>
                <p>
                  We retain your personal information for as long as your subscription is active and for a
                  reasonable period thereafter for legal and business purposes. You may request deletion of
                  your data at any time by contacting us at{" "}
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2>6. Cookies</h2>
                <p>
                  Our website uses only functional cookies necessary for the Service to operate. We do not
                  use advertising cookies or tracking cookies beyond our analytics provider PostHog.
                </p>
              </section>

              <section>
                <h2>7. Your rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>
                    Opt out of marketing emails at any time by clicking the unsubscribe link in any email
                    or contacting us at{" "}
                    <a className="legal-page-link" href={MAILTO}>
                      {SUPPORT_EMAIL}
                    </a>
                  </li>
                  <li>Request that we export your data in a portable format</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at{" "}
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>
                  . We will respond within 30 days.
                </p>
              </section>

              <section>
                <h2>8. Data security</h2>
                <p>
                  We take reasonable technical and organisational measures to protect your personal
                  information against unauthorised access, loss, or misuse. Your data is stored securely
                  using Supabase and access is restricted to authorised personnel only.
                </p>
                <p>
                  However, no method of transmission over the internet is completely secure. We cannot
                  guarantee absolute security of your data.
                </p>
              </section>

              <section>
                <h2>9. Children&apos;s privacy</h2>
                <p>
                  Our Service is not directed at individuals under the age of 18. We do not knowingly
                  collect personal information from anyone under 18. If you believe we have inadvertently
                  collected information from a minor, please contact us at{" "}
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  and we will delete it promptly.
                </p>
              </section>

              <section>
                <h2>10. United States only</h2>
                <p>
                  Our Service is currently available to residents of the United States only. By using the
                  Service, you confirm that you are a US resident and that your data will be stored and
                  processed in accordance with US law.
                </p>
              </section>

              <section>
                <h2>11. Changes to this policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material
                  changes by email. The date of the most recent update is shown at the top of this page.
                  Continued use of the Service after notification of changes constitutes acceptance of the
                  updated policy.
                </p>
              </section>

              <section>
                <h2>12. Contact</h2>
                <p>
                  If you have any questions about this Privacy Policy or how we handle your data, please
                  contact us at:
                </p>
                <p>
                  {LEGAL_ENTITY}
                  <br />
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>
                  <br />
                  <a className="legal-page-link" href={WEBSITE_URL}>
                    {WEBSITE}
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
