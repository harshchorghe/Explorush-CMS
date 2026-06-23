import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    let fileRef = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await sanityWriteClient.assets.upload("file", buffer, {
        filename: file.name,
        contentType: file.type || "application/pdf",
      });
      fileRef = {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };
    }

    const doc: any = {
      _type: "mediaKit",
      title,
    };

    if (fileRef) {
      doc.file = fileRef;
    } else {
      // If updating title only, fetch current doc first to preserve file
      try {
        const existing = await sanityWriteClient.getDocument("media-kit-singleton");
        if (existing && (existing as any).file) {
          doc.file = (existing as any).file;
        }
      } catch (e) {
        // No existing document
      }
    }

    const result = await sanityWriteClient.createOrReplace({
      _id: "media-kit-singleton",
      ...doc,
    });

    return NextResponse.json({
      success: true,
      mediaKit: result,
    });
  } catch (error: any) {
    console.error("Media Kit upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
