import React from "react";
import { PawPrint } from "@phosphor-icons/react";

export default function SiteTopBar() {
  return (
    <header className="site-top-bar">
      <a href="/" className="site-top-bar-brand" aria-label="Letters from Your Dog — Home">
        <span className="site-top-bar-title">Letters from Your Dog</span>
        <PawPrint aria-hidden="true" className="site-top-bar-icon" weight="fill" />
      </a>
    </header>
  );
}
