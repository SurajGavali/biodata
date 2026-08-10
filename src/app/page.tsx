"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  biodata,
  type BiodataSection,
  type Locale,
  type LocalizedText,
  profileFacts,
  uiCopy,
} from "./biodata";

type ExportStatus = "pdf" | "png" | null;

const localized = (text: LocalizedText, locale: Locale) => text[locale];

const socialLinks = [
  {
    href: "https://instagram.com/surajgavali_",
    label: "Instagram",
    type: "instagram",
  },
  {
    href: "https://www.linkedin.com/in/suraj-gavali",
    label: "LinkedIn",
    type: "linkedin",
  },
] as const;

function InstagramSymbol() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle className="socialSymbolDot" cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

function LinkedInSymbol() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle className="socialSymbolDot" cx="7.25" cy="8" r="1.15" />
      <path d="M6.25 11v6.5h2V11zM11 11v6.5h2v-3.2c0-1.2.5-1.9 1.55-1.9 1 0 1.45.66 1.45 1.9v3.2h2v-3.75c0-2.1-1.15-3.1-2.75-3.1-1.15 0-1.9.62-2.25 1.18V11z" />
    </svg>
  );
}

function DetailSection({
  section,
  locale,
  className = "",
}: {
  section: BiodataSection;
  locale: Locale;
  className?: string;
}) {
  return (
    <section className={`bioSection ${className}`.trim()}>
      <div className="sectionHeading">
        <span className="headingMark" aria-hidden="true" />
        <h2>{localized(section.title, locale)}</h2>
      </div>
      <dl className="detailList">
        {section.details.map((detail, index) => (
          <div
            className="detailRow"
            key={`${detail.label.en}-${detail.value.en}-${index}`}
          >
            <dt>{localized(detail.label, locale)}</dt>
            <dd>{localized(detail.value, locale)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function BiodataSheet({
  locale,
  exportMode = false,
}: {
  locale: Locale;
  exportMode?: boolean;
}) {
  const copy = uiCopy[locale];
  const classicPersonal: BiodataSection = {
    ...biodata.personal,
    details: biodata.personal.details.filter(
      (detail) =>
        detail.label.en !== "Date of birth" &&
        detail.label.en !== "Birth place",
    ),
  };
  const classicEducation: BiodataSection = {
    ...biodata.education,
    details: biodata.education.details.filter(
      (detail) =>
        detail.label.en !== "Profession" &&
        detail.label.en !== "Employer" &&
        detail.label.en !== "Work location",
    ),
  };
  const classicContact: BiodataSection = {
    ...biodata.contact,
    details: biodata.contact.details.filter(
      (detail) => detail.label.en !== "Relations",
    ),
  };
  const classicRelations: BiodataSection = {
    title: { en: "Relations", mr: "नातेसंबंध" },
    details: biodata.contact.details.filter(
      (detail) => detail.label.en === "Relations",
    ),
  };

  return (
    <article
      className={`biodataSheet ${exportMode ? "exportSheet" : ""}`}
      lang={locale}
    >
      <div className="sheetAccent sheetAccentTop" aria-hidden="true" />
      <div className="sheetAccent sheetAccentBottom" aria-hidden="true" />

      <header className="profileHeader">
        <div className="portraitOrbits">
          <span className="orbit orbitOne" aria-hidden="true" />
          <span className="orbit orbitTwo" aria-hidden="true" />
          <div className="portraitFrame">
            <Image
              src="/profile-avatar-2026.png"
              alt={
                locale === "en"
                  ? "Portrait of Suraj Gavali"
                  : "सुरज गवळी यांचे छायाचित्र"
              }
              fill
              loading="eager"
              sizes={
                exportMode
                  ? "276px"
                  : "(max-width: 420px) 135px, (max-width: 700px) 149px, (max-width: 900px) 308px, 342px"
              }
              className="portraitImage"
            />
          </div>
        </div>

        <div className="identity">
          <h1>{localized(biodata.name, locale)}</h1>
          <p className="headline">{localized(biodata.headline, locale)}</p>
          <span className="titleRule" aria-hidden="true" />
          <dl className="headerFacts">
            <div>
              <dt>{locale === "en" ? "Born" : "जन्म"}</dt>
              <dd>{localized(profileFacts.born, locale)}</dd>
            </div>
            <div>
              <dt>{locale === "en" ? "Location" : "ठिकाण"}</dt>
              <dd>{localized(profileFacts.location, locale)}</dd>
            </div>
            <div>
              <dt>{locale === "en" ? "Social" : "सोशल"}</dt>
              <dd className="headerSocialLinks">
                {socialLinks.map((social) => (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${social.label} profile`}
                    key={social.href}
                  >
                    {social.type === "instagram" ? (
                      <InstagramSymbol />
                    ) : (
                      <LinkedInSymbol />
                    )}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="contentGrid desktopContentGrid">
        <div className="column">
          <DetailSection section={classicPersonal} locale={locale} />
          <DetailSection section={biodata.horoscope} locale={locale} />
          <DetailSection section={classicContact} locale={locale} />
        </div>

        <div className="column columnRight">
          <DetailSection section={classicEducation} locale={locale} />
          <DetailSection section={biodata.family} locale={locale} />
          <DetailSection section={biodata.occupation} locale={locale} />
          <DetailSection section={classicRelations} locale={locale} />
        </div>
      </div>

      {!exportMode && (
        <div className="mobileContentGrid">
          <div className="mobileColumn mobileRail">
            <DetailSection section={classicPersonal} locale={locale} />
            <DetailSection section={biodata.horoscope} locale={locale} />
            <DetailSection section={classicContact} locale={locale} />
          </div>

          <div className="mobileColumn mobileMain">
            <DetailSection section={classicEducation} locale={locale} />
            <DetailSection section={biodata.family} locale={locale} />
            <DetailSection section={biodata.occupation} locale={locale} />
            <DetailSection section={classicRelations} locale={locale} />
          </div>
        </div>
      )}

      <footer className="sheetFooter">
        <span>{copy.footerNotice}</span>
      </footer>
    </article>
  );
}

async function waitForExportAssets(node: HTMLElement) {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve, reject) => {
          if (image.complete && image.naturalWidth > 0) {
            resolve();
            return;
          }

          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => reject(), { once: true });
        }),
    ),
  );
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [exportStatus, setExportStatus] = useState<ExportStatus>(null);
  const [exportError, setExportError] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const copy = uiCopy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!downloadMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target as Node)
      ) {
        setDownloadMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDownloadMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [downloadMenuOpen]);

  const createExportImage = async () => {
    const node = exportRef.current?.querySelector<HTMLElement>(".exportSheet");
    if (!node) {
      throw new Error("Export sheet was not found.");
    }

    await waitForExportAssets(node);

    return toPng(node, {
      cacheBust: true,
      backgroundColor: "#ffffff",
      height: 1123,
      pixelRatio: 2,
      quality: 1,
      width: 794,
    });
  };

  const handleDownload = async (format: Exclude<ExportStatus, null>) => {
    if (exportStatus) {
      return;
    }

    setExportError(false);
    setExportStatus(format);
    setDownloadMenuOpen(false);

    try {
      const imageData = await createExportImage();
      const filename = `suraj-gavali-biodata-${locale}`;

      if (format === "png") {
        downloadDataUrl(imageData, `${filename}.png`);
      } else {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({
          compress: true,
          format: "a4",
          orientation: "portrait",
          unit: "mm",
        });
        pdf.addImage(imageData, "PNG", 0, 0, 210, 297, undefined, "FAST");
        pdf.setProperties({
          author: "Suraj Gavali",
          subject: "Marriage biodata",
          title: `Suraj Gavali Biodata (${locale.toUpperCase()})`,
        });
        pdf.save(`${filename}.pdf`);
      }
    } catch (error) {
      console.error(error);
      setExportError(true);
    } finally {
      setExportStatus(null);
    }
  };

  return (
    <main className="pageShell">
      <div className="backgroundShape backgroundShapeOne" aria-hidden="true" />
      <div className="backgroundShape backgroundShapeTwo" aria-hidden="true" />

      <div className="pageIntro">
        <div className="controls">
          <Link className="styleSwitch" href="/instastyle">
            <span aria-hidden="true">◎</span>
            Insta Style
          </Link>
          <div className="languageControl">
            <span>{copy.language}</span>
            <div className="segmentedControl" role="group" aria-label={copy.language}>
              <button
                type="button"
                aria-pressed={locale === "en"}
                className={locale === "en" ? "active" : ""}
                onClick={() => setLocale("en")}
              >
                {copy.english}
              </button>
              <button
                type="button"
                aria-pressed={locale === "mr"}
                className={locale === "mr" ? "active" : ""}
                onClick={() => setLocale("mr")}
              >
                {copy.marathi}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sheetWrapper">
        <BiodataSheet locale={locale} />
      </div>

      <div className="exportStage" ref={exportRef} aria-hidden="true">
        <BiodataSheet locale={locale} exportMode />
      </div>

      <div className="floatingDownload" ref={downloadMenuRef}>
        {downloadMenuOpen && (
          <div
            className="downloadMenu"
            id="download-format-menu"
            role="group"
            aria-label={copy.chooseFormat}
          >
            <button
              type="button"
              disabled={exportStatus !== null}
              onClick={() => handleDownload("png")}
            >
              <span>PNG</span>
              <small>{copy.imageFormat}</small>
            </button>
            <button
              type="button"
              disabled={exportStatus !== null}
              onClick={() => handleDownload("pdf")}
            >
              <span>PDF</span>
              <small>{copy.documentFormat}</small>
            </button>
          </div>
        )}

        <button
          type="button"
          className="floatingDownloadButton"
          aria-expanded={downloadMenuOpen}
          aria-controls="download-format-menu"
          disabled={exportStatus !== null}
          onClick={() => setDownloadMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">↓</span>
          <span className="downloadButtonLabel">
            {exportStatus === "png"
              ? copy.generatingPng
              : exportStatus === "pdf"
                ? copy.generatingPdf
                : copy.download}
          </span>
        </button>
        <p className="controlStatus" role="status" aria-live="polite">
          {exportError ? copy.downloadError : ""}
        </p>
      </div>
    </main>
  );
}
