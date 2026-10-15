# Nikillan Rajesh — Robotics & AI

A personal landing page introduces Nikillan Rajesh and fades into a portfolio based on the composition of camillemormal.com. Work uses a horizontal strip of portrait cards and an expandable fullscreen view. The selected card stays centered, with Work/About navigation above and a numeric counter below. Seven SVG placeholder covers accompany content adapted from the supplied resume. No generated raster images are used.

Run `npm run dev` and open http://localhost:3000. No installation or build step is needed. Deploy the `dist` directory to any static host.

The live portfolio is hosted at https://nikillanr.github.io/portfolio/. Push to `main` to publish updates automatically through `.github/workflows/deploy.yml`. The workflow checks JavaScript and deploys only `dist` to GitHub Pages. Local resumes, browser profiles, and QA artifacts are excluded from Git.

Edit `dist/content.js` to update the profile, education, experience, skills, and projects. Each project supports a title, italic accent, category, year, organization, image, alt text, description, disciplines, highlights, a disclosure note, and an optional live project link. Replace the cover image paths with your own screenshots and photography when available. Update the illustration disclosure when replacing a cover with real project imagery.

Stories follow resume order: Eli Lilly, GE HealthCare, ROAR Lab, Columbia Robotics Club / CCBR, Robotics Studio, Project MANAS, and produce freshness estimation. Project MANAS focuses on team leadership and research infrastructure; CCBR perception work has its own entry. Each project's `displayTitle` and position in `dist/content.js` determine its gallery label and order. Covers are concept illustrations, not project screenshots or exact prototype renderings. Ongoing work and team results are labeled accordingly.

Regenerate SVG covers with `node scripts/create-covers.mjs`. The original resume remains in the workspace as source material; the website does not serve a downloadable copy or display a resume link.

Choose Explore my work on the landing page to fade into the gallery. Direct `#work` and `#about` links bypass the introduction. The gallery footer and About introduction display the profile's linked email address.

Scroll, drag, swipe, or use the arrow keys to browse the portrait strip. Tap a card or choose Fullscreen to expand it. In fullscreen, tap the title to open the project story; choose Overview, press Escape, or click Work to return to the strip. The selected project is preserved between views. Mobile uses native horizontal touch scrolling, viewport-sized cards, safe-area spacing, and touch targets of at least 44px for navigation controls.

Includes project pages, native dialog focus management, reduced-motion support, and responsive layouts. WebGL provides a curved fullscreen image transition and subtle pointer parallax; a CSS image reveal works when WebGL is unavailable. Fonts use DM Sans via Google Fonts, with local system fallbacks. All project images are stored locally. Replace the project's image path in `dist/content.js` when supplying a real image; the portrait strip, fullscreen viewer, and thumbnails use the same source.
