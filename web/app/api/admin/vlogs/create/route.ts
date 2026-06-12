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
      _type: "vlog",
      title: body.title,
      slug: {
        _type: "slug",
        current: slug,
      },
      videoUrl: body.videoUrl || "",
    };

    if (body.thumbnailAssetId) {
      doc.thumbnail = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: body.thumbnailAssetId,
        },
      };
    }

    const vlog = await sanityWriteClient.create(doc);

    return NextResponse.json({
      success: true,
      vlog,
    });
  } catch (error: any) {
    console.error("Vlog create error:", error);
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
