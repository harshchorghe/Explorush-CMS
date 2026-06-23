import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  try {
    const fetchOpts = { cache: "no-store" as const };
    const mediaKit = await client.fetch(
      `*[_type == "mediaKit" && _id == "media-kit-singleton"][0] {
        _id,
        title,
        "fileUrl": file.asset->url,
        "fileName": file.asset->originalFilename
      }`,
      {},
      fetchOpts
    );

    return NextResponse.json({
      success: true,
      mediaKit: mediaKit || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
