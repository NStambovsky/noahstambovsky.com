# Site-wide Microsoft Clarity setup

Status: prepared October 31, 2026; **not activated or deployed**. The browser is waiting for Noah to sign in to Microsoft Clarity. No project ID has been supplied or invented. The loader returns immediately with an empty project ID.

## Project

Create or reuse one Clarity project named `noahstambovsky.com` with website URL `https://www.noahstambovsky.com/`. Clarity calls this a project, not a sub-account. A single project can cover the site pages and subdomains. Filter game usage by `/rogue-dice/` and the `site_section` custom tag. No dedicated Clarity connector was found; use the browser or supply the public project ID from Settings → Setup. Never request the owner's password or private API/export token.

## Prepared implementation

`site-analytics.js` waits for explicit opt-in before loading the Clarity tag. Consent is stored separately from game saves for up to 180 days. It passes the current Consent V2 fields `analytics_Storage: granted` and `ad_Storage: denied`; form fields and editable content are marked masked, including dynamically inserted forms. No custom personal identifiers, save payloads, names or email addresses are sent by our code. Clarity's own default masking also applies. The Privacy control permits revoking consent and reloading to unload the active tracker. Declined visitors do not load the vendor script on subsequent pages. Enable the project's consent mode and verify its masking settings before launch.

The site-section tag distinguishes main-site, rogue-dice, crosscamp and canvas-lite. It does not claim to count accounts, verified wins, or unique human players. Browser-calculated game state remains on-device. Standalone Rogue Dice forks must not inherit this site's Clarity project ID or loader.

## Activation after sign-in

1. Create/reuse the project and obtain its public project ID. Confirm site ownership, consent mode and masking in Clarity Settings.
2. Set `PROJECT_ID` in `site-analytics.js` to that exact ID.
3. Inject `<script defer src="/site-analytics.js?v=1"></script>` before `</head>` in each HTML entry point of the **complete latest production bundle**, including root pages, Rogue Dice/practice, Crosscamp and Canvas Lite. Keep the same integration in tracked site HTML. Do not alter app bundles or standalone game source to add this site's ID.
4. Verify no Clarity request occurs before consent, one tag loads after consent, consent calls deny advertising storage, forms are masked and game saves are unchanged. Verify a real request to `https://www.clarity.ms/collect` after acceptance and receipt of data in the project dashboard. Ad blockers may prevent collection.
5. Commit/push the personal-site integration first and deploy the complete bundle. Preserve all unrelated public bytes apart from the intended HTML inclusion and root loader. Recheck live collection. Do not represent a prepared installation as collecting data.

## Official references

- https://learn.microsoft.com/en-us/clarity/setup-and-installation/getting-started
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api

## Visual release check

Production game index.html, style.css, app.js and tutorial.html match the last deployed release (`8691c35`, Cloudflare deployment `80cb1b25`). Bundled readable fonts, clearer Play hand/Reroll controls, inspectable scoring and guided practice are live. The broader modern visual redesign has not been implemented; the arcade theme remains.
