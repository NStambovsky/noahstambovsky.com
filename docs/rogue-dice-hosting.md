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
