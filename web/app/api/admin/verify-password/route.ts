import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Secure server-side comparison
    if (password === "Harsh@1136") {
      const response = NextResponse.json({
        success: true,
        message: "Authenticated successfully",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Incorrect password" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
