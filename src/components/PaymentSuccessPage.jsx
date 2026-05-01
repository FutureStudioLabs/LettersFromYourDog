import React from "react";

import successMarkImage from "../assets/figma/leg.png";

const SUPPORT_EMAIL = "hello@lettersfromyourdog.com";
const MAILTO_HREF = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Letters from Your Dog",
)}`;

export default function PaymentSuccessPage() {
  return (
    <div className="payment-success-screen">
      <div className="payment-success-card">
        <div className="payment-success-icon-wrap" aria-hidden="true">
          <img src={successMarkImage} alt="" className="payment-success-mark" />
        </div>

        <h1 className="payment-success-title">
          You&apos;re in. Your first letter is reserved.
        </h1>

        <div className="payment-success-body">
          <p>
            Your $11 payment has been processed — thank you for being one of our first 100.
          </p>
          <p>We&apos;ve sent a confirmation email with all the details.</p>
          <p>
            Mid May, we&apos;ll reach out with a few simple questions about your month with your dog.
            That&apos;s what we use to write your letter.
          </p>
          <p>Your first letter and custom portrait will be mailed at the end of May.</p>
          <p className="payment-success-contact">
            If you have any questions, just email us at{" "}
            <a className="payment-success-email" href={MAILTO_HREF}>
              {SUPPORT_EMAIL}
            </a>{" "}
            — we read every one.
          </p>
          <p>We can&apos;t wait to write your first letter.</p>
        </div>

        <a className="payment-success-cta" href={MAILTO_HREF}>
          Go to my Email
        </a>
      </div>
    </div>
  );
}
