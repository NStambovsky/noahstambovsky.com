# Rogue Dice

Source: https://github.com/NStambovsky/rogue-dice
Live: https://www.noahstambovsky.com/rogue-dice/

Static five-file app; no build or server. Link is in projects.html. Source commit 075a45c was pushed to GitHub first. Copy the five public files to rogue-dice/ in the complete current site bundle, commit the site integration, then deploy to the existing Cloudflare Pages project noahstambovsky on main. Do not deploy this repository alone until its older site pages have all been synchronized; the complete local site mirror remains in Cloudflare Sites/noahstambovsky. Preserve Tatakai, Canvas Lite, and the other live pages.

Validated with 29 engine checks; browser gameplay, shop purchases, actions, permanent die upgrades, saves, and dialogs; and layouts from 320 to 1280px, including eight dice and five equipped Gods on a small phone.

Pre-Rogue production deployment for rollback: 54bd14f5.noahstambovsky.pages.dev.

## Modes, bosses, Two Pair, and SE landscape

Source update: 1272ce2. Two Pair is a distinct 24 Chips × 3 Mult hand, with its own upgrades, two Echo growth, and one Twins multiplier. Casual uses 100 + 100 × zero-based round targets with no bosses. Hard bosses conclude Antes 3 and 6; target scale is ×2 from Ante 4 and ×4 from Ante 7. Pale House blocks the base color bonus; Iron Hand blocks normal rerolls but allows Second Wind. Save versions 1/2 migrate to version 3 in Hard mode without resetting the build.

The stakes strip, next-round shop preview, and map explain the target progression. Landscape gameplay was measured at 568×320 and 667×375, plus browser-height reductions to 568×260 and 568×232, with eight dice, five Gods, and three actions. Main controls, dice, inventories and stats fit without page scrolling. Shops and inspect dialogs remain scrollable. 43 engine checks and browser-mode/migration/boss checks pass.

Pre-update rollback deployment: 997784b1.noahstambovsky.pages.dev.

## Expanded build edition

Source commit 1d2383f. New runs start with three dice from red/black/blue/gold; scoring submissions are fixed at four dice. Quads and Color Pact are playable, Highest Die is the weak fallback, and larger matching ranks are not submittable under the cap. There are 32 Gods, 12 vouchers, and 15 actions. Extra-die offers are weighted legendary, gated until Ante 2, and cost more. Shops normally have five offers with one random Study and cooldowns. Echo growth resets on sale/rebuy. Score FX is an optional, persisted, skippable exact scoring trace.

The public app now requires SIX files including catalog.js. Save migration retains old trays/builds, adds new fields, resets ghost Echo growth when unowned, and replaces old shop stock with a smaller market. 72 engine checks pass, plus browser checks for fallback scoring, animation/skip single-commit behavior, colors, cap enforcement, collections, and small-screen layouts. The optional fourth action slot can scroll within its panel at extremely reduced browser heights.

Pre-release rollback deployment: 7659b75e.noahstambovsky.pages.dev.

## On-table scoring and variable bosses

Source commit 3ed4f3f. Scoring now plays on the table with lifting dice, firing Gods, distinct additive/multiplicative effects, optional rising Web Audio, score transfer, target break, and wallet payout. Full/Quick/Turbo/Instant speed and sound preferences persist. A hand commits once before presentation; skip, Instant switching, hidden tabs, and reloads cannot duplicate scoring. The old blocking scoring modal is removed.

Twenty boss handicaps live in bosses.js. A saved d20 draw selects one on boss entry and avoids previous bosses. Draws and resource handicaps survive reloads; acknowledgement applies once. Existing current legacy bosses are preserved.

EIGHT public files are required, including bosses.js and presentation.js. 87 checks and browser QA pass, including clear/payout events, speed presets, sound controls, reload/skip safety, persistent boss reveal, and SE viewports through 568×232.

Latest Tatakai updates d20f52d and 242ad5c were preserved. Production rollback snapshot: 673dd0f7-f5cf-4be1-8c6f-14aa281d51ce. An isolated bundle /tmp/rogue-score-publish-20261027 avoids sharing another release’s staging folder.


## Four-color builds

Source commit 76bf13f. Adds Blue Regent and Golden Sovereign monochrome Gods, The Divide red/black God, The Kaleidoscope color-variety God, two mutually exclusive palette licenses, Spectrum Grant, Blue/Gold Seals, and four round-long Wash cards. Color priority is Wash, God, palette license, original paint. Washes persist through rerolls/hands/reload and clear on next-round entry. Original colors are never deleted by overrides. Palette counts and an inspect dialog expose every die’s original and effective color.

Save schema 6 migrates schema-5 builds without resetting progress. Catalog now has 36 Gods, 15 vouchers, and 21 actions; shop size and rare extra-die weights retained. 95 automated checks pass; browser QA includes painting under Red Queen, saved temporary colors, permanent paint beneath a Wash, color provenance, no console errors, and SE layouts at 568×232, 568×320, 667×375 plus 320px portrait.

Production rollback snapshot: b7531860-f550-4f8f-80b3-3f9a78cf8d4f. Current Tatakai site commits ca8c063 and 2b1be48 retained. Isolated release bundle: /tmp/rogue-color-publish-20261027.
