# Repository Guidelines

## Project Structure & Module Organization
- Root contains the production entry: `landing.html`.
- `HTML_DRAFTS/` holds in‑progress pages and related assets (e.g., images). Keep draft‑specific assets alongside the draft; promote to shared `assets/` if reused.
- Use relative links between files. Example: `<a href="./HTML_DRAFTS/Pricing & Terms.html">Pricing</a>`.

## Build, Test, and Development
- Quick preview: open `landing.html` directly in a browser.
- Local server (preferred):
  - `python3 -m http.server 8000` (from repo root), then open `http://localhost:8000/landing.html`.
  - Optional: `npx serve -p 8000` if Node tools are available.
- Formatting (optional but recommended): `npx prettier --write "**/*.html"`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; wrap at ~120 chars when reasonable.
- Prefer semantic HTML (`header`, `main`, `section`, `footer`).
- Minimize inline styles; prefer reusable classes.
- Images: include descriptive `alt` text; optimize to reasonable size (<200KB when possible).
- Filenames: drafts may keep human‑readable names; final/public pages use kebab‑case (e.g., `pricing-and-terms.html`).

## Testing Guidelines
- Validate markup (W3C validator or `npx html-validate` if available).
- Manually verify in at least Chrome and Safari/Firefox.
- Check for broken links after serving locally. Example: `npx linkinator http://localhost:8000`.
- Accessibility/performance: run Lighthouse when feasible: `npx lighthouse http://localhost:8000/landing.html --view`.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`.
- Commits should be scoped and focused (one logical change).
- PRs include: summary of changes, affected files (e.g., `landing.html`, `HTML_DRAFTS/...`), before/after screenshots for visual updates, and any new asset paths.
- Link related issues/tasks and confirm local testing steps in the description.

## Agent-Specific Notes
- Scope: this AGENTS.md applies repo‑wide.
- Keep patches minimal and targeted; avoid unrelated reformatting.
- Add new work under `HTML_DRAFTS/`; do not rename/move existing files unless requested.
- Do not overwrite `landing.html` without explicit direction; propose changes via PR.
