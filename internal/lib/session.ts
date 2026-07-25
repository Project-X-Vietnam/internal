import { cookies } from "next/headers";

const COOKIE_NAME = "theia-team";
const FACILITATOR_COOKIE_NAME = "theia-facilitator";

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
  const cookieStore = await cookies();
  return cookieStore.get(FACILITATOR_COOKIE_NAME)?.value === "authorized";
}

export async function setFacilitatorSession() {
  const cookieStore = await cookies();
  cookieStore.set(FACILITATOR_COOKIE_NAME, "authorized", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function clearFacilitatorSession() {
  const cookieStore = await cookies();
  cookieStore.delete(FACILITATOR_COOKIE_NAME);
}
