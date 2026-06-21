import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.title) {
      return NextResponse.json(
        { success: false, error: "ID and Title are required" },
        { status: 400 }
      );
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const updateFields: any = {
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
      updateFields.startDate = new Date(body.startDate).toISOString();
    } else {
      updateFields.startDate = null;
    }

    if (body.endDate) {
      updateFields.endDate = new Date(body.endDate).toISOString();
    } else {
      updateFields.endDate = null;
    }

    if (body.coverImageAssetId) {
      updateFields.coverImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: body.coverImageAssetId,
        },
      };
    }

    if (body.galleryAssetIds && Array.isArray(body.galleryAssetIds)) {
      updateFields.gallery = body.galleryAssetIds.map((id: string) => ({
        _type: "image",
        _key: Math.random().toString(36).substring(2, 9),
        asset: {
          _type: "reference",
          _ref: id,
        },
      }));
    }

    if (body.itinerary && Array.isArray(body.itinerary)) {
      updateFields.itinerary = body.itinerary.map((item: any) => ({
        _type: "object",
        _key: item._key || Math.random().toString(36).substring(2, 9),
        day: item.day || "",
        plan: item.plan || "",
      }));
    }

    if (body.authorId) {
      updateFields.author = {
        _type: "reference",
        _ref: body.authorId,
      };
    } else {
      updateFields.author = null;
    }

    let patch = sanityWriteClient.patch(body.id).set(updateFields);

    const unsets = [];
    if (body.coverImageAssetId === null) unsets.push("coverImage");
    if (
      body.galleryAssetIds === null ||
      (Array.isArray(body.galleryAssetIds) && body.galleryAssetIds.length === 0)
    ) {
      unsets.push("gallery");
    }
    if (
      body.itinerary === null ||
      (Array.isArray(body.itinerary) && body.itinerary.length === 0)
    ) {
      unsets.push("itinerary");
    }
    if (!body.authorId) {
      unsets.push("author");
    }
    if (!body.startDate) {
      unsets.push("startDate");
    }
    if (!body.endDate) {
      unsets.push("endDate");
    }

    if (unsets.length > 0) {
      patch = patch.unset(unsets);
    }

    const updatedTour = await patch.commit();

    return NextResponse.json({
      success: true,
      updatedTour,
    });
  } catch (error: any) {
    console.error("Upcoming tour update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
