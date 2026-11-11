import crypto from "node:crypto";

export type VaultEnvelopeV1 = {
  v: 1;
  alg: "aes-256-gcm";
  iv: string;
  tag: string;
  ct: string;
};

export function isVaultEncryptionConfigured(): boolean {
  return Boolean(
    process.env.PARR_SECRET?.trim() || process.env.BLOB_READ_WRITE_TOKEN?.trim(),
  );
}

function deriveVaultKey(): Buffer {
  const secret =
    process.env.PARR_SECRET ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    "parr-local-dev";
  return crypto
    .createHash("sha256")
    .update("parr-vault-v1:" + secret)
    .digest();
}

export function previewBlobPrefix(): string {
  return process.env.VERCEL_ENV === "preview" ? "preview/" : "";
}

export function vaultBlobPath(purpose: string, ext: string): string {
  const key = deriveVaultKey();
  const hmac24 = crypto
    .createHmac("sha256", key)
    .update("path:" + purpose)
    .digest("hex")
    .slice(0, 24);
  const cleanExt = ext.replace(/^\.+/, "");
  return `${previewBlobPrefix()}cache/orders/${purpose}-${hmac24}.${cleanExt}`;
}

export function encryptVaultText(plaintext: string): string {
  const key = deriveVaultKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const envelope: VaultEnvelopeV1 = {
    v: 1,
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ct: encrypted.toString("base64"),
  };
  return JSON.stringify(envelope);
}

export function decryptVaultText(raw: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return raw;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return raw;
  }

  const record = parsed as Record<string, unknown>;
  const looksLikeEnvelope =
    "iv" in record && "tag" in record && "ct" in record && ("v" in record || "alg" in record);

  if (!looksLikeEnvelope) {
    return raw;
  }

  if (
    record.v !== 1 ||
    record.alg !== "aes-256-gcm" ||
    typeof record.iv !== "string" ||
    typeof record.tag !== "string" ||
    typeof record.ct !== "string"
  ) {
    throw new Error("Unsupported or malformed vault envelope");
  }

  const ivBuf = Buffer.from(record.iv, "base64");
  const tagBuf = Buffer.from(record.tag, "base64");
  const ctBuf = Buffer.from(record.ct, "base64");

  if (ivBuf.length !== 12 || ivBuf.toString("base64") !== record.iv) {
    throw new Error("Invalid vault IV");
  }
  if (tagBuf.length !== 16 || tagBuf.toString("base64") !== record.tag) {
    throw new Error("Invalid vault auth tag");
  }
  if (ctBuf.toString("base64") !== record.ct) {
    throw new Error("Invalid vault ciphertext");
  }

  const key = deriveVaultKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, ivBuf, {
    authTagLength: 16,
  });
  decipher.setAuthTag(tagBuf);
  const decrypted = Buffer.concat([decipher.update(ctBuf), decipher.final()]);
  return decrypted.toString("utf8");
}

export function buildSquarePaymentIdempotencyKey(
  kind: string,
  internalOrderId: string,
  sourceId: string,
  amountCents: number,
): string {
  return crypto
    .createHash("sha256")
    .update(`parr-sq:${kind}:${internalOrderId}:${sourceId}:${amountCents}`)
    .digest("hex")
    .slice(0, 44);
}
