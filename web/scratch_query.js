const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: "rmcbvfwf",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function run() {
  try {
    const docCount = await client.fetch(`count(*)`);
    console.log("Total Document Count:", docCount);

    const assetData = await client.fetch(`*[_type in ["sanity.imageAsset", "sanity.fileAsset"]]{
      _type,
      size
    }`);
    console.log(`Found ${assetData.length} assets`);
    
    let totalSize = 0;
    assetData.forEach(asset => {
      if (asset.size) totalSize += asset.size;
    });
    console.log(`Total asset storage size: ${totalSize} bytes (${(totalSize / (1024 * 1024)).toFixed(2)} MB)`);
    
    // Let's count specific doc types
    const types = await client.fetch(`*[]{_type}`);
    const counts = {};
    types.forEach(d => {
      counts[d._type] = (counts[d._type] || 0) + 1;
    });
    console.log("Document counts by type:", counts);

  } catch (error) {
    console.error("Sanity query failed:", error);
  }
}

run();
