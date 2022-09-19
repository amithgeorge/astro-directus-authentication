import { Directus } from "@directus/sdk";

export const getDirectusAdminClient = async () => {
	const directus = new Directus(import.meta.env.PUBLIC_DIRECTUS_URL);

	if (directus.auth.token) return directus;

	if (import.meta.env.DIRECTUS_EMAIL && import.meta.env.DIRECTUS_PASSWORD) {
		const authInfo = await directus.auth.login({
			email: import.meta.env.DIRECTUS_EMAIL,
			password: import.meta.env.DIRECTUS_PASSWORD,
		});
		// console.log("authinfo");
		// console.dir(authInfo, { depth: 5 });
	} else if (import.meta.env.DIRECTUS_STATIC_TOKEN) {
		await directus.auth.static(import.meta.env.DIRECTUS_STATIC_TOKEN);
	}

	return directus;
};

export async function getDirectusDefaultClient() {
	const directus = new Directus(import.meta.env.PUBLIC_DIRECTUS_URL);
	return directus;
}
