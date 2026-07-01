import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    // 1. Query for all bookings referencing this tour ID
    const referencingBookings = await sanityWriteClient.fetch<Array<{ _id: string }>>(
      `*[_type == "booking" && tour._ref == $id]`,
      { id }
    );

    // 2. Unset the 'tour' reference in these bookings so they don't block deletion
    if (referencingBookings.length > 0) {
      const transaction = sanityWriteClient.transaction();
      referencingBookings.forEach((booking) => {
        transaction.patch(booking._id, (p) => p.unset(["tour"]));
      });
      await transaction.commit();
    }

    // 3. Now delete the upcoming tour safely
    await sanityWriteClient.delete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Upcoming tour delete error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || error,
    });
  }
}
