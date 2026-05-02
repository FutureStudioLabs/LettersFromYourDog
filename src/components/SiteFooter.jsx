import React from "react";
import { PawPrint } from "@phosphor-icons/react";

import dogsFooterStrip from "../assets/figma/dogs-footer-strip.png";

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="site-footer-card">
        <p className="site-footer-brand">
          Letters from Your Dog
          <PawPrint aria-hidden="true" className="site-footer-brand-icon" weight="fill" />
        </p>

        <nav className="site-footer-links" aria-label="Legal links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </nav>

        <p className="site-footer-copy">
          © 2024 The Analog Editorial — Letters From Your Dog. All Rights Reserved.
        </p>

        <figure className="site-footer-image-wrap">
          <img src={dogsFooterStrip} alt="A group of happy dogs" />
        </figure>
      </div>
    </footer>
  );
}
