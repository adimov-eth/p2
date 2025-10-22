# Repository Guidelines

## Project Structure & Module Organization
- The production site lives in `site/` (Eleventy). Shared data sits in `site/_data/site.json`; layouts and macros reside under `site/_includes/`.
- Pages are grouped by audience: public marketing in `site/pages/`, pricing and incentives in `site/pricing/`, member collateral in `site/member/`, internal dashboards in `site/internal/`, and legal docs in `site/legal/`. Assets belong in `site/assets/`.
- Update navigation by editing `site/_data/navigation.json`; hero art variants live in `site/_includes/components/heroArt.njk`.

## Build, Test, and Development Commands
- Install once per clone: `cd site && npm install`.
- Local preview: `npm run serve` (hot reload on http://localhost:8080/).
- Production build: `npm run build` (outputs to `site/_site/`).
- Quality gates: `npm run test:links` (linkinator) and `npm run test:html` (html-validate). Run both before pushing.
- Format everything with `npm run format` (repo Prettier config).

## Coding Style & Naming Conventions
- Follow Prettier defaults (2-space indent, trailing commas where valid). Do not hand-format files already touched by Prettier.
- Use Eleventy data bindings (`{{ site.membership.priceTHB }}`) instead of hard-coded values. Keep front matter minimal and prefer `_data` for shared facts.
- Class naming follows Tailwind utility conventions; add custom utilities only if reused across sections.
- When editing macros, add concise comments only for non-obvious logic.

## Testing Guidelines
- Always run the Eleventy build plus both QA scripts. Investigate and fix link or HTML warnings immediately.
- Spot-check the premium hero theme across pages (white vs blue variants) in desktop and mobile breakpoints.
- For significant UI tweaks, capture before/after screenshots to attach in PR discussions.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, etc.) scoped to a single concern. Run tests and formatter before committing.
- PR descriptions must include: summary, key file touchpoints, command log (`npm run build`, QA scripts), and screenshots whenever layout changes.
- Reference relevant issues (e.g., tracking completion of HTML draft parity) and note any follow-up tasks discovered during work.

## Configuration Tips
- Plausible analytics domain is controlled via `site/_data/site.json`. Update or disable before deploying to another host.
- Keep secrets out of the repo; environment-specific overrides go through deployment configuration, not checked-in files.
