import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await sanityWriteClient.delete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || error,
    });
  }
}
