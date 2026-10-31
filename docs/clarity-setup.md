# Site-wide Microsoft Clarity setup

Status: installation configured October 31, 2026 using existing project `nylti7eg1i`, extracted from the public tracking snippet on https://www.sevenworldtales.com/ at Noah’s explicit request. Live collection must be verified after deployment. The existing Carrd site is unchanged.

## Project

Reuse the existing project currently installed on Sevenworldtales; no new project or sub-account was created. Clarity calls this a project, not a sub-account. A single project can cover the site pages and subdomains. Filter game usage by `/rogue-dice/` and the `site_section` custom tag. No dedicated Clarity connector was found; use the browser or supply the public project ID from Settings → Setup. Never request the owner's password or private API/export token.

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


## Installation release

The complete current public bundle is `/tmp/site-clarity-publish-20261031`. All 25 HTML entry points include `/site-analytics.js?v=20261031-2`; all other existing public asset bytes are preserved. `site_domain` and `site_section` tags distinguish this domain and Rogue Dice from the existing Sevenworldtales site. Only the public Clarity project ID is reused; no account credentials or API token are stored. Keep this site-only include when replacing public game/practice HTML in future releases. Standalone Rogue Dice source/builds do not inherit it.

Pre-deployment browser QA: zero vendor requests before acceptance; explicit analytics consent with advertising denied; site_domain/site_section tags; dynamic private fields masked; a played Rogue Dice save survives reload unchanged; revocation stops the loader on reload; no browser errors. All unchanged non-HTML production bytes are preserved. Existing deployed HTML entry points that were absent from Git are captured in this release so their tracking additions are reviewable.


Live verification of initial release `1deb4b16`: the real project tag and client script returned HTTP 200; Clarity collection returned HTTP 204. No Clarity requests occurred before acceptance. Consent revocation removed `_clck` and `_clsk` cookies and prevented loading after reload. All 87 checked public files matched the released bundle. A 568×320 overlap check found the floating privacy control covered a God card, so the final revision embeds Privacy & analytics in Rogue Dice Help and the practice safety area instead. Other site pages retain the small floating control.
