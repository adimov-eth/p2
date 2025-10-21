# Prime Corporate Golf Club – Eleventy Site

This repository contains the Eleventy build for Prime Corporate Golf Club marketing and internal enablement pages.

## Local development

```bash
cd site
npm install
npm run serve
```

The development server watches templates, data files, assets, and Eleventy configuration (including the new hero artwork and presentation components). Output is available at `http://localhost:8080/` by default.

## Production build

```bash
cd site
npm run build
```

Builds render into `site/_site/` and are ready to deploy behind static hosting/CDN infrastructure.

## Quality assurance

Run automated QA from the `site/` directory:

```bash
npm run test:links   # Crawl built output with linkinator
npm run test:html    # Validate generated HTML with html-validate
```

These scripts are also executed in CI via GitHub Actions (`.github/workflows/ci.yml`).

## Deployment notes

1. Commit and push to `main`. The GitHub Actions workflow installs dependencies, builds the site, and runs link and HTML validation.
2. Publish the contents of `site/_site/` to your hosting provider (e.g., GitHub Pages, S3 + CloudFront).
3. For hero imagery or future asset drops, add files under `site/assets/`—Eleventy now passthroughs this directory and watches it during development.

## Structure highlights

- `site/_includes/components/hero-art.njk` – reusable hero with responsive imagery hooks.
- `site/_includes/components/presentation.njk` – scrollable sales presentation with navigation dots and progress.
- `site/internal/` – internal-only playbooks and decks (`noindex` by default).
- `site/pricing/incentives.njk` – public-facing launch incentives routed to `/pricing/incentives/`.

Refer to `HTML_DRAFTS/` for original draft material; every document now has an Eleventy counterpart.
