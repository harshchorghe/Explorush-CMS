import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, name, email, phone, parentPhone, address } = body;

    // Validation
    if (!tourId || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required booking details (Name, Email, Phone)" },
        { status: 400 }
      );
    }

    // Check slots availability
    const tour = await client.fetch(
      `*[_type == "upcomingTour" && _id == $tourId][0] {
        _id,
        title,
        totalSlots,
        bookedSlots
      }`,
      { tourId },
      { cache: "no-store" }
    );

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Selected tour / event could not be found" },
        { status: 404 }
      );
    }

    const total = tour.totalSlots || 0;
    const booked = tour.bookedSlots || 0;

    if (total > 0 && booked >= total) {
      return NextResponse.json(
        { success: false, error: "Sorry, this tour/event has already been fully booked!" },
        { status: 400 }
      );
    }

    // Create the booking entry
    const bookingDoc = {
      _type: "booking",
      name,
      email,
      phone,
      parentPhone: parentPhone || "",
      address: address || "",
      tour: {
        _type: "reference",
        _ref: tourId,
      },
    };

    const bookingResult = await sanityWriteClient.create(bookingDoc);

    // Increment bookedSlots in the tour document
    const updatedTour = await sanityWriteClient
      .patch(tourId)
      .inc({ bookedSlots: 1 })
      .commit();

    const slotsLeft = (updatedTour.totalSlots || 0) - (updatedTour.bookedSlots || 0);

    return NextResponse.json({
      success: true,
      bookingId: bookingResult._id,
      updatedBookedSlots: updatedTour.bookedSlots,
      slotsLeft,
    });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
