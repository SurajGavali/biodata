"use client";

import { toPng } from "html-to-image";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  CircleUserRound,
  Download,
  FileText,
  GraduationCap,
  Grid3X3,
  HeartHandshake,
  ImageDown,
  Landmark,
  Languages,
  MapPin,
  Phone,
  Ruler,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type ComponentType,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  biodata,
  type Detail,
  type Locale,
  type LocalizedText,
  profileFacts,
} from "../biodata";
import styles from "./instastyle.module.css";

type ExportStatus = "pdf" | "png" | null;
type TileId =
  | "profile"
  | "personal"
  | "birth"
  | "education"
  | "career"
  | "family"
  | "traditions"
  | "contact"
  | "relations";

type Tile = {
  id: TileId;
  title: LocalizedText;
  eyebrow: LocalizedText;
  preview: LocalizedText;
  details: Detail[];
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  tone: string;
  photo?: boolean;
};

const copy = {
  en: {
    age: "Age",
    height: "Height",
    salary: "Salary",
    classic: "Classic Biodata",
    contact: "Contact",
    language: "Switch to Marathi",
    highlights: "Biodata highlights",
    posts: "Biodata grid",
    close: "Close",
    download: "Download",
    chooseFormat: "Choose a format",
    png: "High-resolution PNG",
    pdf: "A4 PDF document",
    preparingPng: "Preparing PNG…",
    preparingPdf: "Preparing PDF…",
    error: "The download could not be created. Please try again.",
    marriageBiodata: "Marriage Biodata",
    years: "25",
    private: "Private",
    view: "View details",
    profileLabel: "Profile",
    personalLabel: "Personal",
    careerLabel: "Career",
    familyLabel: "Family",
    traditionsLabel: "Traditions",
    contactLabel: "Contact",
  },
  mr: {
    age: "वय",
    height: "उंची",
    salary: "पगार",
    classic: "क्लासिक परिचयपत्र",
    contact: "संपर्क",
    language: "Switch to English",
    highlights: "परिचय ठळक माहिती",
    posts: "परिचय माहिती ग्रिड",
    close: "बंद करा",
    download: "डाउनलोड",
    chooseFormat: "स्वरूप निवडा",
    png: "उच्च दर्जाची PNG",
    pdf: "A4 PDF दस्तऐवज",
    preparingPng: "PNG तयार होत आहे…",
    preparingPdf: "PDF तयार होत आहे…",
    error: "डाउनलोड तयार करता आले नाही. कृपया पुन्हा प्रयत्न करा.",
    marriageBiodata: "विवाह परिचयपत्र",
    years: "२५",
    private: "गोपनीय",
    view: "माहिती पहा",
    profileLabel: "परिचय",
    personalLabel: "वैयक्तिक",
    careerLabel: "करिअर",
    familyLabel: "कुटुंब",
    traditionsLabel: "परंपरा",
    contactLabel: "संपर्क",
  },
} satisfies Record<Locale, Record<string, string>>;

const localize = (text: LocalizedText, locale: Locale) => text[locale];

const localizedDetail = (
  label: LocalizedText,
  value: LocalizedText,
): Detail => ({ label, value });

