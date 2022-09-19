import cookie from "cookie";

export function set(response, authInfo) {
	response.headers.append("Set-Cookie", serialize(authInfo));
}

export function unset(response) {
	response.headers.append("Set-Cookie", removeCookieStr());
}

export function read(request) {
	return deserialize(request.headers.get("cookie"));
}

export function serialize(authInfo) {
	const cookieStr = cookie.serialize("auth_session", JSON.stringify(authInfo), {
		httpOnly: true,
		secure: import.meta.env.NODE_ENV === "production",
		expires: new Date(authInfo.expires_at),
	});
	return cookieStr;
}

export function deserialize(cookieStr) {
	try {
		const authInfoStr = cookie.parse(cookieStr)?.auth_session;
		const authInfo = authInfoStr ? JSON.parse(authInfoStr) : undefined;
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
