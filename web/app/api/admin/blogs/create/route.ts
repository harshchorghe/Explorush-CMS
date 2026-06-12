import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const doc: any = {
      _type: "blog",
      title: body.title,
      slug: {
        _type: "slug",
        current: slug,
      },
      content: body.content,
    };

    if (body.coverImageAssetId) {
      doc.coverImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: body.coverImageAssetId,
        },
      };
    }

    if (body.authorId) {
      doc.author = {
        _type: "reference",
        _ref: body.authorId,
      };
    }

    if (body.categoryId) {
      doc.category = {
        _type: "reference",
        _ref: body.categoryId,
      };
    }

    const blog = await sanityWriteClient.create(doc);

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error("Blog create error:", error);
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
