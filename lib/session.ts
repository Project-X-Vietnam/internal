import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "theia-team";
const FACILITATOR_COOKIE_NAME = "theia-facilitator";
const FACILITATOR_TTL_SECONDS = 60 * 60 * 12; // 12 hours

/**
 * Key used to sign the facilitator cookie. SESSION_SECRET is preferred; we fall
 * back to FACILITATOR_PIN so existing deployments keep working without a new env
 * var. Facilitator login already refuses to run when neither is set.
 */
function signingKey(): string | null {
  return process.env.SESSION_SECRET || process.env.FACILITATOR_PIN || null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/** Token shape: `<expiresAtMs>.<nonce>.<hmac>` */
function issueFacilitatorToken(key: string): string {
  const expiresAt = Date.now() + FACILITATOR_TTL_SECONDS * 1000;
  const payload = `${expiresAt}.${randomBytes(9).toString("base64url")}`;
  return `${payload}.${sign(payload, key)}`;
}

function verifyFacilitatorToken(token: string, key: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresAt, nonce, signature] = parts;
  const expected = sign(`${expiresAt}.${nonce}`, key);

  // timingSafeEqual throws on length mismatch, so guard before comparing.
  const provided = Buffer.from(signature);
  const control = Buffer.from(expected);
  if (provided.length !== control.length) return false;
  if (!timingSafeEqual(provided, control)) return false;

  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && expiry > Date.now();
}

export async function getTeamSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function setTeamSession(teamId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, teamId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function clearTeamSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getFacilitatorSession(): Promise<boolean> {
  const key = signingKey();
  if (!key) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(FACILITATOR_COOKIE_NAME)?.value;
  if (!token) return false;

  return verifyFacilitatorToken(token, key);
}

export async function setFacilitatorSession() {
  const key = signingKey();
  if (!key) throw new Error("FACILITATOR_PIN or SESSION_SECRET must be set.");

  const cookieStore = await cookies();
  cookieStore.set(FACILITATOR_COOKIE_NAME, issueFacilitatorToken(key), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: FACILITATOR_TTL_SECONDS,
    path: "/",
  });
}

export async function clearFacilitatorSession() {
  const cookieStore = await cookies();
  cookieStore.delete(FACILITATOR_COOKIE_NAME);
}
