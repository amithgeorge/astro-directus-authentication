import { promisify } from "node:util";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";

const randomBytes = promisify(crypto.randomBytes);

const algorithm = "aes-256-gcm";
// > crypto.getCipherInfo("aes-256-gcm");
// {
//   mode: 'gcm',
//   name: 'id-aes256-gcm',
//   nid: 901,
//   blockSize: 1,
//   ivLength: 12,
//   keyLength: 32
// }

const saltForSecretKey =
	"f4b4ecb96c844fbc7653639f4c9c5bf4bd4b94a94d15a6492149741fffb0c94f";
let secretKeyBuffer;

function getSecretKeyBuffer() {
	// console.dir(import.meta.env, { depth: 5 });
	if (!secretKeyBuffer) {
		secretKeyBuffer = crypto.scryptSync(
			import.meta.env.AUTH_COOKIE_SECRET_KEY ||
				process.env.AUTH_COOKIE_SECRET_KEY,
			saltForSecretKey,
			32 // keyLength for aes-256-gcm is 32 bytes
		);
	}

	return secretKeyBuffer;
}

export async function encrypt(message) {
	const iv = await randomBytes(12); // ivLength for aes-256-gcm is 12 bytes
	const cipher = crypto.createCipheriv(algorithm, getSecretKeyBuffer(), iv, {
		authTagLength: 16,
	});
	cipher.setAAD(iv);
	const initialBuffer = cipher.update(message, "utf-8");
	const finalBuffer = cipher.final();
	const encryptedBuffer = Buffer.concat([initialBuffer, finalBuffer]);
	const authTagBuffer = cipher.getAuthTag();

	// console.log("initial: ", initialBuffer.toString("base64"));
	// console.log("final: ", finalBuffer.toString("base64"));
	// console.log("encrypted: ", encryptedBuffer.toString("base64"));
	// console.log("authTag: ", authTagBuffer.toString("base64"));
	// console.log("iv:", iv.toString("base64"));

	const data = {
		encrypted: encryptedBuffer.toString("base64"),
		iv: iv.toString("base64"),
		authTag: authTagBuffer.toString("base64"),
	};

	return { data, dataStr: `${data.iv}_${data.authTag}_${data.encrypted}` };
}

export function decrypt(dataStr) {
	const [iv, authTag, encrypted] = dataStr.split("_");
	const encryptedBuffer = Buffer.from(encrypted, "base64");
	const authTagBuffer = Buffer.from(authTag, "base64");
	const ivBuffer = Buffer.from(iv, "base64");
	const decipher = crypto.createDecipheriv(
		algorithm,
		getSecretKeyBuffer(),
		ivBuffer,
		{
			authTagLength: 16,
		}
	);
	decipher.setAAD(ivBuffer);
	decipher.setAuthTag(authTagBuffer);
	const initialBuffer = decipher.update(encryptedBuffer);
	const finalBuffer = decipher.final();
	const decryptedBuffer = Buffer.concat([initialBuffer, finalBuffer]);

	// console.log("initial: ", initialBuffer.toString("base64"));
	// console.log("final: ", finalBuffer.toString("base64"));
	// console.log("decrypted: ", decryptedBuffer.toString("utf-8"));

	return decryptedBuffer.toString("utf-8");
}
