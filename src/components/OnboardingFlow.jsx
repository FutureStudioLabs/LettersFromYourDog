import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CameraPlus, Check } from "@phosphor-icons/react";

import postcardExplainerImage from "../assets/figma/photo-to-postcard-card.png";
import step4HeroImage from "../assets/figma/letter-with-bookmark.png";

const TOTAL_STEPS = 8;
const MAX_PHOTO_BYTES = 1024 * 1024; /* 1 MB */

const AGE_OPTIONS = ["0-1 Years", "1-3 Years", "4-7 Years", "8-11 Years", "12+ Years"];

const MEMORABLE_MOMENT_OPTIONS = [
  "The way they greet me when I come home",
  "Always knows when I'm sad",
  "The funny little habits only I know about",
  "Sleeping curled up next to me every night",
  "Making even bad days better",
  "That ridiculous food obsession",
];

const POSTCARD_BULLETS = [
  "Created from your dog's photo",
  "Designed around a monthly theme",
  "Made to keep, to gift or to frame",
];

const VALUE_LETTER_BULLETS = [
  "You share a few moments from your month together",
  "We turn them into a letter from your dog",
  "Mailed to your home to keep forever",
];
const MAX_TRAITS = 5;

const TRAIT_OPTIONS = [
  "Playful",
  "Chaotic",
  "Cuddly",
  "Dramatic",
  "Food obsessed",
  "Loyal",
  "Silly",
  "Protective",
  "Lazy",
  "Curious",
];

