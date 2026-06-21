const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: "rmcbvfwf",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function run() {
  try {
    const data = await client.fetch(`*[_type == "trip"]{
      _id,
      title,
      location,
      latitude,
      longitude
    }`);
    console.log("ALL TRIP DOCUMENTS IN SANITY:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Sanity query failed:", error);
  }
}

run();
