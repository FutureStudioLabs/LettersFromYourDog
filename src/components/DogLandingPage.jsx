import React from "react";
import { CaretDown, HandHeart, PawPrint } from "@phosphor-icons/react";

import dogsFooterStrip from "../assets/figma/dogs-footer-strip.png";
import handshakeCta from "../assets/figma/handshake-cta.png";
import heroMainImage from "../assets/figma/gemini-generated-image.png";
import letterWithBookmark from "../assets/figma/dim.jpeg";
import photoToPostcardCard from "../assets/figma/pim.jpeg";

const FAQS = [
  {
    question: "Is each letter really personalized?",
    answer:
      "Yes - every letter is fully personalized and just written for you, created from the real stories, memories, and photos you share with us.",
    defaultOpen: true,
  },
  {
    question: "What do I actually receive?",
    answer:
      "Each month you receive a handwritten letter from your dog plus a custom illustrated postcard, mailed to your door.",
  },
  {
    question: "How often do I need to answer questions?",
    answer:
      "Once a month. We send you a few short prompts that take about 2 minutes to answer.",
  },
];

const STEPS = [
  {
    title: "Step 1",
    body: "Every month, we send you a few simple questions about life with your dog.",
  },
  {
    title: "Step 2",
    body: "You tell us what happened - the big moments and the small ones.",
  },
  {
    title: "Step 3",
    body: "We write the letter in your dog's voice and mail it to you, together with a custom illustrated postcard of your dog.",
  },
];

export default function DogLandingPage({ onGetStarted }) {
  const goStart = () => {
    if (typeof onGetStarted === "function") onGetStarted();
  };

  return (
    <main className="hero-page">
      <div className="page-shell">
        <section className="hero-card">
          <header className="hero-brand" aria-label="Letters from Your Dog">
            <p>
              Letters from Your Dog
              <PawPrint aria-hidden="true" className="hero-brand-icon" weight="fill" />
            </p>
          </header>

          <div className="hero-copy">
            <h1>Your dog sends you a letter every month.</h1>
            <p>
              You share the moments from your month together. We write a letter back, from your dog,
              and mail it to your door, with a custom illustrated portrait of your pup.
            </p>
          </div>

          <button type="button" className="btn-primary" onClick={goStart}>
            Get Started
          </button>

          <figure className="hero-image-wrap">
            <img src={heroMainImage} alt="A woman with her dog reading a letter on a doorstep" />
          </figure>
        </section>

        <section className="section feature-section">
          <div>
            <h2 className="section-eyebrow">Every letter is different because every month is different.</h2>
            <p className="section-lede" style={{ marginTop: 12 }}>
              Created from your real memories together and delivered as something you can hold onto forever.
            </p>
          </div>

          <figure className="feature-image-wrap">
            <img src={letterWithBookmark} alt="A sample dog letter and illustrated postcard" />
          </figure>

          <div className="feature-benefits">
            <h3>Each month, you&apos;ll receive:</h3>
            <ul>
              <li>
                <PawPrint aria-hidden="true" className="feature-benefit-icon" weight="fill" />
                <p>A letter from your dog about your actual month together</p>
              </li>
              <li>
                <PawPrint aria-hidden="true" className="feature-benefit-icon" weight="fill" />
                <p>A custom illustrated portrait of your dog</p>
              </li>
            </ul>
          </div>

          <button type="button" className="btn-primary" onClick={goStart}>
            Get Started
          </button>
        </section>

        <section className="section testimonial-section" aria-label="Customer testimonial">
          <div className="testimonial-card">
            <div className="testimonial-icon" aria-hidden="true">
              <HandHeart weight="fill" />
            </div>
            <h3>&quot;It&apos;s like he wrote it himself.&quot;</h3>
            <p className="testimonial-quote">
              &quot;Reading the letter felt like hearing his voice for the first time. I cried happy
              tears and immediately framed it. It&apos;s my favorite thing in the house.&quot;
            </p>
            <p className="testimonial-signature">— Margaret, forever a Lab mom</p>
          </div>
        </section>

        <section className="section postcard-section" aria-label="Photo to postcard preview">
          <figure className="postcard-card-full">
            <img src={photoToPostcardCard} alt="Photo to illustrated postcard example" />
          </figure>
        </section>

        <section className="section process-section" aria-label="How your keepsake comes to life">
          <h2 className="section-eyebrow">How your keepsake comes to life</h2>
          <div className="process-steps">
            {STEPS.map((step) => (
              <article key={step.title} className="process-step-card">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section final-cta-section" aria-label="Final call to action">
          <div className="final-cta-card">
            <figure className="final-cta-image-wrap">
              <img src={handshakeCta} alt="A human and dog paw touching" />
            </figure>
            <div className="final-cta-body">
              <h2>Turn life with your dog into something you can keep forever.</h2>
              <button type="button" className="btn-primary" onClick={goStart}>
                Get Started
              </button>
              <p className="final-cta-note">Founding member spots are limited.</p>
            </div>
          </div>
        </section>

        <section className="section faq-section" aria-label="Frequently asked questions">
          <h2 className="section-eyebrow">Questions?</h2>
          <div className="faq-list">
            {FAQS.map((faq) => (
              <details key={faq.question} className="faq-item" open={faq.defaultOpen}>
                <summary>
                  <span>{faq.question}</span>
                  <CaretDown aria-hidden="true" className="faq-chevron" weight="bold" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="site-footer" aria-label="Footer">
          <div className="site-footer-card">
            <p className="site-footer-brand">
              Letters from Your Dog
              <PawPrint aria-hidden="true" className="site-footer-brand-icon" weight="fill" />
            </p>

            <nav className="site-footer-links" aria-label="Legal links">
              <a href="/privacy">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Us</a>
            </nav>

            <p className="site-footer-copy">
              © 2024 The Analog Editorial — Letters From Your Dog. All Rights Reserved.
            </p>

            <figure className="site-footer-image-wrap">
              <img src={dogsFooterStrip} alt="A group of happy dogs" />
            </figure>
          </div>
        </footer>
      </div>
    </main>
  );
}
