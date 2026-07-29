# Bilingual Marriage Biodata

A single-page English and Marathi marriage biodata built with Next.js. The
active language can be downloaded as a high-resolution PNG or an A4 PDF.

## Update the biodata

- Edit Suraj Gavali's bilingual profile details in `src/app/biodata.ts`.
- Replace `public/profile-placeholder.png` with your own square portrait. Keep
  the same filename to update the website and both download formats
  automatically.
- Update the page title and description in `src/app/layout.tsx` if the profile
  name changes.

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown in the terminal.

## Deploy on Vercel

Import `SurajGavali/biodata` in Vercel. Vercel detects the Next.js framework and
uses `npm run build` automatically; no environment variables are required.

The visual direction is based on the supplied design template.
