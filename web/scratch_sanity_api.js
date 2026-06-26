const projectId = "rmcbvfwf";
const token = "skzRKBmEeQMBWFknEEtTUTsXS4NrD3qsYrIJMMSxFDGppLZwpDGNtp6hrj91KaOtffvJYNiIme2e9F0lD99vVFYi87PzOjw8iqgay0SsvsGdd2KuOIzEvc22wBvYVkJ8jUfkrPsQEWu49fcGL7FAHtmJDht2VtiJbM14kWNSFWZbOf7PbrG8";

async function test() {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const endpoints = [
    `projects/${projectId}/usage`,
    `projects/${projectId}/billing`,
    `projects/${projectId}/metrics`,
    `projects/${projectId}/statistics`,
    `projects/${projectId}/limits`
  ];

  for (const endpoint of endpoints) {
    const url = `https://api.sanity.io/v2021-06-07/${endpoint}`;
    console.log(`\nFetching: ${url}`);
    try {
      const res = await fetch(url, { headers });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log("Success! Data keys:", Object.keys(data));
        console.log("Sample:", JSON.stringify(data, null, 2).substring(0, 1000));
      } else {
        const text = await res.text();
        console.log("Error response:", text.substring(0, 200));
      }
    } catch (e) {
      console.error("Fetch failed:", e);
    }
  }
}

test();
