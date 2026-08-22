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
// Paint marked images directly onto the final canvas so Safari cannot omit
// them while rasterizing the intermediate SVG foreignObject.
const CANVAS_OVERLAY_SELECTOR =
  'img[data-export-canvas-overlay="circle-cover"]';

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
        filter: (node) =>
          !(
            node instanceof HTMLImageElement &&
            node.matches(CANVAS_OVERLAY_SELECTOR)
          ),
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

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceAspectRatio = image.naturalWidth / image.naturalHeight;
  const targetAspectRatio = width / height;
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  if (sourceAspectRatio > targetAspectRatio) {
    sourceWidth = image.naturalHeight * targetAspectRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else if (sourceAspectRatio < targetAspectRatio) {
    sourceHeight = image.naturalWidth / targetAspectRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function compositeExportCanvasOverlays(
  target: HTMLElement,
  canvas: HTMLCanvasElement,
) {
  const images = Array.from(
    target.querySelectorAll<HTMLImageElement>(CANVAS_OVERLAY_SELECTOR),
  );

  if (images.length === 0) {
    return;
  }

  const context = canvas.getContext("2d");
  const targetRect = target.getBoundingClientRect();

  if (!context || targetRect.width <= 0 || targetRect.height <= 0) {
    throw new Error("The browser could not finish the export portrait.");
  }

  const scaleX = canvas.width / targetRect.width;
  const scaleY = canvas.height / targetRect.height;

  for (const image of images) {
    const imageRect = image.getBoundingClientRect();
    const frame = image.parentElement;

    if (
      !frame ||
      image.naturalWidth <= 0 ||
      image.naturalHeight <= 0 ||
      imageRect.width <= 0 ||
      imageRect.height <= 0
    ) {
      throw new Error("The export portrait is not ready.");
    }

    const frameRect = frame.getBoundingClientRect();
    const frameStyle = window.getComputedStyle(frame);
    const borderLeft = parseFloat(frameStyle.borderLeftWidth) || 0;
    const borderRight = parseFloat(frameStyle.borderRightWidth) || 0;
    const borderTop = parseFloat(frameStyle.borderTopWidth) || 0;
    const borderBottom = parseFloat(frameStyle.borderBottomWidth) || 0;
    const width = (frameRect.width - borderLeft - borderRight) * scaleX;
    const height = (frameRect.height - borderTop - borderBottom) * scaleY;
    const x = (frameRect.left - targetRect.left + borderLeft) * scaleX;
    const y = (frameRect.top - targetRect.top + borderTop) * scaleY;

    if (width <= 0 || height <= 0) {
      throw new Error("The export portrait frame is not ready.");
    }

    context.save();
    try {
      context.beginPath();
      context.ellipse(
        x + width / 2,
        y + height / 2,
        width / 2,
        height / 2,
        0,
        0,
        Math.PI * 2,
      );
      context.clip();
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      drawImageCover(context, image, x, y, width, height);
    } finally {
      context.restore();
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
  compositeExportCanvasOverlays(target, canvas);
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
