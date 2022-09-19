import {
	getDirectusUserClient,
	getStoredAuthInfo,
	isAuthTokenRefreshed,
} from "$src/utils/directus-client.js";
import * as authCookie from "$src/utils/auth-cookie.js";

export async function currentDirectusUser(request, response) {
	// 1. parse the request cookie header to read our the stored authInfo
	// 2. use it to query the Directus for the current user info. This acts as the "authentication".
	//		if the Directus server returns a 4XX error, then the authInfo is no longer valid and we should reset the cookie
	// 3. if the user is authenticated, then check whether their auth token has been auto refreshed. if yes,
	//		then persist the new authInfo in the cookie.

	const authInfo = authCookie.read(request);
	if (!authInfo) {
		return {};
	}

	try {
		const directus = await getDirectusUserClient(authInfo);
		const currentUser = await directus.users.me.read();

		const isRefreshed = await isAuthTokenRefreshed(directus, authInfo);
		if (isRefreshed) {
			console.log("token refreshed.");
			await authCookie.set(response, getStoredAuthInfo(directus));
		}

		return {
			currentUser: currentUser,
			directusClient: directus,
		};
	} catch (err) {
		console.error(err);
		if ([400, 401, 403].includes(err?.response?.status)) {
			console.log("Invalid credentials. Removing the cookie.");
			authCookie.unset(response);
		}

		return {};
	}
}
