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
      _type: "trip",
      title: body.title,
      slug: {
        _type: "slug",
        current: slug,
      },
      location: body.location || "",
      description: body.description || "",
      type: body.type || "trek",
      budget: body.budget || "",
    };

    if (body.latitude !== undefined && body.latitude !== null && body.latitude !== "") {
      doc.latitude = parseFloat(body.latitude);
    }
    if (body.longitude !== undefined && body.longitude !== null && body.longitude !== "") {
      doc.longitude = parseFloat(body.longitude);
    }

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

    const trip = await sanityWriteClient.create(doc);

    return NextResponse.json({
      success: true,
      trip,
    });
  } catch (error: any) {
    console.error("Trip create error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}