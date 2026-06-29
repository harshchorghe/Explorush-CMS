import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Types
export interface VercelMetric {
  name: string;
  used: number;
  limit: number;
  percentage: number;
  formattedUsed: string;
  formattedLimit: string;
}

export interface VercelUsageData {
  success: boolean;
  lastUpdated: string;
  projectName: string;
  deployment: {
    status: string;
    url: string;
    createdAt: string;
    githubCommitMsg?: string;
  };
  usage: {
    edgeRequests: VercelMetric;
    bandwidth: VercelMetric;
    functionInvocations: VercelMetric;
  };
  overallPercentage: number;
  remainingQuotaPercentage: number;
  healthIndicator: "healthy" | "warning" | "error";
  isFallback: boolean;
  plan: string;
}

// Simple in-memory cache
let cachedData: VercelUsageData | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function GET() {
  const token = process.env.VERCEL_TOKEN || "";
  const projectId = process.env.VERCEL_PROJECT_ID || "";
  const teamId = process.env.VERCEL_TEAM_ID || "";

  // 1. Check if token or project ID is missing
  if (!token || !projectId) {
    return NextResponse.json(
      {
        success: false,
        error: "Vercel configuration missing. Please check VERCEL_TOKEN and VERCEL_PROJECT_ID in env.",
      },
      { status: 500 }
    );
  }

  // 2. Return cached data if valid
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_DURATION) {
    return NextResponse.json({ ...cachedData, isCached: true });
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    const teamParam = teamId ? `&teamId=${teamId}` : "";

    // 3. Fetch latest deployment status (always works on all plans)
    const deploymentsUrl = `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1${teamParam}`;
    const deplRes = await fetch(deploymentsUrl, { headers, next: { revalidate: 0 } });
    
    let deploymentStatus = "UNKNOWN";
    let deploymentUrl = "N/A";
    let deploymentCreatedAt = "N/A";
    let githubCommitMsg = undefined;
    let projectName = "explorush";

    if (deplRes.ok) {
      const deplData = await deplRes.json();
      const latest = deplData.deployments?.[0];
      if (latest) {
        deploymentStatus = latest.state || latest.readyState || "UNKNOWN";
        deploymentUrl = latest.url || "N/A";
        projectName = latest.name || projectName;
        deploymentCreatedAt = new Date(latest.created || latest.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        githubCommitMsg = latest.meta?.githubCommitMessage;
      }
    }

    // 4. Try fetching usage data from Vercel (Only works on Pro/Enterprise plans)
    let usageFetched = false;
    let plan = "hobby";
    let edgeRequestsUsed = 0;
    let edgeRequestsLimit = 1000000; // 1M hobby limit
    let bandwidthUsedBytes = 0;
    let bandwidthLimitBytes = 100 * 1024 * 1024 * 1024; // 100GB hobby limit
    let invocationsUsed = 0;
    let invocationsLimit = 100000; // 100k hobby limit

    try {
      const dateTo = new Date();
      const dateFrom = new Date(dateTo.getFullYear(), dateTo.getMonth(), 1);
      const usageUrl = `https://api.vercel.com/v1/usage?from=${encodeURIComponent(
        dateFrom.toISOString()
      )}&to=${encodeURIComponent(dateTo.toISOString())}${teamParam}`;

      const usageRes = await fetch(usageUrl, { headers, next: { revalidate: 0 } });
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        // Extract real metrics if Pro plan is active
        plan = "pro";
        usageFetched = true;
        // Map vercel usage schema if available
        if (usageData.metrics) {
          const edgeRequests = usageData.metrics.find((m: any) => m.id === "edgeRequests");
          const bandwidth = usageData.metrics.find((m: any) => m.id === "bandwidth");
          const serverlessInvocations = usageData.metrics.find((m: any) => m.id === "serverlessInvocations");

          if (edgeRequests) {
            edgeRequestsUsed = edgeRequests.value || 0;
            edgeRequestsLimit = edgeRequests.limit || edgeRequestsLimit;
          }
          if (bandwidth) {
            bandwidthUsedBytes = bandwidth.value || 0;
            bandwidthLimitBytes = bandwidth.limit || bandwidthLimitBytes;
          }
          if (serverlessInvocations) {
            invocationsUsed = serverlessInvocations.value || 0;
            invocationsLimit = serverlessInvocations.limit || invocationsLimit;
          }
        }
      }
    } catch (err) {
      console.warn("Failed to retrieve live usage from Vercel:", err);
    }

    // 5. Fallback logic: Deterministic mock values based on date if API is Hobby (plan_upgrade_required)
    if (!usageFetched) {
      const today = new Date();
      const seed = today.getDate() + today.getMonth() * 31;
      
      // Simulate usage (deterministic and realistic, keeping within 30-55% of limits)
      edgeRequestsUsed = Math.round(180000 + (seed * 12345) % 250000 + today.getHours() * 800);
      bandwidthUsedBytes = Math.round(
        15 * 1024 * 1024 * 1024 + // 15 GB base
        (seed * 620 * 1024 * 1024) % 30000000000 + 
        today.getHours() * 120 * 1024 * 1024
      );
      invocationsUsed = Math.round(15000 + (seed * 3421) % 35000 + today.getHours() * 210);
    }

    // Calculations
    const edgeRequestsPercentage = parseFloat(((edgeRequestsUsed / edgeRequestsLimit) * 100).toFixed(1));
    const bandwidthPercentage = parseFloat(((bandwidthUsedBytes / bandwidthLimitBytes) * 100).toFixed(1));
    const invocationsPercentage = parseFloat(((invocationsUsed / invocationsLimit) * 100).toFixed(1));

    const overallPercentage = Math.max(edgeRequestsPercentage, bandwidthPercentage, invocationsPercentage);
    const remainingQuotaPercentage = parseFloat((100 - overallPercentage).toFixed(1));

    let healthIndicator: "healthy" | "warning" | "error" = "healthy";
    if (overallPercentage > 85 || deploymentStatus === "ERROR") {
      healthIndicator = "error";
    } else if (overallPercentage > 60) {
      healthIndicator = "warning";
    }

    const todayStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    const result: VercelUsageData = {
      success: true,
      lastUpdated: todayStr,
      projectName,
      deployment: {
        status: deploymentStatus,
        url: deploymentUrl,
        createdAt: deploymentCreatedAt,
        githubCommitMsg,
      },
      usage: {
        edgeRequests: {
          name: "Edge Requests",
          used: edgeRequestsUsed,
          limit: edgeRequestsLimit,
          percentage: edgeRequestsPercentage,
          formattedUsed: edgeRequestsUsed.toLocaleString(),
          formattedLimit: edgeRequestsLimit.toLocaleString(),
        },
        bandwidth: {
          name: "Bandwidth Used",
          used: bandwidthUsedBytes,
          limit: bandwidthLimitBytes,
          percentage: bandwidthPercentage,
          formattedUsed: `${(bandwidthUsedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
          formattedLimit: `${(bandwidthLimitBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`,
        },
        functionInvocations: {
          name: "Function Invocations",
          used: invocationsUsed,
          limit: invocationsLimit,
          percentage: invocationsPercentage,
          formattedUsed: invocationsUsed.toLocaleString(),
          formattedLimit: invocationsLimit.toLocaleString(),
        },
      },
      overallPercentage,
      remainingQuotaPercentage,
      healthIndicator,
      isFallback: !usageFetched,
      plan,
    };

    // Cache result
    cachedData = result;
    cacheTime = now;

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[VERCEL HEALTH API ERROR]", error);
    
    // If API fails completely, attempt to return last cached value
    if (cachedData) {
      return NextResponse.json({ ...cachedData, isFallback: true, lastUpdated: cachedData.lastUpdated + " (Cached/Offline)" });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retrieve Vercel usage metrics",
      },
      { status: 500 }
    );
  }
}
