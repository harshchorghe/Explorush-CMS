import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function GET() {
  try {
    const categories = await client.fetch(`
      *[_type == "category"] | order(title asc) {
        _id,
        title,
        slug
      }
    `);
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}

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

    const category = await sanityWriteClient.create({
      _type: "category",
      title: body.title,
      slug: {
        _type: "slug",
        current: slug,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
