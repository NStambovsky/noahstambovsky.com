# noahstambovsky.com Content and GitHub Plan

Last updated: 2026-07-07

## Goals

- Put the source for `noahstambovsky.com` in GitHub so Noah, Zo, and Codex can collaborate from the same source of truth.
- Move deployment away from repeated manual uploads and toward Cloudflare Pages Git integration.
- Add a testimonials section using public praise from G2 and the HubSpot Solutions Directory.
- Add a portfolio section for vibe-coded apps, starting with known local projects and expanding to work-computer HubSpot API apps as descriptions become available.

## Current site state

- Local folder: `/Users/noahstambovsky/Vibe Coding/Cloudflare Sites/noahstambovsky`
- Type: static HTML/CSS/JS
- Main files:
  - `index.html`: content and page sections
  - `styles.css`: visual system and responsive layout
  - `script.js`: copy-to-clipboard behavior
  - `_headers` and `_redirects`: Cloudflare Pages config files
- Current deployment instructions use Cloudflare Pages Direct Upload.
- This folder is not currently a Git repository.

## Recommended GitHub and Cloudflare setup

Best path: create a new GitHub repository from this folder and create a new Cloudflare Pages project connected to that GitHub repo.

Cloudflare currently treats Direct Upload and Git-integrated Pages projects as separate project modes. A Direct Upload project cannot be switched to Git integration later, so the likely migration is:

1. Create a GitHub repo, probably `noahstambovsky.com` or `personal-site`.
2. Put the contents of this folder at the repository root.
3. In Cloudflare Pages, create a new Pages project with `Connect to Git`.
4. Connect the GitHub repo.
5. Build settings:
   - Framework preset: None
   - Build command: blank
   - Build output directory: `/`
   - Production branch: `main`
6. Let Cloudflare build a temporary `*.pages.dev` URL.
7. QA the temporary URL.
8. Move `noahstambovsky.com` and optional `www.noahstambovsky.com` from the existing Direct Upload Pages project to the new Git-integrated Pages project.
9. Keep the old Direct Upload project around briefly for rollback, then remove it after the new project is stable.

Working model after migration:

- Local edits happen in this folder.
- Codex or Noah commits changes.
- Zo can open issues, branches, or pull requests.
- Every push to `main` deploys production.
- Branches and pull requests can get preview deployments.

## Repo visibility

Recommendation: start private, then decide later whether to make it public.

Reasons to start private:

- The site may include draft copy, testimonial source notes, or private project descriptions.
- Work-computer HubSpot API apps may include implementation details that should be described publicly without publishing source.
- It keeps the collaboration surface clean while the portfolio is being shaped.

Public is fine later if the repo contains only static site code and no sensitive notes.

## Testimonials section plan

Purpose: show third-party trust without making the personal homepage feel like a hard-selling agency page.

Recommended placement: after the existing Professional card row and before Vermont South.

Possible section title options:

- `What Clients Say`
- `Proof From HubSpot Work`
- `Notes From People I Have Helped`

Content model per testimonial:

- Quote text
- Person name
- Role/title
- Company, if public and okay to use
- Source: G2 or HubSpot Solutions Directory
- Link to source page, if available
- Permission status:
  - Public review
  - Approved direct quote
  - Needs approval
- Theme:
  - HubSpot implementation
  - reporting
  - paid media
  - RevOps
  - strategy
  - responsiveness

Initial todo:

- Collect 3-6 strongest quotes.
- Prefer quotes that mention specific outcomes, clarity, speed, technical competence, or strategic judgment.
- Avoid overloading the homepage. Use 3 featured quotes and optionally a link to the full HubSpot/G2 profile.

Draft testimonial card structure:

```text
"[Short quote]"

Name, role
Source: HubSpot Solutions Directory
```

## Portfolio section plan

Purpose: make the vibe-coded apps legible as a body of practical product work, not just scattered experiments.

Recommended placement: after testimonials or after the Professional section.

