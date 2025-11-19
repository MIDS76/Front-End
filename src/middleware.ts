import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./app/actions/session";

const protectedRoutes = [
  "/",
  "/admin",
  "/aluno",
  "/chat",
  "/conselhoCoordenacao",
  "/criar",
  "/dashboard",
  "/gerenciamento",
  "/pedagogico",
  "/preConselhoForm"
];

export async function middleware(request: NextRequest) {
  const cookie = await verifySession();

  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)

  if (isProtectedRoute && !cookie.token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path*",
    "/admin/:path*",
    "/aluno/:path*",
    "/chat/:path*",
    "/conselhoCoordenacao/:path*",
    "/criar/:path*",
    "/dashboard/:path*",
    "/gerenciamento/:path*",
    "/pedagogico/:path*",
    "/preConselhoForm/:path*"
  ],
};