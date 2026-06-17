import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

// Force dynamic — never cache this API route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const trips = await client.fetch(`
      *[_type == "trip"] | order(_createdAt desc){
        _id,
        title,
        location,
        type,
        slug,
        startDate,
        endDate,
        coverImage {
          asset -> {
            _id,
            url
          }
        },
        _createdAt
      }
    `);

    return NextResponse.json({
      success: true,
      trips,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}