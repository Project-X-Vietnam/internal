# Salvage Log (NON-deps only)

Base comparison: origin/dev..HEAD

Files changed (excluding node_modules and build output):
- .gitignore
- components.json
- internal/app/globals.css
- internal/app/page.tsx
- internal/components.json
- internal/components/ui/button.tsx
- internal/components/ui/cards-1.tsx
- internal/components/ui/grid-pattern.tsx
- internal/components/ui/progressive-carousel.tsx
- internal/components/ui/release-time-line.tsx
- internal/components/ui/timeline-component.tsx
- internal/components/ui/typewriter-text.tsx
- internal/lib/utils.ts
- internal/package-lock.json
- internal/package.json
- internal/pnpm-lock.yaml
- internal/postcss.config.mjs
- internal/public/assets/liam-lee.jpg
- internal/public/assets/pjx1.jpg
- internal/public/assets/pjx2.jpg
- internal/public/assets/pjx3.jpg
- internal/public/assets/pjx4.jpg
- internal/public/assets/pjx5.jpg
- internal/public/assets/pjx6.jpg
- internal/public/assets/pjx7.jpg
- internal/tailwind.config.ts
- internal/tsconfig.json
- package-lock.json
- package.json
- postcss.config.js
- tailwind.config.js

Rules:
- Never commit node_modules or build artifacts
- Reapply changes using changes_non_deps.patch
