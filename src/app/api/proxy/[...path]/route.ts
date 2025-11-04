import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	request.headers.set("x-forwarded-host", request.headers.get("host") || "");
}

export async function GET(req: NextRequest) {
	return handleProxy(req);
}

export async function POST(req: NextRequest) {
	return handleProxy(req);
}

export async function PUT(req: NextRequest) {
	return handleProxy(req);
}

export async function DELETE(req: NextRequest) {
	return handleProxy(req);
}

async function handleProxy(req: NextRequest) {
	const targetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`;

	const body =
		req.method !== "GET" && req.method !== "HEAD"
			? await req.text()
			: undefined;

	// Forward the request to your backend
	const backendResponse = await fetch(targetUrl, {
		method: req.method,
		headers: {
			"Content-Type": "application/json",
			cookie: req.headers.get("cookie") || "",
		},
		body,
		credentials: "include",
		cache: "no-store",
		next: { revalidate: 0 },
	});

	// Clone backend response
	const data = await backendResponse.text();

	// Build the new response
	const response = new NextResponse(data, {
		status: backendResponse.status,
		headers: backendResponse.headers,
	});
	// Pass along any Set-Cookie headers (important!)
	const setCookie = backendResponse.headers.get("set-cookie");
	if (setCookie) {
		response.headers.set("set-cookie", setCookie);
	}

	return response;
}
