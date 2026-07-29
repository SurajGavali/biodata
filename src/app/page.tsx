"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  biodata,
  type BiodataSection,
  type Locale,
  type LocalizedText,
  uiCopy,
} from "./biodata";

type ExportStatus = "pdf" | "png" | null;

const localized = (text: LocalizedText, locale: Locale) => text[locale];

function DetailSection({
  section,
  locale,
}: {
  section: BiodataSection;
  locale: Locale;
}) {
  return (
    <section className="bioSection">
      <div className="sectionHeading">
        <span className="headingMark" aria-hidden="true" />
        <h2>{localized(section.title, locale)}</h2>
      </div>
      <dl className="detailList">
        {section.details.map((detail) => (
          <div className="detailRow" key={detail.label.en}>
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
              src="/profile-placeholder.png"
              alt={
                locale === "en"
                  ? "Temporary placeholder portrait for Suraj Gavali"
                  : "सुरज गावळी यांच्यासाठी तात्पुरते छायाचित्र"
              }
              fill
              priority
              sizes={exportMode ? "220px" : "(max-width: 760px) 180px, 230px"}
              className="portraitImage"
            />
          </div>
        </div>

        <div className="identity">
          <h1>
            <span>{localized(biodata.name, locale).split(" ")[0]}</span>
            <strong>
              {localized(biodata.name, locale).split(" ").slice(1).join(" ")}
            </strong>
          </h1>
          <p className="headline">{localized(biodata.headline, locale)}</p>
          <span className="titleRule" aria-hidden="true" />
        </div>
      </header>

      <div className="contentGrid">
        <div className="column">
          <section className="bioSection aboutSection">
            <div className="sectionHeading">
              <span className="headingMark" aria-hidden="true" />
              <h2>{copy.about}</h2>
            </div>
            <p>{localized(biodata.introduction, locale)}</p>
          </section>
          <DetailSection section={biodata.personal} locale={locale} />
          <DetailSection section={biodata.education} locale={locale} />
        </div>

        <div className="column columnRight">
          <DetailSection section={biodata.horoscope} locale={locale} />
          <DetailSection section={biodata.family} locale={locale} />
          <DetailSection section={biodata.contact} locale={locale} />
        </div>
      </div>

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
  const exportRef = useRef<HTMLDivElement>(null);
  const copy = uiCopy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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
          author: "Suraj Maruti Gavali",
          subject: "Marriage biodata",
          title: `Suraj Maruti Gavali Biodata (${locale.toUpperCase()})`,
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

      <section className="pageIntro">
        <div>
          <p className="pageEyebrow">{copy.pageEyebrow}</p>
          <h2>{copy.pageTitle}</h2>
          <p>{copy.pageDescription}</p>
        </div>

        <div className="controls">
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

          <div className="downloadButtons">
            <button
              type="button"
              className="downloadButton secondaryButton"
              disabled={exportStatus !== null}
              onClick={() => handleDownload("png")}
            >
              {exportStatus === "png" ? copy.generatingPng : copy.downloadPng}
            </button>
            <button
              type="button"
              className="downloadButton primaryButton"
              disabled={exportStatus !== null}
              onClick={() => handleDownload("pdf")}
            >
              {exportStatus === "pdf" ? copy.generatingPdf : copy.downloadPdf}
            </button>
          </div>
          <p className="controlStatus" role="status" aria-live="polite">
            {exportError ? copy.downloadError : ""}
          </p>
        </div>
      </section>

      <div className="sheetWrapper">
        <BiodataSheet locale={locale} />
      </div>

      <div className="exportStage" ref={exportRef} aria-hidden="true">
        <BiodataSheet locale={locale} exportMode />
      </div>
    </main>
  );
}
