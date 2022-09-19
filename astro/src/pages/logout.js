import * as authCookie from "$src/utils/auth-cookie.js";

export async function post({ request, params }) {
	const home = new URL("/", request.url);
	const response = Response.redirect(home, 302);
	authCookie.unset(response);
	return response;
}
