import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suraj Gavali | Insta Style Biodata",
  description:
    "Suraj Gavali's creative bilingual marriage biodata, presented as a modern social profile.",
  alternates: {
    canonical: "/instastyle",
  },
  openGraph: {
    title: "Suraj Gavali | Insta Style Biodata",
    description:
      "Age, height, career, family and contact details in a creative English and Marathi profile.",
    images: [
      {
        alt: "Suraj Gavali Insta Style marriage biodata profile",
        url: "/instastyle-og.png",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suraj Gavali | Insta Style Biodata",
    description:
      "A creative bilingual marriage biodata profile in English and Marathi.",
    images: ["/instastyle-og.png"],
  },
};

export default function InstaStyleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
