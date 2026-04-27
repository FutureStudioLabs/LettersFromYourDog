import React from "react";

import successMarkImage from "../assets/figma/leg.png";

const REACH_OUT_BY =
  import.meta.env.VITE_SUCCESS_REACH_OUT_BY?.trim() || "May 27";
const FIRST_CHARGE_DATE =
  import.meta.env.VITE_SUCCESS_FIRST_CHARGE_DATE?.trim() || "May 1";

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

        <h1 className="payment-success-title">You&apos;re in. Your spot is reserved.</h1>

        <div className="payment-success-body">
          <p>We&apos;ve sent a confirmation email with all the details.</p>
          <p>
            By {REACH_OUT_BY}, we&apos;ll reach out with everything you need to get started.
          </p>
          <p>
            You have not been charged yet. Your first charge of $11 will happen on {FIRST_CHARGE_DATE},
            unless you cancel before then.
          </p>
          <p className="payment-success-email-line">
            If you have any questions, just email us at{" "}
            <a className="payment-success-email" href={MAILTO_HREF}>
              {SUPPORT_EMAIL}
            </a>
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
