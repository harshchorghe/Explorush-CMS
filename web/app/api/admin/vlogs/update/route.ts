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
      videoUrl: body.videoUrl || "",
    };

    if (body.thumbnailAssetId) {
      updateFields.thumbnail = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: body.thumbnailAssetId,
        },
      };
    }

    let patch = sanityWriteClient.patch(body.id).set(updateFields);

    if (body.thumbnailAssetId === null) {
      patch = patch.unset(["thumbnail"]);
    }

    const updatedVlog = await patch.commit();

    return NextResponse.json({
      success: true,
      updatedVlog,
    });
  } catch (error: any) {
    console.error("Vlog update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
