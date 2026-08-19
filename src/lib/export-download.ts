"use client";

import { toCanvas } from "html-to-image";

export type ExportFormat = "png" | "pdf";

export type PdfMetadata = {
  author?: string;
  creator?: string;
  keywords?: string;
  subject?: string;
  title?: string;
};

export type CreateExportOptions = {
  backgroundColor: string;
  filenameStem: string;
  format: ExportFormat;
  pdfMetadata?: PdfMetadata;
  target: HTMLElement;
};

export type ExportDownload = {
  blob: Blob;
  filename: string;
};

const EXPORT_WIDTH = 794;
const EXPORT_HEIGHT = 1123;
const EXPORT_PIXEL_RATIO = 2;
const ASSET_TIMEOUT_MS = 10_000;
const RENDER_TIMEOUT_MS = 30_000;
const OBJECT_URL_REVOKE_DELAY_MS = 60_000;

function imageSource(image: HTMLImageElement) {
  return image.currentSrc || image.src || "unknown source";
}

async function decodeImage(image: HTMLImageElement) {
  if (typeof image.decode === "function") {
    await image.decode();
  }
}

async function waitForImage(image: HTMLImageElement) {
  if (image.complete) {
    if (image.naturalWidth === 0) {
      throw new Error(`Export image failed to load: ${imageSource(image)}`);
    }

    await decodeImage(image);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };

    const handleLoad = () => {
      cleanup();

      if (image.naturalWidth === 0) {
        reject(
          new Error(`Export image failed to load: ${imageSource(image)}`),
        );
        return;
      }

      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error(`Export image failed to load: ${imageSource(image)}`));
    };

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });
  });

  await decodeImage(image);
}

async function waitForExportAssets(target: HTMLElement) {
  const fontsReady = "fonts" in document
    ? document.fonts.ready.then(() => undefined)
    : Promise.resolve();
  const imagesReady = Promise.all(
    Array.from(target.querySelectorAll("img"), waitForImage),
  ).then(() => undefined);

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      Promise.all([fontsReady, imagesReady]),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new Error(
              `Export assets did not become ready within ${ASSET_TIMEOUT_MS / 1_000} seconds.`,
            ),
          );
        }, ASSET_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("The browser could not create the PNG export."));
    }, "image/png");
  });
}

async function renderExportCanvas(
  target: HTMLElement,
  backgroundColor: string,
) {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      toCanvas(target, {
        backgroundColor,
        fetchRequestInit: { signal: controller.signal },
        height: EXPORT_HEIGHT,
        includeQueryParams: true,
        pixelRatio: EXPORT_PIXEL_RATIO,
        width: EXPORT_WIDTH,
      }),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(
            new Error(
              `The export did not finish within ${RENDER_TIMEOUT_MS / 1_000} seconds.`,
            ),
          );
        }, RENDER_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

export async function createExportDownload({
  backgroundColor,
  filenameStem,
  format,
  pdfMetadata,
  target,
}: CreateExportOptions): Promise<ExportDownload> {
  await waitForExportAssets(target);

  const canvas = await renderExportCanvas(target, backgroundColor);
  const pngBlob = await canvasToPngBlob(canvas);

  if (format === "png") {
    return {
      blob: pngBlob,
      filename: `${filenameStem}.png`,
    };
  }

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    compress: true,
    format: "a4",
    orientation: "portrait",
    unit: "mm",
  });

  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
  pdf.addImage(pngBytes, "PNG", 0, 0, 210, 297, undefined, "FAST");

  if (pdfMetadata) {
    pdf.setProperties(pdfMetadata);
  }

  return {
    blob: pdf.output("blob"),
    filename: `${filenameStem}.pdf`,
  };
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.download = filename;
  anchor.href = objectUrl;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  anchor.target = "_blank";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  return objectUrl;
}

export function scheduleObjectUrlRevocation(objectUrl: string) {
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, OBJECT_URL_REVOKE_DELAY_MS);
}
