import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_PATHS } from "./lib/constants";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";

// Name of the session cookie set by the server (express-session default)
const SESSION_COOKIE_NAME = "connect.sid";

// Public routes that don't require authentication

function isPublicPath(pathname: string) {
	// allow next internals and static folder
	// if (pathname == "/") return false;
	if (pathname.startsWith("/_next") || pathname.startsWith("/static"))
		return true;

	// allow direct requests for common static asset extensions (images, fonts, etc.)
	if (pathname.match(/\.(png|jpe?g|svg|gif|webp|avif|ico|bmp|ttf|woff2?)$/i))
		return true;

	return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
	const { nextUrl, cookies: reqCookies } = req;
	const { pathname } = nextUrl;
	const userRole = await getCookie("userRole", { cookies });

	// allow public paths
	if (isPublicPath(pathname) || pathname.startsWith("/api"))
		return NextResponse.next();
	const hasSession = reqCookies.get(SESSION_COOKIE_NAME);
	if (!hasSession) {
		const loginUrl = new URL("/login", req.url);
		return NextResponse.redirect(loginUrl);
	}

	if (pathname.startsWith("/admin") && userRole !== "admin") {
		const homeUrl = new URL("/", req.url);
		return NextResponse.redirect(homeUrl);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
