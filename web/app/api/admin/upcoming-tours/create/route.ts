import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const doc: any = {
      _type: "upcomingTour",
      title: body.title,
      slug: {
        _type: "slug",
        current: slug,
      },
      location: body.location || "",
      type: body.type || "trek",
      price: body.price || "",
      totalSlots: typeof body.totalSlots === "number" ? body.totalSlots : 0,
      bookedSlots: typeof body.bookedSlots === "number" ? body.bookedSlots : 0,
      description: body.description || "",
      guidelines: Array.isArray(body.guidelines) ? body.guidelines : [],
      included: Array.isArray(body.included) ? body.included : [],
      excluded: Array.isArray(body.excluded) ? body.excluded : [],
    };

    if (body.startDate) {
      doc.startDate = new Date(body.startDate).toISOString();
    }
    if (body.endDate) {
      doc.endDate = new Date(body.endDate).toISOString();
    }

    if (body.coverImageAssetId) {
      doc.coverImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: body.coverImageAssetId,
        },
      };
    }

    if (body.galleryAssetIds && Array.isArray(body.galleryAssetIds)) {
      doc.gallery = body.galleryAssetIds.map((id: string) => ({
        _type: "image",
        _key: Math.random().toString(36).substring(2, 9),
        asset: {
          _type: "reference",
          _ref: id,
        },
      }));
    }

    if (body.itinerary && Array.isArray(body.itinerary)) {
      doc.itinerary = body.itinerary.map((item: any) => ({
        _type: "object",
        _key: Math.random().toString(36).substring(2, 9),
        day: item.day || "",
        plan: item.plan || "",
      }));
    }

    if (body.authorId) {
      doc.author = {
        _type: "reference",
        _ref: body.authorId,
      };
    }

    const upcomingTour = await sanityWriteClient.create(doc);

    return NextResponse.json({
      success: true,
      upcomingTour,
    });
  } catch (error: any) {
    console.error("Upcoming tour create error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
