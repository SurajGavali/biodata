import type { Metadata } from "next";
import "@fontsource/darker-grotesque/400.css";
import "@fontsource/darker-grotesque/500.css";
import "@fontsource/darker-grotesque/600.css";
import "@fontsource/darker-grotesque/700.css";
import "@fontsource/darker-grotesque/800.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/500.css";
import "@fontsource/noto-sans-devanagari/600.css";
import "@fontsource/noto-sans-devanagari/700.css";
import "./globals.css";

const deploymentUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(
    deploymentUrl.startsWith("localhost")
      ? `http://${deploymentUrl}`
      : `https://${deploymentUrl}`,
  ),
  title: "Aarav Deshmukh | Marriage Biodata",
  description:
    "A bilingual English and Marathi marriage biodata with PDF and PNG downloads.",
  applicationName: "Marriage Biodata",
  keywords: [
    "marriage biodata",
    "Marathi biodata",
    "विवाह परिचयपत्र",
    "bilingual biodata",
  ],
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    description:
      "A polished bilingual English and Marathi marriage biodata with PDF and PNG downloads.",
    images: [
      {
        alt: "Aarav Deshmukh bilingual marriage biodata",
        height: 630,
        url: "/og.png",
        width: 1200,
      },
    ],
    title: "Aarav Deshmukh | Marriage Biodata",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    description: "Bilingual marriage biodata in English and Marathi.",
    images: ["/og.png"],
    title: "Aarav Deshmukh | Marriage Biodata",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
