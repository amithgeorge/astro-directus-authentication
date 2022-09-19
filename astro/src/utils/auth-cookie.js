import cookie from "cookie";
import { encrypt, decrypt } from "$src/utils/encryption.js";

export async function set(response, authInfo) {
	response.headers.append("Set-Cookie", await serialize(authInfo));
}

export function unset(response) {
	response.headers.append("Set-Cookie", removeCookieStr());
}

export function read(request) {
	return deserialize(request.headers.get("cookie"));
}

export async function serialize(authInfo) {
	const encrypted = await encrypt(JSON.stringify(authInfo));
	const cookieStr = cookie.serialize("auth_session", encrypted.dataStr, {
		httpOnly: true,
		secure: import.meta.env.NODE_ENV === "production",
		expires: new Date(authInfo.expires_at),
	});
	return cookieStr;
}

export function deserialize(cookieStr) {
	try {
		const authInfoStr = cookie.parse(cookieStr)?.auth_session;
		const authInfo = authInfoStr ? JSON.parse(decrypt(authInfoStr)) : undefined;
		return authInfo;
	} catch (err) {
		console.error(err);
		return undefined;
	}
}

export function removeCookieStr() {
	return cookie.serialize("auth_session", "", {
		maxAge: -1,
	});
}