function calculateAge(dateString: string) {
  const today = new Date();
  const birthDate = new Date(`${dateString}T00:00:00`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (beforeBirthday) {
    age -= 1;
  }

  return age;
}

function createTiles(age: number): Tile[] {
  const personal = biodata.personal.details;
  const education = biodata.education.details;
  const contact = biodata.contact.details;

  return [
    {
      id: "profile",
      title: { en: "Profile", mr: "परिचय" },
      eyebrow: { en: "Meet Suraj", mr: "सुरज यांचा परिचय" },
      preview: biodata.name,
      icon: CircleUserRound,
      tone: "sunset",
      photo: true,
      details: [
        localizedDetail(
          { en: "Name", mr: "नाव" },
          biodata.name,
        ),
        localizedDetail(
          { en: "Introduction", mr: "थोडक्यात" },
          biodata.introduction,
        ),
      ],
    },
    {
      id: "personal",
      title: { en: "Personal", mr: "वैयक्तिक" },
      eyebrow: { en: "At a glance", mr: "एका नजरेत" },
      preview: profileFacts.height,
      icon: Ruler,
      tone: "berry",
      details: personal.slice(3, 6),
    },
    {
      id: "birth",
      title: { en: "Birth", mr: "जन्म माहिती" },
      eyebrow: { en: `${age} years`, mr: "२५ वर्षे" },
      preview: personal[0].value,
      icon: CalendarDays,
      tone: "ocean",
      details: [
        localizedDetail(
          { en: "Age", mr: "वय" },
          { en: `${age} years`, mr: "२५ वर्षे" },
        ),
        ...personal.slice(0, 3),
      ],
    },
    {
      id: "education",
      title: { en: "Education", mr: "शिक्षण" },
      eyebrow: { en: "B.Tech CSE", mr: "बी.टेक. CSE" },
      preview: education[0].value,
      icon: GraduationCap,
      tone: "violet",
      details: [education[0]],
    },
    {
      id: "career",
      title: { en: "Career", mr: "करिअर" },
      eyebrow: { en: "Software", mr: "सॉफ्टवेअर" },
      preview: education[1].value,
      icon: BriefcaseBusiness,
      tone: "amber",
      details: [
        ...education.slice(1),
        localizedDetail(
          { en: "Salary", mr: "पगार" },
          profileFacts.salary,
        ),
      ],
    },
    {
      id: "family",
      title: { en: "Family", mr: "कुटुंब" },
      eyebrow: { en: "Rooted together", mr: "कुटुंबाची साथ" },
      preview: {
        en: "Parents, brother & family",
        mr: "आई-वडील, भाऊ व कुटुंब",
      },
      icon: UsersRound,
      tone: "forest",
      details: biodata.family.details,
    },
    {
      id: "traditions",
      title: { en: "Traditions", mr: "परंपरा" },
      eyebrow: { en: "Values & roots", mr: "संस्कार व परंपरा" },
      preview: {
        en: "Hindu · Chambhar",
        mr: "हिंदू · चांभार",
      },
      icon: Landmark,
      tone: "rose",
      details: biodata.horoscope.details,
    },
    {
      id: "contact",
      title: { en: "Contact", mr: "संपर्क" },
      eyebrow: { en: "Kolhapur", mr: "कोल्हापूर" },
      preview: contact[0].value,
      icon: Phone,
      tone: "blue",
      details: contact.slice(0, 4),
    },
    {
      id: "relations",
      title: { en: "Relations", mr: "नातेसंबंध" },
      eyebrow: { en: "Extended family", mr: "इतर पाहुणे" },
      preview: {
        en: "Family connections",
        mr: "कौटुंबिक नातेसंबंध",
      },
      icon: HeartHandshake,
      tone: "plum",
      details: [contact[4]],
    },
  ];
}

const highlightIds: TileId[] = [
  "personal",
  "career",
  "family",
  "traditions",
  "contact",
];

async function waitForAssets(node: HTMLElement) {
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

function saveDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

function Portrait({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/profile-photo.png"
      alt="Suraj Gavali"
      fill
      priority={priority}
      sizes="(max-width: 640px) 96px, 160px"
      className={styles.portrait}
    />
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className={styles.stat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ProfileContent({
  age,
  exportMode = false,
  locale,
  onOpen,
  tiles,
}: {
  age: number;
  exportMode?: boolean;
  locale: Locale;
  onOpen?: (id: TileId, trigger?: HTMLElement) => void;
  tiles: Tile[];
}) {
  const text = copy[locale];
  const Component = exportMode ? "div" : "button";

  return (
    <article
      className={`${styles.profileCard} ${exportMode ? styles.exportCard : ""}`}
      lang={locale}
    >
      {exportMode && (
        <div className={styles.exportBrand}>
          <span>{profileFacts.username}</span>
          <span>{text.marriageBiodata}</span>
        </div>
      )}

      <header className={styles.profileHeader}>
        <div className={styles.avatarRing}>
          <div className={styles.avatar}>
            <Portrait priority />
          </div>
        </div>

        <div className={styles.profileStats}>
          <Stat label={text.age} value={locale === "mr" ? text.years : age} />
          <Stat
            label={text.height}
            value={localize(profileFacts.height, locale)}
          />
          <Stat
            label={text.salary}
            value={localize(profileFacts.salary, locale)}
          />
        </div>

        <div className={styles.identity}>
          <div className={styles.nameLine}>
            <h1>{localize(biodata.name, locale)}</h1>
            <Sparkles size={18} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <p className={styles.headline}>
            <BriefcaseBusiness size={16} aria-hidden="true" />
            {locale === "en" ? "Software Engineer" : "सॉफ्टवेअर इंजिनिअर"}
          </p>
          <p className={styles.bio}>
            {locale === "en" ? "B.Tech CSE" : "बी.टेक. CSE"}
            <br />
            <MapPin size={14} aria-hidden="true" />
            {locale === "en" ? "Pune · Kolhapur" : "पुणे · कोल्हापूर"}
            <br />
            <HeartHandshake size={14} aria-hidden="true" />
            {text.marriageBiodata}
          </p>
        </div>

        {!exportMode && (
          <div className={styles.profileActions}>
            <Link className={styles.secondaryAction} href="/">
              <FileText size={16} aria-hidden="true" />
              {text.classic}
            </Link>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={(event) =>
                onOpen?.("contact", event.currentTarget as HTMLElement)
              }
            >
              <Phone size={16} aria-hidden="true" />
              {text.contact}
            </button>
          </div>
        )}
      </header>

      <section className={styles.highlights} aria-label={text.highlights}>
        {highlightIds.map((id) => {
          const tile = tiles.find((item) => item.id === id)!;
          const Icon = tile.icon;

          return (
            <Component
              className={styles.highlight}
              key={id}
              {...(!exportMode
                ? {
                    type: "button" as const,
                    onClick: (event: ReactMouseEvent<HTMLElement>) =>
                      onOpen?.(id, event.currentTarget),
                    "aria-label": `${localize(tile.title, locale)} — ${text.view}`,
                  }
                : {})}
            >
              <span className={styles.highlightRing}>
                <span className={styles.highlightInner}>
                  <Icon size={24} strokeWidth={1.7} />
                </span>
              </span>
              <span>{localize(tile.title, locale)}</span>
            </Component>
          );
        })}
      </section>

      <div className={styles.gridTabs} aria-hidden="true">
        <Grid3X3 size={22} />
        <span>{text.posts}</span>
      </div>

      <section className={styles.tileGrid} aria-label={text.posts}>
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Component
              className={`${styles.tile} ${styles[tile.tone]}`}
              key={tile.id}
              {...(!exportMode
                ? {
                    type: "button" as const,
                    onClick: (event: ReactMouseEvent<HTMLElement>) =>
                      onOpen?.(tile.id, event.currentTarget),
                    "aria-label": `${localize(tile.title, locale)} — ${text.view}`,
                  }
                : {})}
            >
              {tile.photo ? (
                <>
                  <div className={styles.tilePhoto}>
                    <Portrait />
                  </div>
                  <span className={styles.photoShade} aria-hidden="true" />
                </>
              ) : (
                <span className={styles.tilePattern} aria-hidden="true" />
              )}
              <div className={styles.tileContent}>
                <Icon size={exportMode ? 25 : 28} strokeWidth={1.7} />
                <small>{localize(tile.eyebrow, locale)}</small>
                <strong>{localize(tile.title, locale)}</strong>
                <span>{localize(tile.preview, locale)}</span>
              </div>
            </Component>
          );
        })}
      </section>

      {exportMode && (
        <footer className={styles.exportFooter}>
          <span>surajgavali.vercel.app/instastyle</span>
          <span>English · मराठी</span>
        </footer>
      )}
    </article>
  );
}

function DetailDialog({
  locale,
  onClose,
  tile,
}: {
  locale: Locale;
  onClose: () => void;
  tile: Tile;
}) {
  const Icon = tile.icon;
  const text = copy[locale];
  const titleId = `dialog-${tile.id}-title`;

  return (
    <div
      className={styles.dialogBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.dialogHandle} aria-hidden="true" />
        <header className={styles.dialogHeader}>
          <span className={`${styles.dialogIcon} ${styles[tile.tone]}`}>
            <Icon size={23} strokeWidth={1.8} />
          </span>
          <div>
            <small>{localize(tile.eyebrow, locale)}</small>
            <h2 id={titleId}>{localize(tile.title, locale)}</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            aria-label={text.close}
            autoFocus
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </header>

        <dl className={styles.dialogDetails}>
          {tile.details.map((detail, index) => {
            const value = localize(detail.value, locale);
            const isPhone = tile.id === "contact" && index > 0;
            return (
              <div key={`${detail.label.en}-${index}`}>
                <dt>{localize(detail.label, locale)}</dt>
                <dd>
                  {isPhone ? (
                    <a href={`tel:+91${detail.value.en}`}>{value}</a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            );
          })}
        </dl>

        {tile.id === "contact" && (
          <a className={styles.callAction} href="tel:+918408012121">
            <Phone size={17} aria-hidden="true" />
            {locale === "en" ? "Call primary number" : "मुख्य क्रमांकावर कॉल करा"}
          </a>
        )}
      </section>
    </div>
  );
}

export default function InstaStylePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [activeTileId, setActiveTileId] = useState<TileId | null>(null);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<ExportStatus>(null);
  const [exportError, setExportError] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const age = calculateAge(profileFacts.birthDate);
  const tiles = useMemo(() => createTiles(age), [age]);
  const activeTile = tiles.find((tile) => tile.id === activeTileId);
  const text = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!activeTileId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveTileId(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [activeTileId]);

  useEffect(() => {
    if (!downloadOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        downloadRef.current &&
        !downloadRef.current.contains(event.target as Node)
      ) {
        setDownloadOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDownloadOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [downloadOpen]);

  const openTile = (id: TileId, trigger?: HTMLElement) => {
    previousFocusRef.current = trigger ?? document.activeElement as HTMLElement;
    setActiveTileId(id);
  };

  const createExport = async () => {
    const node = exportRef.current?.querySelector<HTMLElement>(
      `.${styles.exportCard}`,
    );
    if (!node) {
      throw new Error("Export profile was not found.");
    }

    await waitForAssets(node);

    return toPng(node, {
      backgroundColor: "#fafafa",
      cacheBust: true,
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
    setDownloadOpen(false);

    try {
      const imageData = await createExport();
      const filename = `suraj-gavali-instastyle-${locale}`;

      if (format === "png") {
        saveDataUrl(imageData, `${filename}.png`);
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
          title: `Suraj Gavali Insta Style Biodata (${locale.toUpperCase()})`,
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
    <main className={styles.page}>
      <nav className={styles.topbar} aria-label="Profile navigation">
        <div className={styles.handle}>
          <CircleUserRound size={22} strokeWidth={1.8} aria-hidden="true" />
          <strong>{profileFacts.username}</strong>
        </div>
        <div className={styles.topActions}>
          <Link className={styles.classicLink} href="/">
            <ChevronLeft size={17} aria-hidden="true" />
            <span>{text.classic}</span>
          </Link>
          <button
            className={styles.languageButton}
            type="button"
            aria-label={text.language}
            onClick={() =>
              setLocale((current) => (current === "en" ? "mr" : "en"))
            }
          >
            <Languages size={18} aria-hidden="true" />
            <span>{locale === "en" ? "मराठी" : "EN"}</span>
          </button>
        </div>
      </nav>

      <ProfileContent
        age={age}
        locale={locale}
        onOpen={openTile}
        tiles={tiles}
      />

      <div className={styles.exportStage} ref={exportRef} aria-hidden="true">
        <ProfileContent
          age={age}
          exportMode
          locale={locale}
          tiles={tiles}
        />
      </div>

      <div className={styles.floatingDownload} ref={downloadRef}>
        {downloadOpen && (
          <div
            className={styles.downloadMenu}
            id="insta-download-menu"
            role="group"
            aria-label={text.chooseFormat}
          >
            <button
              type="button"
              disabled={exportStatus !== null}
              onClick={() => handleDownload("png")}
            >
              <ImageDown size={21} aria-hidden="true" />
              <span>
                <strong>PNG</strong>
                <small>{text.png}</small>
              </span>
            </button>
            <button
              type="button"
              disabled={exportStatus !== null}
              onClick={() => handleDownload("pdf")}
            >
              <FileText size={21} aria-hidden="true" />
              <span>
                <strong>PDF</strong>
                <small>{text.pdf}</small>
              </span>
            </button>
          </div>
        )}
        <button
          type="button"
          className={styles.downloadButton}
          aria-expanded={downloadOpen}
          aria-controls="insta-download-menu"
          disabled={exportStatus !== null}
          onClick={() => setDownloadOpen((current) => !current)}
        >
          <Download size={20} aria-hidden="true" />
          <span>
            {exportStatus === "png"
              ? text.preparingPng
              : exportStatus === "pdf"
                ? text.preparingPdf
                : text.download}
          </span>
        </button>
        <p className={styles.error} role="status" aria-live="polite">
          {exportError ? text.error : ""}
        </p>
      </div>

      {activeTile && (
        <DetailDialog
          locale={locale}
          onClose={() => setActiveTileId(null)}
          tile={activeTile}
        />
      )}
    </main>
  );
}
