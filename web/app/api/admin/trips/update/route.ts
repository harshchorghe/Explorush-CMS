import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updatedTrip = await sanityWriteClient
      .patch(body.id)
      .set({
        title: body.title,
        location: body.location,
        description: body.description,
        type: body.type,
      })
      .commit();

    return NextResponse.json({
      success: true,
      updatedTrip,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}