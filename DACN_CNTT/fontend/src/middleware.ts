
import { auth } from "@/auth";
import { jwtDecode } from 'jwt-decode';
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
export const config = {
    matcher: [
        // '/((?!auth).*)(.+)|/verify', 
        // "/((?!api|_next/static|_next/image|favicon.ico|/|/auth).*)", 
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|auth|verify|$|product_detail/*).*)',
    ],
}

export async function middleware(req: NextRequest) {
    const session = await auth();
    const { pathname } = req.nextUrl;
    if (!session) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
        let decodedToken: { scope: string[] } = jwtDecode(session.user.access_token);
        const roles = (decodedToken?.scope || []).filter((role) => role !== null);

        // Phân quyền cho các route
        if (pathname.startsWith("/admin_dasboard") && !roles.includes("ADMIN_GLOBAL")) {
            return NextResponse.redirect(new URL("/403", req.url));
        }

        if (pathname.startsWith("/dashboard") && !roles.includes("MANAGER")) {
            return NextResponse.redirect(new URL("/403", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect('/auth/login');
    }
}