Possible section title options:

- `Vibe-Coded Apps`
- `Tools I Have Built`
- `Working Prototypes`

Content model per app:

- Name
- One-line description
- Problem solved
- Users / audience
- Stack
- Current status:
  - live
  - local prototype
  - internal/work app
  - archived
- Source availability:
  - public GitHub repo
  - private GitHub repo
  - source unavailable
  - description only
- Link:
  - live app
  - GitHub repo
  - case study
  - none yet
- Result or proof:
  - time saved
  - task automated
  - workflow improved
  - adoption/use notes

## Known local app candidates

### Klippy

- Local paths:
  - `/Users/noahstambovsky/Vibe Coding/KLIPPY Ultimate/frontend`
  - `/Users/noahstambovsky/Vibe Coding/Codex/Klippy Legacy`
- Current local evidence: React/Vite front end; legacy package describes it as an AI-powered video clip editor.
- Portfolio angle: AI-assisted clipping/editing workflow for turning longer video into usable clips.
- Source recommendation: private GitHub first, public later only if secrets, media paths, and generated assets are cleaned up.

### Canvas Lite

- Local path: `/Users/noahstambovsky/Vibe Coding/Claude Code/canva-lite`
- Current local evidence: Electron app built with React, Vite, Fabric.js, JSZip, and background removal.
- Portfolio angle: lightweight desktop design/canvas tool with asset manipulation and background removal.
- Source recommendation: private GitHub first; likely good public candidate after packaging notes and asset cleanup.

### Pebble

- Local evidence: referenced in launchers and previous local app work, but this site folder does not contain the source.
- Portfolio angle to confirm: personal desktop/app launcher or sandbox workflow tool.
- Source recommendation: locate source folder before deciding whether to publish source or write a description-only case study.

### Life Dashboard / Vault Viewer

- Local path: `/Users/noahstambovsky/Vibe Coding/Claude Code/life-dashboard`
- Current local evidence: Next.js app using SQLite, file watching, date utilities, and local dashboard patterns.
- Portfolio angle: personal operating system/dashboard for notes, projects, and local workflows.
- Source recommendation: private only unless vault paths, personal data assumptions, and local integrations are abstracted.

### Obsidian Capture

- Local path: `/Users/noahstambovsky/Vibe Coding/Codex/Notes App`
- Current local evidence: local web app for quick phone capture into an Obsidian vault with markdown, attachments, images, and PDFs.
- Portfolio angle: local-first capture flow for saving phone notes and files directly into an Obsidian vault.
- Source recommendation: private or public after path/security notes are generalized.

### HubSpot API apps

- Source location: work computer.
- Portfolio angle: likely strong because these connect directly to Noah's professional positioning.
- Source recommendation: description-only by default unless the code is personal IP, scrubbed of tokens/client data, and approved for publication.
- Needed from Noah:
  - app names or working titles
  - problem solved
  - API objects touched
  - before/after workflow
  - screenshots or sanitized examples
  - whether source can ever be public

## Website implementation notes

Recommended first homepage changes:

1. Add `Testimonials` to the header nav.
2. Add `Portfolio` to the header nav.
3. Add a compact testimonials band after the Professional cards.
4. Add a portfolio grid with 4-6 app cards.
5. Update the AI-friendly Markdown textarea so LLMs understand the new proof points and app portfolio.

Potential future enhancement:

- Move testimonial and portfolio data into a small `content.js` or JSON file to make updates easier without editing long HTML sections.

## Open questions

- Which site should receive these sections first: `noahstambovsky.com`, `nstambovsky.com`, or both?
- Do we want the personal homepage to point to portfolio case studies, or should the resume site hold the deeper professional case studies?
- Which testimonials are approved to quote verbatim?
- Should app source repos live under Noah's personal GitHub account or a separate organization/shared workspace for Zo collaboration?
- Do any work-computer HubSpot API apps involve employer/client IP that should stay description-only?
