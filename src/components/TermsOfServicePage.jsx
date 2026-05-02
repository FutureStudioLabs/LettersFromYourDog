import React, { useEffect } from "react";

import SiteFooter from "./SiteFooter";
import SiteTopBar from "./SiteTopBar";

const SUPPORT_EMAIL = "hello@lettersfromyourdog.com";
const SITE = "Letters From Your Dog";
const LEGAL_ENTITY = "Future Studio LLC";
const WEBSITE = "lettersfromyourdog.com";
const WEBSITE_URL = `https://${WEBSITE}`;

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
                Last updated: May 1, 2026
              </p>
            </header>

            <article className="legal-page-body">
              <section>
                <h2>1. Agreement to terms</h2>
                <p>
                  These Terms of Service (&quot;Terms&quot;) govern your use of the {SITE} website and
                  subscription service (&quot;Service&quot;) operated by {LEGAL_ENTITY} (&quot;we,&quot;
                  &quot;us,&quot; or &quot;our&quot;).
                </p>
                <p>
                  By accessing our website at{" "}
                  <a className="legal-page-link" href={WEBSITE_URL}>
                    {WEBSITE}
                  </a>{" "}
                  or subscribing to our Service, you agree to be bound by these Terms. If you do not agree,
                  please do not use the Service.
                </p>
              </section>

              <section>
                <h2>2. Eligibility</h2>
                <p>
                  You must be at least 18 years of age to use this Service. By subscribing, you confirm that
                  you are 18 years of age or older. The Service is currently available to residents of the
                  United States only.
                </p>
              </section>

              <section>
                <h2>3. The Service</h2>
                <p>
                  {SITE} is a monthly physical subscription service. Each month, we use information you
                  provide about your dog and your experiences together to create:
                </p>
                <ul>
                  <li>
                    A personalised letter written in your dog&apos;s voice, based on real events you share
                    with us
                  </li>
                  <li>A custom illustrated portrait of your dog</li>
                </ul>
                <p>
                  Both items are printed and mailed to the shipping address you provide at checkout.
                </p>
                <p>
                  The content of each letter is generated using the information you submit each month through
                  our prompt collection process. The quality and personalisation of each letter depends on the
                  information you provide. We are not responsible for letters that lack personalisation due to
                  incomplete or missing submissions.
                </p>
              </section>

              <section>
                <h2>4. Subscriptions and billing</h2>
                <p>
                  <strong>Founding member pricing.</strong> Your first month is billed at $11 at the time of
                  checkout. From your second month onwards, you will be billed $18 per month automatically.
                </p>
                <p>
                  <strong>Recurring billing.</strong> By subscribing, you authorise {LEGAL_ENTITY} to charge
                  your payment method $18 per month on a recurring basis, approximately 30 days after your
                  initial payment, until you cancel.
                </p>
                <p>
                  <strong>Payment processing.</strong> All payments are processed securely by Stripe. We do
                  not store your credit card or payment details. By subscribing, you also agree to Stripe&apos;s
                  Terms of Service.
                </p>
                <p>
                  <strong>Failed payments.</strong> If a payment fails, we will attempt to collect payment
                  again. If payment cannot be collected, your subscription may be suspended or cancelled.
                </p>
              </section>

              <section>
                <h2>5. Cancellation policy</h2>
                <p>
                  You may cancel your subscription at any time by emailing us at{" "}
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>
                  . Cancellations must be received before your next billing date to avoid being charged for
                  the following month.
                </p>
                <p>
                  Upon cancellation, you will continue to receive your subscription until the end of the
                  current billing period. No partial refunds are issued for unused portions of a billing
                  period.
                </p>
              </section>

              <section>
                <h2>6. Refund policy</h2>
                <p>All payments are non-refundable except in the following circumstances:</p>
                <ul>
                  <li>We are unable to fulfil your subscription due to circumstances on our end</li>
                  <li>
                    Your letter is lost or damaged in transit — in this case we will reprint and reship at no
                    additional cost
                  </li>
                </ul>
                <p>
                  If you believe you are entitled to a refund under the above circumstances, please contact us
                  at{" "}
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  within 14 days of the issue.
                </p>
              </section>

              <section>
                <h2>7. Your content and information</h2>
                <p>
                  By submitting information about yourself and your dog through our prompt collection
                  process, you grant {LEGAL_ENTITY} a non-exclusive licence to use that information solely for
                  the purpose of generating your monthly letter and illustrated portrait.
                </p>
                <p>
                  You are responsible for the accuracy of the information you provide. Please ensure the
                  shipping address you provide at checkout is correct. We are not responsible for letters
                  mailed to an incorrect address.
                </p>
                <p>
                  You may request that we update your shipping address at any time by emailing{" "}
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2>8. Intellectual property</h2>
                <p>
                  All letters, portraits, and other content generated by us as part of your subscription are
                  created for your personal use. You may keep, share, and display them for personal
                  non-commercial purposes.
                </p>
                <p>
                  The {SITE} brand, website, and associated content are owned by {LEGAL_ENTITY}. You may not
                  reproduce, distribute, or use any of our branded materials without our written permission.
                </p>
              </section>

              <section>
                <h2>9. Shipping and delivery</h2>
                <p>
                  We currently ship to addresses within the United States only. Letters are mailed at the end
                  of each month. Delivery times vary by location but are typically 1–2 weeks from the date of
                  mailing.
                </p>
                <p>
                  We are not responsible for delays caused by the postal service or for letters lost in
                  transit. If your letter is lost, please contact us at{" "}
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  and we will arrange a reprint.
                </p>
              </section>

              <section>
                <h2>10. Changes to the Service</h2>
                <p>
                  We reserve the right to modify, suspend, or discontinue the Service at any time. We will
                  provide reasonable notice of any material changes via email. Continued use of the Service
                  after such notice constitutes acceptance of the changes.
                </p>
                <p>
                  We reserve the right to change our pricing. Any pricing changes will be communicated by
                  email at least 30 days before they take effect. If you do not agree to a pricing change, you
                  may cancel your subscription before the new price takes effect.
                </p>
              </section>

              <section>
                <h2>11. Limitation of liability</h2>
                <p>
                  To the fullest extent permitted by law, {LEGAL_ENTITY} shall not be liable for any indirect,
                  incidental, special, or consequential damages arising from your use of the Service.
                </p>
                <p>
                  Our total liability to you for any claims arising from these Terms or the Service shall not
                  exceed the total amount paid by you in the three months preceding the claim.
                </p>
              </section>

              <section>
                <h2>12. Governing law</h2>
                <p>
                  These Terms are governed by the laws of the State of Wyoming, United States, without regard
                  to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in
                  the courts of Wyoming.
                </p>
              </section>

              <section>
                <h2>13. Contact</h2>
                <p>For any questions about these Terms, please contact us at:</p>
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