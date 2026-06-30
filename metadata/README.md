# 🏷️ Website Meta Tags & SEO Documentation

This folder contains documentation and guidelines for the SEO (Search Engine Optimization) and social media sharing meta tags used in the **Explorush** portal.

---

## 🔍 Current Meta Tags Configuration

In the Next.js frontend, global metadata is defined in `web/app/layout.tsx` using the Next.js App Router metadata API:

```typescript
// Location: web/app/layout.tsx
export const metadata: Metadata = {
  title: "Explorush",
  description: "Founder: Harsh Chorghe",
};
```

When Next.js compiles the page, it automatically generates and inserts the following HTML meta tags in the `<head>` of the website:

| Meta Tag | Value / Output | Source | Description |
| :--- | :--- | :--- | :--- |
| `<title>` | `Explorush` | `metadata.title` | The title displayed in the browser tab and search engine results. |
| `<meta name="description">` | `Founder: Harsh Chorghe` | `metadata.description` | The page description shown in search engine results snippets. |
| `<meta name="viewport">` | `width=device-width, initial-scale=1` | Next.js Default | Ensures the website scales properly on mobile devices. |
| `<meta charset>` | `utf-8` | Next.js Default | Declares the character encoding for the HTML document. |

---

## 🚀 Recommended SEO & Social Meta Tags

To elevate **Explorush** to a premium, high-end travel logs portal, we should include Rich Social Media Sharing (Open Graph & Twitter Cards) and Search Engine indexing configurations.

Here are the recommended additions:

### 1. Open Graph (Facebook, WhatsApp, LinkedIn, Discord)
These tags control how your links look when shared on messaging platforms and social networks.
* **`og:title`**: Title of the shared card.
* **`og:description`**: Brief excerpt.
* **`og:image`**: A visually stunning image of a travel destination.
* **`og:url`**: The canonical link of the shared page.
* **`og:type`**: `website` or `article`.

### 2. Twitter Cards
Specifically customizes links shared on X/Twitter.
* **`twitter:card`**: Set to `summary_large_image` for big, engaging preview pictures.
* **`twitter:title`**: Preview title.
* **`twitter:description`**: Preview description.
* **`twitter:image`**: Image link.

### 3. Canonical URLs
Prevents duplicate content search engine issues.
* **`canonical`**: Points to the definitive version of the web page.

---

## 🛠️ Implementation Blueprint (Next.js App Router)

Here is how we can implement these recommended tags statically (globally) and dynamically (for specific trips/blogs).

### A. Updating Global Metadata (Layout)

We can enhance the global `web/app/layout.tsx` metadata config like this:

```typescript
// web/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://explorush.vercel.app"), // Replace with your production domain
  title: {
    default: "Explorush | Interactive Travel Logs & CMS Portal",
    template: "%s | Explorush",
  },
  description: "Discover premium travel journals, interactive map footprints, blogs, and upcoming group tours guided by Harsh Chorghe.",
  keywords: ["travel blogs", "group tours", "interactive travel maps", "Explorush", "Harsh Chorghe"],
  authors: [{ name: "Harsh Chorghe" }],
  creator: "Harsh Chorghe",
  openGraph: {
    title: "Explorush | Interactive Travel Logs & CMS Portal",
    description: "Discover premium travel journals, interactive map footprints, blogs, and upcoming group tours.",
    url: "https://explorush.vercel.app",
    siteName: "Explorush",
    images: [
      {
        url: "/about_me.jpg", // Default preview image
        width: 1200,
        height: 630,
        alt: "Explorush - Premium Travel Journal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explorush | Interactive Travel Logs & CMS Portal",
    description: "Discover premium travel journals, interactive map footprints, blogs, and upcoming group tours.",
    images: ["/about_me.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### B. Dynamic Metadata for Trips & Blogs (Pages)

For pages like trip details (`web/app/trips/[slug]/page.tsx`) or blog details (`web/app/blogs/[slug]/page.tsx`), Next.js supports dynamic meta tags via `generateMetadata`. This will pull details directly from the Sanity CMS database:

#### Example: Trip Detail Page SEO (`web/app/trips/[slug]/page.tsx`)

```typescript
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  // Fetch only the meta fields needed
  const trip = await client.fetch(
    `*[_type == "trip" && slug.current == $slug][0]{
      title,
      description,
      coverImage{ asset->{url} }
    }`,
    { slug }
  );

  if (!trip) return {};

  const imageUrl = trip.coverImage?.asset?.url || "/about_me.jpg";

  return {
    title: trip.title,
    description: trip.description || "Explore this amazing trip on Explorush!",
    openGraph: {
      title: `${trip.title} | Explorush Trips`,
      description: trip.description || "Explore this amazing trip on Explorush!",
      type: "article",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${trip.title} | Explorush Trips`,
      description: trip.description || "Explore this amazing trip on Explorush!",
      images: [imageUrl],
    },
  };
}
```

---

## 🎨 Verifying Your Meta Tags

To confirm that your meta tags are outputting correctly:
1. **Local check**: Inspect the HTML source code when running the app locally (`npm run dev`) by pressing `Ctrl + U` in the browser or viewing the `<head>` in Chrome/Firefox DevTools.
2. **Social sharing check**: Use online debuggers once your site is deployed:
   * [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   * [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   * [Metatags.io](https://metatags.io/) (excellent preview simulator)
