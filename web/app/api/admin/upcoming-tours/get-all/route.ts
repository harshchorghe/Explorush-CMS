import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upcomingTours = await client.fetch(`
      *[_type == "upcomingTour"] | order(startDate asc) {
        _id,
        title,
        location,
        type,
        price,
        totalSlots,
        bookedSlots,
        startDate,
        endDate,
        slug,
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
        _createdAt
      }
    `);

    return NextResponse.json({
      success: true,
      upcomingTours,
    });
  } catch (error: any) {
    console.error("Get all upcoming tours error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || error,
    });
  }
}
