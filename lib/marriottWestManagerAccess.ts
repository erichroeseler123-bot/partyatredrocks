import { createHash, createHmac, timingSafeEqual } from "crypto";

export const MARRIOTT_WEST_MANAGER_SESSION_COOKIE = "parr_marriott_west_manager_session";
const SESSION_VERSION = "v1";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function marriottWestManagerAccessKey() {
  return process.env.MARRIOTT_WEST_MANAGER_ACCESS_KEY?.trim() || "";
}

function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function isMarriottWestManagerAccessConfigured() {
  return Boolean(marriottWestManagerAccessKey());
}

export function isValidMarriottWestManagerAccessKey(input: string | null | undefined) {
  const expected = marriottWestManagerAccessKey();
  return Boolean(expected) && input === expected;
}

function sessionSigningSecret() {
  const key = marriottWestManagerAccessKey();
  return key ? sha256(key) : "";
}

function signParts(version: string, expiresAt: string, nonce: string, secret: string) {
  if (!secret) return "";
  return createHmac("sha256", secret).update(`${version}.${expiresAt}.${nonce}`).digest("hex");
}

export function buildMarriottWestManagerSessionValue() {
  const secret = sessionSigningSecret();
  if (!secret) return "";
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = String(now + SESSION_TTL_SECONDS);
  const nonce = sha256(`${Date.now()}-${Math.random()}`).slice(0, 24);
  const sig = signParts(SESSION_VERSION, expiresAt, nonce, secret);
  return `${SESSION_VERSION}.${expiresAt}.${nonce}.${sig}`;
}

export function adminSessionMaxAgeSeconds() {
  return SESSION_TTL_SECONDS;
}

export function isValidMarriottWestManagerSession(value: string | null | undefined) {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 4) return false;

  const [version, expiresAtRaw, nonce, signature] = parts;
  if (version !== SESSION_VERSION) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt)) return false;
  if (expiresAt <= Math.floor(Date.now() / 1000)) return false;

  const expected = signParts(version, expiresAtRaw, nonce, sessionSigningSecret());
  if (!expected || expected.length !== signature.length) return false;

  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function getMarriottWestManagerActorLabel(value: string | null | undefined) {
  if (!isValidMarriottWestManagerSession(value)) return "unknown-marriott-west-manager";
  const nonce = String(value).split(".")[2] || "manager";
  return `marriott-west-manager:${nonce.slice(0, 8)}`;
}
