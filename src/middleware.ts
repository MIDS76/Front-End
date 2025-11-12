import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("isLoggedIn");

  if (!isLoggedIn || isLoggedIn.value !== "true") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|alterarSenha|api/public|_next/static|_next/image|favicon.ico).*)",
  ],
};

