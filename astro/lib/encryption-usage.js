import { encrypt, decrypt } from "../src/utils/encryption.js";

const authInfo = {
	access_token:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxN2Q0ZjZhLTI2NjktNDZmYi1hYjA2LTA3ZTJkZWEyZTg1NCIsInJvbGUiOm51bGwsImFwcF9hY2Nlc3MiOm51bGwsImFkbWluX2FjY2VzcyI6bnVsbCwiaWF0IjoxNjYzNTk1MDc5LCJleHAiOjE2NjM1OTU5NzksImlzcyI6ImRpcmVjdHVzIn0.Da6vIsFR0odAypuEtXjwodQLa3qb2emPxg6FagnGD8Q",
	refresh_token:
		"IAW8o9l4x9KM8wpqdE1g6-poDuIN3bgf0LSvafllOED4we7Qmjqj2hlxYoF1EZh6",
	expires: 900000,
	expires_at: 1663595979659,
};
const message = JSON.stringify(authInfo);

try {
	const encryptionResult = await encrypt(message);
	const decryptedMessage = await decrypt(encryptionResult.dataStr);

	console.assert(
		decryptedMessage === message,
		"Decrypted data doesn't match original data"
	);
} catch (err) {
	console.error(err);
}
