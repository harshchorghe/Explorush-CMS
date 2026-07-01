import { createClient } from "@sanity/client";

if (!process.env.SANITY_API_TOKEN) {
  console.warn("⚠️ WARNING: SANITY_API_TOKEN is not defined in environment variables! Admin write/delete operations will fail.");
}

export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});