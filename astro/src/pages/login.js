import { login } from "$src/utils/directus-client.js";
import * as authCookie from "$src/utils/auth-cookie.js";

export async function post({ request, params }) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	const authInfo = await login(data);
	// console.dir(authInfo, { depth: 5 });

	const home = new URL("/", request.url);
	const response = Response.redirect(home, 302);
	await authCookie.set(response, authInfo);

	return response;
}
