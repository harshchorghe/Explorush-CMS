# Explorush

Explorush is split into two parts:

- `web/` is the Next.js app that should be deployed to Vercel.
- `studio/` is the Sanity Studio used to manage content.

## Local development

For the web app:

```bash
cd web
npm install
npm run dev
```

For the Sanity Studio:

```bash
cd studio
npm install
npm run dev
```

## Build

To verify the Vercel app locally:

```bash
cd web
npm run build
```

To build the studio:

```bash
cd studio
npm run build
```

## Vercel deployment

Deploy the `web/` folder as the Vercel project root. Make sure the following environment variables are set in Vercel:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

If you want image optimization to work for Sanity-hosted images, keep `cdn.sanity.io` allowed in `next.config.ts`.