import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function GET() {
  try {
    const authors = await client.fetch(`
      *[_type == "author"] | order(name asc) {
        _id,
        name,
        bio,
        image {
          asset -> {
            _id,
            url
          }
        }
      }
    `);
    return NextResponse.json({ success: true, authors });
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
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const doc: any = {
      _type: "author",
      name: body.name,
      bio: body.bio || "",
    };

    if (body.imageAssetId) {
      doc.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: body.imageAssetId,
        },
      };
    }

    const author = await sanityWriteClient.create(doc);
    return NextResponse.json({ success: true, author });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
