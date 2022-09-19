import cookie from "cookie";

export async function post({ request, params }) {
	const removeCookieStr = cookie.serialize("auth_session", "", {
		maxAge: -1,
	});

	const home = new URL("/", request.url);
	const response = Response.redirect(home, 302);
	response.headers.append("Set-Cookie", removeCookieStr);
	return response;
}
