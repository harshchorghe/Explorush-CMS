import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload image to Sanity
    const asset = await sanityWriteClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      asset,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
