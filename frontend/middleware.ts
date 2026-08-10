import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Not logged in and hitting a protected route -> send to login
  if (!token && !isPublicPath && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in and hitting login/register -> send to dashboard
  if (token && isPublicPath) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
