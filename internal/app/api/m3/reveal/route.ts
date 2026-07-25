import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTeamSession } from "@/lib/session";

function normalizeArg(arg: string) {
  return arg.replace(/[\s:.\-_]/g, "").toLowerCase();
}

export async function POST(req: NextRequest) {
  const teamId = await getTeamSession();
  if (!teamId) {
    return NextResponse.json({ success: false, error: "Not logged in." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const arg = typeof body.arg === "string" ? body.arg : "";

  const [progress, token] = await Promise.all([
    db.progress.findUnique({
      where: { teamId_milestone: { teamId, milestone: 3 } },
    }),
    db.clueToken.findUnique({
      where: { teamId_key: { teamId, key: "m3_console_arg" } },
    }),
  ]);

  if (!progress || !token) {
    return NextResponse.json({
      success: false,
      error: "The dashboard refuses to open without the earlier clock evidence.",
    });
  }

  if (normalizeArg(arg) !== normalizeArg(token.value)) {
    return NextResponse.json({
      success: false,
      error: `Time mismatch. "${arg}" is not the corrected report time.`,
    });
  }

  await db.clueToken.upsert({
    where: { teamId_key: { teamId, key: "m3_reveal_seen" } },
    update: { value: "true" },
    create: { teamId, key: "m3_reveal_seen", value: "true" },
  });

  return NextResponse.json({
    success: true,
    payload: [
      "DEAD-MAN'S SWITCH — ACTIVATED",
      "Authored by: Kai Đặng  |  Trigger: post-mortem",
      "",
      "If you're reading this, then it worked.",
      "I planned for what you are seeing. All of it.",
      "",
      "Ask THEIA. She knows what I could not say out loud.",
      "But do not trust her first answer.",
      "And do not trust the hour on my grave.",
      "",
      "codeword: ORACLE-EYES",
      "",
      "THE IMPOSSIBLE CLOCK:",
      "Last system login: 21:00",
      "Death reported: 23:47",
      "Gap: 166 minutes",
      "",
      "I logged out at 21:00. The report came at 23:47. Ask yourself what happened in between.",
    ].join("\n"),
  });
}
