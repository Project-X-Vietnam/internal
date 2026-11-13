import { NextRequest, NextResponse } from "next/server";
import { M5_CIPHERTEXT_B64 } from "@/lib/cipher";
import { db } from "@/lib/db";
import { getTeamSession } from "@/lib/session";
import {
  clueMap,
  clueTokensForSolvedMilestones,
  hasM5Prerequisites,
  scoreM5PasswordSlots,
  validateM5Password,
} from "@/lib/clues";

export async function POST(req: NextRequest) {
  const teamId = await getTeamSession();
  if (!teamId) {
    return NextResponse.json({ success: false, error: "Not logged in." }, { status: 401 });
  }

  const { password, slots } = await req.json();

  if (!password || typeof password !== "string") {
    return NextResponse.json({ success: false });
  }

  const solvedProgress = await db.progress.findMany({
    where: { teamId, solvedAt: { not: null }, milestone: { in: [1, 2, 3, 4] } },
    select: { milestone: true },
  });

  const backfillTokens = clueTokensForSolvedMilestones(
    solvedProgress.map((progress) => progress.milestone)
  );

  for (const token of backfillTokens) {
    await db.clueToken.upsert({
      where: { teamId_key: { teamId, key: token.key } },
      update: { value: token.value },
      create: { teamId, key: token.key, value: token.value },
    });
  }

  const tokens = await db.clueToken.findMany({
    where: { teamId },
    select: { key: true, value: true },
  });
  const clues = clueMap(tokens);

  if (!hasM5Prerequisites(clues)) {
    return NextResponse.json({
      success: false,
      error: "The vault rejects incomplete evidence. Clear M1-M4 first.",
    });
  }

  const slotScore = scoreM5PasswordSlots(slots);

  if (!validateM5Password(password, clues)) {
    return NextResponse.json({
      success: false,
      slotScore,
      error:
        slotScore.valuesCorrect === slotScore.total &&
        slotScore.transformsCorrect === slotScore.total
          ? "All fragments look right. Check the separator and assembly order."
          : "Access denied. The vault remains sealed.",
    });
  }

  return NextResponse.json({
    success: true,
    slotScore,
    ciphertextB64: M5_CIPHERTEXT_B64,
  });
}
