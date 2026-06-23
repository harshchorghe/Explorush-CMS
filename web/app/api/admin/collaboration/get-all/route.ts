import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  try {
    const fetchOpts = { cache: "no-store" as const };
    const collaborations = await client.fetch(
      `*[_type == "collaboration"] | order(_createdAt desc) {
        _id,
        name,
        company,
        email,
        phone,
        collabType,
        budget,
        details,
        links,
        status,
        _createdAt
      }`,
      {},
      fetchOpts
    );

    return NextResponse.json({
      success: true,
      collaborations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
