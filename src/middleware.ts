import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_PATHS } from "./lib/constants";

// Public routes that don't require authentication
function isPublicPath(pathname: string) {
	// allow next internals and static folder
	if (pathname.startsWith("/_next") || pathname.startsWith("/static"))
		return true;

	// allow direct requests for common static asset extensions
	if (pathname.match(/\.(png|jpe?g|svg|gif|webp|avif|ico|bmp|ttf|woff2?)$/i))
		return true;

	return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
	const { nextUrl } = req;
	const { pathname } = nextUrl;

	// Allow public paths and API routes
	if (isPublicPath(pathname) || pathname.startsWith("/api")) {
		return NextResponse.next();
	}

	// For JWT, we can't check auth on server-side middleware
	// Token is in localStorage, only accessible on client
	// The Protected component will handle redirects on client-side

	// However, we can check for role-based routing if you store role in a cookie
	// This is optional - you could remove this if you handle all auth on client
	const userRole = req.cookies.get("userRole");
	console.log(userRole);

	if (pathname.startsWith("/admin") && userRole !== "admin") {
		const homeUrl = new URL("/", req.url);
		return NextResponse.redirect(homeUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
