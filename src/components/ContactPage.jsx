import React, { useEffect } from "react";

import SiteFooter from "./SiteFooter";
import SiteTopBar from "./SiteTopBar";

const SUPPORT_EMAIL = "hello@lettersfromyourdog.com";
const SITE = "Letters From Your Dog";

const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Hello — Letters From Your Dog")}`;

export default function ContactPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = `Contact Us — ${SITE}`;
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
              <h1 className="legal-page-title">Contact us</h1>
              <p className="legal-page-meta">
                <strong>{SITE}</strong>
              </p>
            </header>

            <article className="legal-page-body">
              <section>
                <p>
                  We read every message. Whether you have a question about your subscription, onboarding,
                  or anything else about {SITE}, the fastest way to reach us is by email.
                </p>
                <p>
                  <a className="legal-page-link" href={MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>
                </p>
                <p>
                  Please include your account email (if you have one) and a short description of how we
                  can help. We typically reply within a few business days.
                </p>
              </section>

              <section>
                <h2>Legal &amp; policies</h2>
                <p>
                  For privacy practices, see our{" "}
                  <a className="legal-page-link" href="/privacy">
                    Privacy Policy
                  </a>
                  . For terms of use, see our{" "}
                  <a className="legal-page-link" href="/terms">
                    Terms of Service
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
