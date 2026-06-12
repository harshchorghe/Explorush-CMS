import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: "ID, Title, and Content are required" },
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
      content: body.content,
    };

    if (body.coverImageAssetId) {
      updateFields.coverImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: body.coverImageAssetId,
        },
      };
    } else if (body.coverImageAssetId === null) {
      // User explicitly removed the image
      updateFields.coverImage = null;
    }

    if (body.authorId) {
      updateFields.author = {
        _type: "reference",
        _ref: body.authorId,
      };
    } else if (body.authorId === null) {
      updateFields.author = null;
    }

    if (body.categoryId) {
      updateFields.category = {
        _type: "reference",
        _ref: body.categoryId,
      };
    } else if (body.categoryId === null) {
      updateFields.category = null;
    }

    // Set fields and unset any null ones
    let patch = sanityWriteClient.patch(body.id).set(updateFields);
    
    // Check for explicit unsets (sanity patch allows unset of fields)
    const unsets = [];
    if (body.coverImageAssetId === null) unsets.push("coverImage");
    if (body.authorId === null) unsets.push("author");
    if (body.categoryId === null) unsets.push("category");
    
    if (unsets.length > 0) {
      patch = patch.unset(unsets);
    }

    const updatedBlog = await patch.commit();

    return NextResponse.json({
      success: true,
      updatedBlog,
    });
  } catch (error: any) {
    console.error("Blog update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
