import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const id = await getToken();
  try {
    if (!id) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const packages = await prisma.package.findMany({
      where: {
        userId: id,
      },
      include: {
        bookings: {
          include: {
            client: true,
          },
        },
      },
    });

    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
