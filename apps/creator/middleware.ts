import { PlanType, User } from "@repo/db";
import moment from "moment";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const publicRoutes = ["/auth", "/privacy-policy"];
  const { pathname } = req.nextUrl;
  const session = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  if (!session && !publicRoutes.includes(pathname)) {
    console.log("can't access public route");
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
  }
  if (session?.email && pathname !== "/checkout" && pathname === "/auth") {
    return NextResponse.redirect(new URL("/videos", req.nextUrl.origin));
  }
  const res = await fetch(
    `${process.env.CREATOR_BASE_URL}/api/user?email=${session?.email}`
  );

  const user: User = await res.json();

  if (!user) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
  }
  const isTrialExpired =
    user.plan === ("TRIAL" as PlanType) &&
    Number(user.trialEndAt) < moment().unix();

  if (
    isTrialExpired &&
    pathname !== "/trial-expired" &&
    pathname !== "/" &&
    pathname !== "/checkout"
  ) {
    return NextResponse.redirect(new URL("/trial-expired", req.nextUrl.origin));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
