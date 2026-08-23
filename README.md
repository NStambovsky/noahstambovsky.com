# noahstambovsky.com Cloudflare Pages Site

Static replacement for the Carrd version of `noahstambovsky.com`.

## Recommended deploy path

Best long-term setup: put this folder in a GitHub repository and connect that repository to a new Cloudflare Pages project with Git integration. Then every push to the production branch can deploy the site, and collaborators can use branches or pull requests.

Cloudflare Pages Direct Upload projects cannot be switched to Git integration later. If the current live site was created as Direct Upload, create a new Git-integrated Pages project, QA it on the temporary `*.pages.dev` URL, then move the custom domain to the new project.

Git-integrated settings for this static site:

- Framework preset: None
- Build command: leave blank
- Build output directory: `/`
- Production branch: `main`

## Legacy direct upload

1. Create a new Cloudflare Pages project.
2. Choose Direct Upload.
3. Upload the contents of this folder.
4. Build command: leave blank.
5. Add `noahstambovsky.com` as the custom domain.
6. Optional: add `www.noahstambovsky.com`; `_redirects` sends it to the apex domain.

## Later migrations

- `https://homericoddities.carrd.co` is still external.
- `nstambovsky.com` and `sevenworldtales.com` have matching static replacements in sibling folders.

## Planning docs

- `docs/content-and-github-plan.md`: GitHub migration notes, Cloudflare Pages setup, testimonial requirements, and vibe-coded app portfolio inventory.
