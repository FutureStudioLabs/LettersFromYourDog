import React, { useEffect } from "react";

import SiteFooter from "./SiteFooter";
import SiteTopBar from "./SiteTopBar";

const SUPPORT_EMAIL = "hello@lettersfromyourdog.com";
const SITE = "Letters From Your Dog";

const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Terms — Letters From Your Dog")}`;

export default function TermsOfServicePage() {
  useEffect(() => {
    const prev = document.title;
    document.title = `Terms of Service — ${SITE}`;
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
              <h1 className="legal-page-title">Terms of Service</h1>
              <p className="legal-page-meta">
                <strong>{SITE}</strong>
                <span aria-hidden="true"> · </span>
                Effective April 29, 2026
              </p>
            </header>

            <article className="legal-page-body">
              <section>
                <h2>Agreement to these terms</h2>
                <p>
                  By accessing or using {SITE} (“we,” “us,” or “our”), our website, onboarding, subscription,
                  or related services (collectively, the “Services”), you agree to these Terms of Service
                  (“Terms”). If you do not agree, do not use the Services.
                </p>
                <p>
                  We may update these Terms from time to time. We will post the revised Terms on this page
                  and update the effective date. Continued use after changes means you accept the updated
                  Terms. If we make material changes, we may provide additional notice as appropriate.
                </p>
              </section>

              <section>
                <h2>Our Services</h2>
                <p>
                  {SITE} provides a personalized subscription experience that may include written
                  correspondence, illustrated postcards, and related creative content based on information
                  and materials you provide about life with your dog. Features, timing, and deliverables may
                  vary by plan, availability, or product updates. We may modify, suspend, or discontinue
                  parts of the Services with reasonable notice where practicable.
                </p>
              </section>

              <section>
                <h2>Eligibility and accounts</h2>
                <p>
                  You must be able to enter a binding contract where you live and must meet any minimum
                  age requirements (typically at least 18, or the age of majority in your jurisdiction).
                  You are responsible for the accuracy of information you provide and for maintaining the
                  security of any account credentials or sessions associated with the Services.
                </p>
              </section>

              <section>
                <h2>Orders, subscriptions, and payments</h2>
                <p>
                  Paid subscriptions and one-time purchases are processed through our payment provider
                  (e.g. Stripe). By submitting payment information, you authorize us and our payment
                  processor to charge the applicable amounts in accordance with the offer you accept
                  checkout. Pricing, taxes, and billing cycles are disclosed before you complete payment.
                </p>
                <p>
                  You may cancel or change your subscription as described in the product flow, your
                  confirmation emails, or by contacting us. Unless required otherwise by law or the specific
                  offer you accepted, fees paid are generally non-refundable except where we decide otherwise
                  in writing.
                </p>
              </section>

              <section>
                <h2>Your content</h2>
                <p>
                  You may submit text, photos, and other materials (“User Content”) so we can fulfill the
                  Services. You represent that you have the rights needed to provide User Content and that it
                  does not violate law or third-party rights. You grant {SITE} a non-exclusive, worldwide,
                  royalty-free license to use, reproduce, modify, adapt, display, and distribute User
                  Content as reasonably necessary to operate, improve, and promote the Services and deliver
                  your orders.
                </p>
                <p>
                  You may not upload content you do not have rights to, that is unlawful, harassing,
                  defamatory, or that infringes others’ intellectual property or privacy. We may remove
                  content or refuse service that violates these Terms.
                </p>
              </section>

              <section>
                <h2>Intellectual property</h2>
                <p>
                  The Services, including branding, design, text, graphics, and software, are owned by{" "}
                  {SITE} or our licensors and are protected by intellectual property laws. Except for the
                  limited rights expressly granted in these Terms, no rights are conveyed to you. You may
                  not copy, scrape, or reverse engineer the Services except as allowed by applicable law.
                </p>
              </section>

              <section>
                <h2>Prohibited conduct</h2>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the Services in violation of law or these Terms</li>
                  <li>Interfere with or disrupt the Services or our infrastructure</li>
                  <li>Attempt unauthorized access to our systems or other users’ data</li>
                  <li>Use automated means to access the Services in a way that burdens our systems</li>
                </ul>
              </section>

              <section>
                <h2>Disclaimer of warranties</h2>
                <p>
                  THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY
                  LAW, WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
                  IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                  NON-INFRINGEMENT. We do not warrant that the Services will be uninterrupted or error-free.
                </p>
              </section>

              <section>
                <h2>Limitation of liability</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE}, ITS AFFILIATES, AND THEIR RESPECTIVE
                  OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES. OUR AGGREGATE LIABILITY FOR CLAIMS ARISING OUT OF OR
                  RELATING TO THE SERVICES OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU
                  PAID TO US FOR THE SERVICES IN THE TWELVE (12) MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED
                  DOLLARS (USD $100), EXCEPT WHERE PROHIBITED BY LAW.
                </p>
              </section>

              <section>
                <h2>Indemnity</h2>
                <p>
                  You will defend, indemnify, and hold harmless {SITE} and our affiliates from claims,
                  damages, losses, and expenses (including reasonable attorneys’ fees) arising from your User
                  Content, your use of the Services, or your violation of these Terms or applicable law.
                </p>
              </section>

              <section>
                <h2>Privacy</h2>
                <p>
                  Our{" "}
                  <a className="legal-page-link" href="/privacy">
                    Privacy Policy
                  </a>{" "}
                  explains how we handle personal information. By using the Services, you acknowledge our
                  privacy practices as described there.
                </p>
              </section>

              <section>
                <h2>Governing law and disputes</h2>
                <p>
                  These Terms are governed by the laws of the State of Delaware, without regard to its
                  conflict of law principles, except that some jurisdictions may require different rules for
                  consumers, in which case mandatory local law may apply to you.
                </p>
                <p>
                  Most concerns can be resolved by contacting us. If a dispute cannot be resolved
                  informally, you and we agree to bring claims only in your individual capacity, not as a
                  plaintiff or class member in any class or representative proceeding, to the extent
                  permitted by applicable law.
                </p>
              </section>

              <section>
                <h2>General</h2>
                <p>
                  If any provision of these Terms is held invalid or unenforceable, the remaining provisions
                  will remain in effect. Our failure to enforce a provision is not a waiver. These Terms
                  constitute the entire agreement between you and us regarding the Services and supersede
                  prior agreements on this topic, except where a separate written agreement expressly
                  governs.
                </p>
              </section>

              <section>
                <h2>Contact</h2>
                <p>
                  Questions about these Terms? Email{" "}
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>
                  .
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
