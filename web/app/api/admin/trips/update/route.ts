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
      description: body.description || "",
      type: body.type || "trek",
      budget: body.budget || "",
    };

    if (body.latitude !== undefined && body.latitude !== null && body.latitude !== "") {
      updateFields.latitude = parseFloat(body.latitude);
    }
    if (body.longitude !== undefined && body.longitude !== null && body.longitude !== "") {
      updateFields.longitude = parseFloat(body.longitude);
    }

    if (body.startDate) {
      updateFields.startDate = new Date(body.startDate).toISOString();
    }
    if (body.endDate) {
      updateFields.endDate = new Date(body.endDate).toISOString();
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

    if (unsets.length > 0) {
      patch = patch.unset(unsets);
    }

    const updatedTrip = await patch.commit();

    return NextResponse.json({
      success: true,
      updatedTrip,
    });
  } catch (error: any) {
    console.error("Trip update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}