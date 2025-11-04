import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Build full target URL
	const targetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${(
		req.query.path as string[]
	)?.join("/")}`;

	// Forward the request to your backend
	const response = await fetch(targetUrl, {
		method: req.method,
		headers: {
			"Content-Type": "application/json",
			cookie: req.headers.cookie || "",
		},
		body:
			req.method !== "GET" && req.method !== "HEAD"
				? JSON.stringify(req.body)
				: undefined,
		credentials: "include",
	});

	// Copy cookies from backend response
	const setCookie = response.headers.get("set-cookie");
	if (setCookie) {
		res.setHeader("set-cookie", setCookie);
	}

	// Copy backend response body
	const data = await response.text();

	// Copy status code and send response back
	res.status(response.status).send(data);
}
