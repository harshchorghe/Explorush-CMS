import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const trip = await sanityWriteClient.create({
      _type: "trip",

      title: body.title,

      slug: {
        _type: "slug",
        current: body.title
          .toLowerCase()
          .replace(/\s+/g, "-"),
      },

      location: body.location,

      description: body.description,

      type: body.type,
    });

    return NextResponse.json({
      success: true,
      trip,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}