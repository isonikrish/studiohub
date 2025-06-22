import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const id = await getToken();
  try {
    if (!id) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }
    if (user.role !== "PHOTOGRAPHER") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, price, duration } = body;
    if (!title || !description || !price || !duration) {
      return NextResponse.json(
        { msg: "Title, description, price and duration are required" },
        { status: 400 }
      );
    }
    await prisma.package.create({
      data: {
        title,
        description,
        price,
        duration,

        userId: user.id,
      },
    });
    return NextResponse.json(
      { msg: "Package created successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const packages = await prisma.package.findMany();
    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
