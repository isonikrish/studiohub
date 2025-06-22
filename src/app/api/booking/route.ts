import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
    const { packageId, scheduledAt, description } = body;

    if (!packageId || !scheduledAt) {
      return NextResponse.json(
        { msg: "Package ID and scheduled date are required" },
        { status: 400 }
      );
    }
    const packageExists = await prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });
    if (!packageExists) {
      return NextResponse.json({ msg: "Package not found" }, { status: 404 });
    }
    if (user.role !== "PHOTOGRAPHER") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });
    }

    await prisma.booking.create({
      data: {
        packageId,
        scheduledAt: new Date(scheduledAt),
        description: description || "",
        status: "PENDING",
        clientId: user.id,
      },
    });
    return NextResponse.json(
      { msg: "Booking created successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request){
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
        const { bookingId, status } = body;
        if (!bookingId || !status) {
            return NextResponse.json(
                { msg: "Booking ID and status are required" },
                { status: 400 }
            );
        }
        const bookingExists = await prisma.booking.findUnique({
            where: {
                id: bookingId,
            },
            include: {
                package: true,
            }
        });

        if (!bookingExists) {
            return NextResponse.json({ msg: "Booking not found" }, { status: 404 });
        }
        if (user.role !== "PHOTOGRAPHER") {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });
        }
        if(user.id !== bookingExists.package.userId){
            return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });
        }
        await prisma.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                status: status,
            },
        });
        return NextResponse.json(
            { msg: "Booking updated successfully" },
            { status: 200 }
        );


    } catch (error) {
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
        
    }
}