import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const id = await getToken();
  try {
    if (!id) return NextResponse.json({ msg: "Unauthorized" }, { status: 400 });
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { bookingId } = body;
    if (!bookingId) {
      return NextResponse.json(
        { msg: "Booking ID is required" },
        { status: 400 }
      );
    }
    const bookingExists = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        package: true,
      },
    });

    if (!bookingExists) {
      return NextResponse.json({ msg: "Booking not found" }, { status: 404 });
    }
    if (user.role !== "PHOTOGRAPHER") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });
    }
    if (user.id !== bookingExists.package.userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });
    }
    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
      },
    });
    return NextResponse.json({ msg: "Booking canceled" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
