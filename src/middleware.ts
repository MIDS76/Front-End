import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


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


export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = request.cookies.get('session')?.value;


  if (path === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  if (path.startsWith("/alterarSenha") || path.startsWith("/login")) {
     return NextResponse.next();
  }


  const isProtected = protectedRoutes.some((route) => path.startsWith(route));


  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
