import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

// Force dynamic — never cache this API route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blogs = await client.fetch(`
      *[_type == "blog"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        content,
        _createdAt,
        coverImage {
          asset -> {
            _id,
            url
          }
        },
        author -> {
          _id,
          name
        },
        category -> {
          _id,
          title
        }
      }
    `);

    return NextResponse.json({
      success: true,
      blogs,
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
