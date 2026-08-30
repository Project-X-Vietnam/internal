# CLAUDE.md

Alias of [AGENTS.md](./AGENTS.md). Read that file — it is the authoritative guide for this repo.

## 30-second orientation

- **This is the PJX internal team platform** (members only). Public-facing work goes in the separate `landing-page` repo.
- **Intended purpose:** team repo & directory, knowledge & resource hub, artifacts. Not an ERP or CRM.
- **What's actually built today:** only THEIA, an AI treasure-hunt bonding game. It's an *Artifact*, not the platform. Don't extend it to host new features.
- **The app is nested one level down** — work in `internal/`, not the repo root.

```bash
cd internal && pnpm dev        # or: pnpm --dir internal dev
cd internal && pnpm typecheck  # the build does not typecheck for you
```

## Two hard rules

1. **Never read, quote, or summarize the THEIA spoiler files** — `ANSWER_KEY.md`, `PJX_AI_Treasure_Hunt_THEIA_Plot.md`, `MILESTONES.md`, `STORY_PLOT.md` (all under `internal/`). They hold the game's solutions. `BRIEF.md` is the safe one — use it for structure.
2. **Run `git status` before every commit.** `node_modules/` was once committed to `main`; if thousands of files appear, stop and fix `.gitignore`. See `PATCH_NOTES.md`.
