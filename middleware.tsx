import { NextResponse } from "next/server";

export function middleware(req: any) {
  const token = req.cookies.get("refresh_token")?.value;

  const protectedRoutes = ["/dashboard", "/admin", "/profile"];

  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
