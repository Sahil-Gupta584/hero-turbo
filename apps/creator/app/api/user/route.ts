import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email) throw new Error("email is required");
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("user not found");
    return NextResponse.json(user);
  } catch (error) {
    console.log("error in /api/user:", error);
    return NextResponse.json({ ok: false, error });
  }
}
