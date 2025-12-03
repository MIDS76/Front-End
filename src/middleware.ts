import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = [
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

const routePermissions = {
  admin: ["/admin", "/conselhoCoordenacao", "/criar", "/gerenciamento"],
  aluno: ["/aluno", "/preConselhoForm"],
  pedagogico: ["/pedagogico", "/conselhoCoordenacao", "/criar", "/gerenciamento"],
  weg: ["/weg"],
  supervisor: ["/supervisor"]
};

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  const path = request.nextUrl.pathname

  if (path.startsWith("/alterarSenha") || path.startsWith("/login")) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.includes(path)

  if (isProtectedRoute && !session?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
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