import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  try {
    const vlogs = await client.fetch(`
      *[_type == "vlog"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        videoUrl,
        _createdAt,
        thumbnail {
          asset -> {
            _id,
            url
          }
        }
      }
    `);

    return NextResponse.json({
      success: true,
      vlogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
