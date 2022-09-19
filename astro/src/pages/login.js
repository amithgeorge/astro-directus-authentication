import { getDirectusDefaultClient } from "$src/utils/get-directus-client.js";

export async function post({ request, params }) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	const directus = await getDirectusDefaultClient();
	// console.dir(directus, { depth: 5 });
	const authInfo = await directus.auth.login({
		email: data.email,
		password: data.password,
	});
	// console.dir(authInfo, { depth: 5 });

	// const home = new URL("/", request.url);
	// const response = Response.redirect(url, 302);
	// response.headers.append("Set-Cookie" )

	return new Response(JSON.stringify("Hola"), {
		status: 200,
	});
}
