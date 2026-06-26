import { NextResponse } from "next/server";
import { getProjectHealthAndUsage } from "@/lib/healthService";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { headers } = req;
    const host = headers.get("host") || undefined;
    const referer = headers.get("referer") || undefined;

    const data = await getProjectHealthAndUsage({ host, referer });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[HEALTH & USAGE API ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch health and usage metrics",
      },
      { status: 500 }
    );
  }
}
