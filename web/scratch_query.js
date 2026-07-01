const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: "rmcbvfwf",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function run() {
  try {
    const referencingDoc = await client.fetch(`*[_id == "5AsM6udhZPSCTKAikSqHtE"][0]`);
    console.log("Referencing Document:", JSON.stringify(referencingDoc, null, 2));

    const referencedDoc = await client.fetch(`*[_id == "c7EiKTPmNzN3JJJW9tKFlr"][0]`);
    console.log("\nReferenced Document:", JSON.stringify(referencedDoc, null, 2));

  } catch (error) {
    console.error("Sanity query failed:", error);
  }
}

run();
