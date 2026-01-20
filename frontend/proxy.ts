import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPages = ["/", "/signin", "/signup"];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token");
    const { pathname } = request.nextUrl;

    // Déjà connecté et va sur signin/signup → redirige vers dashboard
    if (token && (pathname === "/signin" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Page publique → on laisse passer
    if (publicPages.includes(pathname)) {
        return NextResponse.next();
    }

    // Page protégée sans token → redirection vers signin
    if (!token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};