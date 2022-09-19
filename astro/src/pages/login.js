import { getDirectusDefaultClient } from "$src/utils/get-directus-client.js";
import cookie from "cookie";

export async function post({ request, params }) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	const directus = await getDirectusDefaultClient();
	// console.dir(directus, { depth: 5 });
	const authInfo = await directus.auth.login({
		email: data.email,
		password: data.password,
	});
	authInfo.expires_at = new Date().valueOf() + authInfo.expires;
	console.dir(authInfo, { depth: 5 });

	const cookieStr = cookie.serialize("auth_session", JSON.stringify(authInfo), {
		httpOnly: true,
		secure: import.meta.env.NODE_ENV === "production",
		expires: new Date(authInfo.expires_at),
	});

	const home = new URL("/", request.url);
	const response = Response.redirect(home, 302);
	response.headers.append("Set-Cookie", cookieStr);

	return response;
	// return new Response(JSON.stringify("Hola"), {
	// 	status: 200,
	// });
}
