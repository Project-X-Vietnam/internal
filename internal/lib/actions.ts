"use server";

import { db } from "@/lib/db";
import {
  getFacilitatorSession,
  getTeamSession,
  setFacilitatorSession,
  setTeamSession,
} from "@/lib/session";
import { getUnlockedCaseBriefChapters } from "@/lib/case-brief";
import { M4_CLUE_TOKENS, clueMap, validateMilestoneSubmission } from "@/lib/clues";
import { redirect } from "next/navigation";

// --- Auth ---

export async function loginTeam(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const code = (formData.get("code") as string)?.trim();

  if (!name || !code) {
    return { error: "Team name and join code are required." };
  }

  const team = await db.team.findUnique({ where: { name } });

  if (!team || team.joinCode !== code) {
    return { error: "Invalid team name or join code." };
  }

  await setTeamSession(team.id);

  if (!team.startedAt) {
    await db.team.update({
      where: { id: team.id },
      data: { startedAt: new Date(), currentMilestone: 1 },
    });
    redirect("/prologue");
  }

  redirect("/hub");
}

// --- Team data ---

export async function getTeamWithProgress() {
  const teamId = await getTeamSession();
  if (!teamId) return null;

  return db.team.findUnique({
    where: { id: teamId },
    include: {
      progress: { orderBy: { milestone: "asc" } },
      clueTokens: true,
    },
  });
}

export async function getTeamClues() {
  const teamId = await getTeamSession();
  if (!teamId) return null;

  const tokens = await db.clueToken.findMany({
    where: { teamId },
    orderBy: { earnedAt: "asc" },
  });

  return tokens.map((token) => ({ key: token.key, value: token.value }));
}

export async function hasTeamClue(key: string, value?: string): Promise<boolean> {
  const teamId = await getTeamSession();
  if (!teamId) return false;

  const token = await db.clueToken.findUnique({
    where: { teamId_key: { teamId, key } },
  });

  if (!token) return false;
  return value ? token.value === value : true;
}

// --- Milestone gating ---

export async function canAccessMilestone(milestone: number): Promise<boolean> {
  const teamId = await getTeamSession();
  if (!teamId) return false;

  const team = await db.team.findUnique({
    where: { id: teamId },
    include: { progress: true },
  });

  if (!team) return false;
  if (milestone === 1) return team.currentMilestone >= 1;

  const prev = team.progress.find((p) => p.milestone === milestone - 1);
  return !!prev?.solvedAt;
}

// --- Submissions ---

export async function submitAnswer(milestone: number, payload: string) {
  const teamId = await getTeamSession();
  if (!teamId) return { error: "Not logged in." };

  const allowed = await canAccessMilestone(milestone);
  if (!allowed) return { error: "Milestone locked." };

  const existingTokens = await db.clueToken.findMany({
    where: { teamId },
    select: { key: true, value: true },
  });
  const validation = validateMilestoneSubmission(
    milestone,
    payload,
    clueMap(existingTokens)
  );
  const correct = validation.correct;

  await db.submission.create({
    data: { teamId, milestone, payload, correct },
  });

  if (!correct) {
    return {
      correct: false,
      message: validation.message ?? "That's not right. Try again.",
    };
  }

  const nextMilestone = Math.min(milestone + 1, 5);
  await db.$transaction(async (tx) => {
    await tx.progress.upsert({
      where: { teamId_milestone: { teamId, milestone } },
      update: { solvedAt: new Date() },
      create: { teamId, milestone, solvedAt: new Date() },
    });

    for (const token of validation.tokens ?? []) {
      await tx.clueToken.upsert({
        where: { teamId_key: { teamId, key: token.key } },
        update: { value: token.value },
        create: { teamId, key: token.key, value: token.value },
      });
    }

    if (milestone < 5) {
      await tx.team.update({
        where: { id: teamId },
        data: { currentMilestone: nextMilestone },
      });
      await tx.progress.upsert({
        where: { teamId_milestone: { teamId, milestone: nextMilestone } },
        update: {},
        create: { teamId, milestone: nextMilestone },
      });
    } else {
      await tx.team.update({
        where: { id: teamId },
        data: { currentMilestone: 5, finishedAt: new Date() },
      });
    }
  });

  const [solvedMilestones, updatedTokens] = await Promise.all([
    db.progress.findMany({
      where: { teamId, solvedAt: { not: null } },
      select: { milestone: true },
    }),
    db.clueToken.findMany({
      where: { teamId },
      select: { key: true, value: true },
    }),
  ]);

  return {
    correct: true,
    caseBriefChapters: getUnlockedCaseBriefChapters(
      solvedMilestones.map((progress) => progress.milestone),
      updatedTokens
    ),
  };
}

// --- Clue tokens ---

export async function saveClueToken(key: string, value: string) {
  const teamId = await getTeamSession();
  if (!teamId) return;

  await db.clueToken.upsert({
    where: { teamId_key: { teamId, key } },
    update: { value },
    create: { teamId, key, value },
  });
}

// --- Facilitator ---

export async function loginFacilitator(formData: FormData) {
  const pin = (formData.get("pin") as string)?.trim();
  const expectedPin = process.env.FACILITATOR_PIN;

  if (!expectedPin) {
    redirect("/facilitator?error=missing-config");
  }

  if (!pin || pin !== expectedPin) {
    redirect("/facilitator?error=invalid-pin");
  }

  await setFacilitatorSession();
  redirect("/facilitator");
}

export async function isFacilitatorAuthed() {
  return getFacilitatorSession();
}

export async function facilitatorUnlockM4(teamId: string) {
  const facilitatorAuthed = await getFacilitatorSession();
  if (!facilitatorAuthed) {
    throw new Error("Facilitator authorization required.");
  }

  await db.$transaction(async (tx) => {
    await tx.progress.upsert({
      where: { teamId_milestone: { teamId, milestone: 4 } },
      update: { solvedAt: new Date() },
      create: { teamId, milestone: 4, solvedAt: new Date() },
    });

    for (const token of M4_CLUE_TOKENS) {
      await tx.clueToken.upsert({
        where: { teamId_key: { teamId, key: token.key } },
        update: { value: token.value },
        create: { teamId, key: token.key, value: token.value },
      });
    }

    await tx.team.update({
      where: { id: teamId },
      data: { currentMilestone: 5 },
    });

    await tx.progress.upsert({
      where: { teamId_milestone: { teamId, milestone: 5 } },
      update: {},
      create: { teamId, milestone: 5 },
    });
  });
}

export async function getAllTeamsProgress() {
  const facilitatorAuthed = await getFacilitatorSession();
  if (!facilitatorAuthed) {
    return [];
  }

  return db.team.findMany({
    include: {
      progress: { orderBy: { milestone: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });
}
