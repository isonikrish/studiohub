import { generateTokenAndSetCookie } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { msg: "Email and password are required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json(
        { msg: "Invalid email or password" },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { msg: "Invalid email or password" },
        { status: 400 }
      );
    }
    const response = NextResponse.json(
      {
        msg: "Login successful",
      },
      { status: 200 }
    );
    const res = generateTokenAndSetCookie(user?.id, response);
    return res;
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