export default function OnboardingFlow({ onExit, onComplete }) {
  const [step, setStep] = useState(1);
  const [dogName, setDogName] = useState("");
  const [breed, setBreed] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [traits, setTraits] = useState([]);
  const [memorableMoment, setMemorableMoment] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  const progress = (step / TOTAL_STEPS) * 100;

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onExit();
    }
  };

  const submitName = (e) => {
    e.preventDefault();
    if (!dogName.trim()) return;
    setStep(2);
  };

  const submitBreed = (e) => {
    e.preventDefault();
    if (!breed.trim()) return;
    setStep(3);
  };

  const submitAge = (e) => {
    e.preventDefault();
    if (!ageRange) return;
    setStep(4);
  };

  const toggleTrait = (label) => {
    setTraits((prev) => {
      if (prev.includes(label)) {
        return prev.filter((t) => t !== label);
      }
      if (prev.length >= MAX_TRAITS) {
        return prev;
      }
      return [...prev, label];
    });
  };

  const submitTraits = (e) => {
    e.preventDefault();
    if (traits.length < 1) return;
    setStep(5);
  };

  const submitMemorableMoment = (e) => {
    e.preventDefault();
    if (!memorableMoment) return;
    setStep(6);
  };

  const handlePhotoFile = (file) => {
    setPhotoError("");
    if (!file) {
      setPhotoFile(null);
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Please choose an image under 1 MB.");
      return;
    }
    const lower = file.name.toLowerCase();
    const okByName = /\.(jpe?g|png)$/i.test(lower);
    const okByType = /^image\/(jpeg|png)$/i.test(file.type);
    if (!okByName && !okByType) {
      setPhotoError("Use JPG, JPEG, or PNG only.");
      return;
    }
    setPhotoFile(file);
  };

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const submitPhoto = (e) => {
    e.preventDefault();
    if (!photoFile) return;
    setStep(7);
  };

  const continueToValueLetter = () => {
    setStep(8);
  };

  const finishOnboarding = () => {
    if (typeof onComplete === "function") {
      onComplete({
        dogName: dogName.trim(),
        breed: breed.trim(),
        ageRange,
        traits: [...traits],
        memorableMoment,
        photo: photoFile,
        photoName: photoFile?.name,
      });
    }
  };

  const displayName = dogName.trim() || "your dog";
  const canContinueTraits = traits.length >= 1 && traits.length <= MAX_TRAITS;

  const isNoStepperSlide = step === 7 || step === 8;

  return (
    <div className={isNoStepperSlide ? "onboard-screen onboard-screen--step4" : "onboard-screen"}>
      {!isNoStepperSlide && (
        <header className="onboard-header">
          <button type="button" className="onboard-back" onClick={handleBack} aria-label={step === 1 ? "Go back to home" : "Previous step"}>
            <ArrowLeft size={20} weight="regular" className="onboard-back-icon" />
          </button>
          <div
            className="onboard-progress"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-label={`Step ${step} of ${TOTAL_STEPS}`}
          >
            <div className="onboard-progress-track" />
            <div className="onboard-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="onboard-header-spacer" aria-hidden="true" />
        </header>
      )}

      {step === 1 && (
        <>
          <form id="onboard-step-1" className="onboard-main" onSubmit={submitName}>
            <h1 className="onboard-title">What&apos;s your dog&apos;s name?</h1>
            <label className="visually-hidden" htmlFor="dog-name">
              Dog name
            </label>
            <div className="onboard-input-wrap">
              <input
                id="dog-name"
                className="onboard-input"
                type="text"
                name="dogName"
                autoComplete="off"
                autoCapitalize="words"
                placeholder="Bella, Max, or Daisy"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
              />
            </div>
          </form>
          <footer className="onboard-footer">
            <button type="submit" className="onboard-continue" form="onboard-step-1" disabled={!dogName.trim()}>
              Continue
              <ArrowRight size={18} weight="bold" className="onboard-continue-icon" />
            </button>
          </footer>
        </>
      )}

      {step === 2 && (
        <>
          <form id="onboard-step-2" className="onboard-main" onSubmit={submitBreed}>
            <div className="onboard-step2-copy">
              <h1 className="onboard-title">What breed is {displayName}?</h1>
              <p className="onboard-lede">This shapes how we write your dog&apos;s letter.</p>
            </div>
            <label className="visually-hidden" htmlFor="dog-breed">
              Dog breed
            </label>
            <div className="onboard-input-wrap">
              <input
                id="dog-breed"
                className="onboard-input"
                type="text"
                name="breed"
                autoComplete="off"
                autoCapitalize="words"
                placeholder="e.g. Golden Retriever"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />
            </div>
          </form>
          <footer className="onboard-footer">
            <button type="submit" className="onboard-continue" form="onboard-step-2" disabled={!breed.trim()}>
              Continue
              <ArrowRight size={18} weight="bold" className="onboard-continue-icon" />
            </button>
          </footer>
        </>
      )}

      {step === 3 && (
        <>
          <form id="onboard-step-age" className="onboard-main onboard-main--age" onSubmit={submitAge}>
            <div className="onboard-step2-copy">
              <h1 className="onboard-title">How old is {displayName}?</h1>
              <p className="onboard-lede">This shapes how we write your dog&apos;s letter.</p>
            </div>
            <div className="onboard-age-list" role="group" aria-label="Dog age">
              {AGE_OPTIONS.map((label) => {
                const selected = ageRange === label;
                return (
                  <button
                    key={label}
                    type="button"
                    className={selected ? "onboard-age-option is-selected" : "onboard-age-option"}
                    onClick={() => setAgeRange(label)}
                    aria-pressed={selected}
                  >
                    <span className="onboard-age-label">{label}</span>
                    {selected ? (
                      <Check className="onboard-age-check" size={20} weight="bold" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </form>
          <footer className="onboard-footer">
            <button
              type="submit"
              className="onboard-continue"
              form="onboard-step-age"
              disabled={!ageRange}
            >
              Continue
              <ArrowRight size={18} weight="bold" className="onboard-continue-icon" />
            </button>
          </footer>
        </>
      )}

      {step === 4 && (
        <>
          <form id="onboard-step-traits" className="onboard-main onboard-main--traits" onSubmit={submitTraits}>
            <div className="onboard-step3-copy">
              <h1 className="onboard-title">What&apos;s {displayName} like?</h1>
              <p className="onboard-lede onboard-lede--step3">Choose up to 5</p>
            </div>
            <div className="onboard-traits" role="group" aria-label="Personality traits">
              {TRAIT_OPTIONS.map((label) => {
                const selected = traits.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    className={selected ? "onboard-trait is-selected" : "onboard-trait"}
                    onClick={() => toggleTrait(label)}
                    aria-pressed={selected}
                  >
                    <span className="onboard-trait-label">{label}</span>
                    {selected ? (
                      <Check className="onboard-trait-check" size={20} weight="bold" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </form>
          <footer className="onboard-footer">
            <button
              type="submit"
              className="onboard-continue"
              form="onboard-step-traits"
              disabled={!canContinueTraits}
            >
              Continue
              <ArrowRight size={18} weight="bold" className="onboard-continue-icon" />
            </button>
          </footer>
        </>
      )}

      {step === 5 && (
        <>
          <form
            id="onboard-step-memorable"
            className="onboard-main onboard-main--age"
            onSubmit={submitMemorableMoment}
          >
            <h1 className="onboard-title">
              What&apos;s one thing {displayName} does you never want to forget?
            </h1>
            <div
              className="onboard-age-list onboard-memorable-list"
              role="group"
              aria-label="A moment to remember"
            >
              {MEMORABLE_MOMENT_OPTIONS.map((label) => {
                const selected = memorableMoment === label;
                return (
                  <button
                    key={label}
                    type="button"
                    className={selected ? "onboard-age-option is-selected" : "onboard-age-option"}
                    onClick={() => setMemorableMoment(label)}
                    aria-pressed={selected}
                  >
                    <span className="onboard-age-label">{label}</span>
                    {selected ? (
                      <Check className="onboard-age-check" size={20} weight="bold" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </form>
          <footer className="onboard-footer">
            <button
              type="submit"
              className="onboard-continue"
              form="onboard-step-memorable"
              disabled={!memorableMoment}
            >
              Continue
              <ArrowRight size={18} weight="bold" className="onboard-continue-icon" />
            </button>
          </footer>
        </>
      )}

      {step === 6 && (
        <>
          <form id="onboard-step-photo" className="onboard-main onboard-main--photo" onSubmit={submitPhoto}>
            <div className="onboard-step2-copy">
              <h1 className="onboard-title">
                Add {displayName === "your dog" ? "your dog" : `${displayName}`}&apos;s Photo
              </h1>
              <p className="onboard-lede">
                Choose a photo that shows only {displayName === "your dog" ? "your dog" : displayName}.
              </p>
            </div>
            <input
              ref={fileInputRef}
              id="dog-photo"
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
              onChange={(e) => {
                const f = e.target.files?.[0];
                handlePhotoFile(f ?? null);
              }}
            />
            <label htmlFor="dog-photo" className="onboard-photo-drop">
              {photoPreview ? (
                <span className="onboard-photo-preview-wrap">
                  <img src={photoPreview} alt="" className="onboard-photo-preview" />
                </span>
              ) : null}
              <span className="onboard-photo-drop-inner">
                <CameraPlus className="onboard-photo-icon" size={40} weight="duotone" aria-hidden="true" />
                <span className="onboard-photo-tap">Tap to Upload</span>
                <span className="onboard-photo-hint">JPG, JPEG, PNG less than 1MB</span>
              </span>
            </label>
            {photoError ? <p className="onboard-photo-error">{photoError}</p> : null}
          </form>
          <footer className="onboard-footer onboard-footer--photo">
            <button
              type="submit"
              className="onboard-continue"
              form="onboard-step-photo"
              disabled={!photoFile}
            >
              Continue
              <ArrowRight size={18} weight="bold" className="onboard-continue-icon" />
            </button>
          </footer>
        </>
      )}

      {step === 7 && (
        <div className="onboard-step4 onboard-step4--postcard">
          <div className="onboard-step4-hero-wrap">
            <button type="button" className="onboard-step4-back" onClick={handleBack} aria-label="Previous step">
              <ArrowLeft size={20} weight="regular" className="onboard-step4-back-icon" />
            </button>
            <figure className="onboard-step4-hero" aria-hidden="false">
              <img
                src={postcardExplainerImage}
                alt="Your photo becomes a custom illustrated postcard of your dog"
              />
            </figure>
          </div>
          <div className="onboard-step4-content">
            <h2 className="onboard-step4-title">A custom illustrated postcard of your dog.</h2>
            <ul className="onboard-step4-list" role="list">
              {POSTCARD_BULLETS.map((line) => (
                <li key={line} className="onboard-step4-item">
                  <span className="onboard-step4-check" aria-hidden="true">
                    <Check className="onboard-step4-check-glyph" size={14} weight="bold" />
                  </span>
                  <span className="onboard-step4-text">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <footer className="onboard-step4-footer">
            <button type="button" className="onboard-continue" onClick={continueToValueLetter}>
              Continue
              <ArrowRight size={18} weight="bold" className="onboard-continue-icon" />
            </button>
          </footer>
        </div>
      )}

      {step === 8 && (
        <div className="onboard-step4">
          <div className="onboard-step4-hero-wrap">
            <button type="button" className="onboard-step4-back" onClick={handleBack} aria-label="Previous step">
              <ArrowLeft size={20} weight="regular" className="onboard-step4-back-icon" />
            </button>
            <figure className="onboard-step4-hero" aria-hidden="false">
              <img src={step4HeroImage} alt="A dog beside a personal letter on the sofa" />
            </figure>
          </div>
          <div className="onboard-step4-content">
            <h2 className="onboard-step4-title">A letter from your dog, written just for you.</h2>
            <ul className="onboard-step4-list" role="list">
              {VALUE_LETTER_BULLETS.map((line) => (
                <li key={line} className="onboard-step4-item">
                  <span className="onboard-step4-check" aria-hidden="true">
                    <Check className="onboard-step4-check-glyph" size={14} weight="bold" />
                  </span>
                  <span className="onboard-step4-text">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <footer className="onboard-step4-footer">
            <button type="button" className="onboard-continue" onClick={finishOnboarding}>
              Continue
              <ArrowRight size={18} weight="bold" className="onboard-continue-icon" />
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
