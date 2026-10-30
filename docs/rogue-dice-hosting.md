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


## Slower Full animation and four-die combos

Source commit d2fa784. Only Full and Instant remain. Full steps last 650–850ms plus 450ms for multiplier hits; no rush through long chains. Old Quick becomes Full; old Turbo becomes Instant. Existing saves retain schema 6 and all progress. Adds Pure Run (+12 Chips, ×1.5 Mult for same-color Run), Prism Run (+16 Chips, +3 Mult for four-color Run), and Twin Pacts (+12 Chips, +2 Mult when both value-pairs match colors). Underlying Run/Two Pair Studies and Gods remain active. All additions precede multipliers; Pure Run multiplier follows God multipliers. Glass Ceiling weakens combo ×Mult too. Combo names appear in preview, score breakdown and history; collection has a three-combo tab. Four-die cap remains.

100 automated checks pass. Browser measured ~0.8s ordinary steps, ~1.2s multiplier pauses, distinct payout stages, collection discovery, and Full-to-Instant single-commit safety. Preserves latest Tatakai commits e43bd07 and 70f9066. Rollback snapshot: 158072c6-d13f-4bcd-b3fa-d01f8ac5d6cb. Isolated bundle: /tmp/rogue-combo-publish-20261027.


## Four-die start and Pair balance

Source commit ba6539e. New runs start with four base dice, exactly one each of red/black/blue/gold. Original-color persistence and the four-die submission cap remain. Existing saves keep their three/four base dice, tray, money, levels and accumulated Echo growth. No restart is forced.

Pair base Chips 12→8 (base Mult stays 2); Study gains +6 Chips / +0.5 Mult; same-color bonus +1. Twins gives Pair ×1.5, Two Pair ×2; Looking Glass gives same-color Pair ×1.25, Two Pair ×1.5. Echo gains +0.5 per Pair / +1 per Two Pair; fractional growth is validated and saved. Hermit now gives ×1.5 with four or fewer tray dice. Eight-die tray cap and rare extra-die gating retained. Rules/collection/Study previews match.

104 automated checks pass. Exhaustive 1,296-roll audit: best hand Pair 576, Run 288, Triplet 120, Two Pair 90, Prism Run 72, Quads 6, Highest Die 144; average best score 75.25 before rerolls/upgrades. Browser QA verifies one die of every color, Pair Study + Echo + Twins at 99 points with +0.5 saved Echo growth, reload safety, and SE layouts. Rollback snapshot c0df4900-8385-433c-8d9b-01957ef3f9ff. Latest Tatakai updates f84f666/f472ea7 preserved. Isolated release bundle /tmp/rogue-four-publish-20261027.


## Probability-calibrated rewards

Source commit b3d3126. Reproducible balance/ scripts and BALANCE.md contain exact multinomial numerical odds for trays 4–8, optimal holds for 0–3 dedicated rerolls, identity-aware fixed-paint odds, and exact three-hand round-clear odds with a shared reroll budget. Rarity pricing uses a 0.65 power of a blended initial/one-reroll difficulty ratio anchored to a ~30-point Pair. Actual conditional means include pips and starting-color combos and fall within 8% of the model targets.

New bases: Pair 8×2 unchanged; Run 6×3 with +4 Chips for fourth die; Triplet 18×3; Two Pair 20×3; Quads 72×5; Pact 8×1.5. Studies: Pair/Pact +6/+0.5, Run +8/+0.5, Triplet +12/+1, Two Pair +14/+1, Quads +20/+1.5, Highest Die +2/+0.25 unchanged. Pure Run +6 Chips/×1.25; Prism +4/+1; Twin Pacts +8/+1. Kaleidoscope +1 Mult per distinct color; Spectrum Grant +0.5 per color. Fixed-color setup is not treated as a random-roll event. Targets unchanged: exact optimal first-round clear rate 99.21% with three shared rerolls and no Gods/upgrades. Existing saves and earned progress remain valid; future scores use new balance.

110 checks pass, including closed-form odds, exhaustive 1,296 engine rolls, independent solver agreement, reward bands and shared-budget invariants. Browser QA verifies Quads Lv.2 at 108 Chips ×6.5 =702, Full scoring, updated Studies/rules, saved commit and SE landscape fit. No new public files are required; the reproducibility files stay in GitHub. Current Tatakai 9e6cf8a retained. Rollback deployment 9848bd41-13e9-46f9-a302-d017e4ee8d7e. Isolated bundle /tmp/rogue-probability-publish-20261027.


## Ordered God chains and earned evolution

Source commit c01c080. Active Gods resolve left to right in the visible rack. Touch-friendly Move left/right controls and desktop drag reorder freely during play or shop. Hand/color/combos/actions/Spectrum resolve first; paint rules apply upfront; Pure Run multiplier follows Gods. Earlier God cash affects later Treasurer/Beggar checks. Refrain copies resolved immediate actions once and never copies permanent growth or recurses. Die repeats reuse exact pip/fog/permanent-bonus calculation and illuminate both God and die.

Four new Gods (40 total): Striker repeats first scoring die; Resonator adds +2 Mult per prior repeat; Refrain copies previous active God effects; Oath gives ×2 Mult for one fewer future-round normal reroll. Selling restores capacity without refunding spent rerolls. Existing five-offer shops, legendary extra-die gating, base hand rewards and targets retained.

Echo, Wayfarer, Ember and Kaleidoscope track five relevant committed hands, then offer two permanent-for-run evolution choices. Previews, copies, silenced Gods and rerolls never advance goals. Sell/rebuy clears evolution; Echo growth also resets as before. Goal badges, EVOLVE glow, progress meters and active evolved effects are visible in the inspect dialog, whose Close control stays accessible while scrolling. Schema 7 migration preserves prior score, money, tray, levels, growth and rack order, initializing new goals at zero.

130 automated checks pass, including all 120 five-slot arrangements, copied multipliers under Glass Ceiling, Taxman/fog/Hush behavior, every evolution branch, resource tradeoffs, save migration and probability invariants. Browser QA verifies Full chain/payout at 192 points, two die repeats and Ember 4→5 goal, Furnace selection, touch reorder and desktop drag, reload persistence, native sound, Full→Instant single-commit safety and SE landscape down to 568×232.

Production rollback snapshot: 719a91b2-c14f-4a82-b4e7-8e9ca565f4f2. Newer Crosscamp source 35496b0 and 66 unrelated public files preserved. Isolated release bundle /tmp/rogue-evolution-publish-20261028. Eight public Rogue Dice files remain sufficient.

Visual follow-up source d69c0fd keeps God cards fully bright while their interactions are locked during scoring.

## Pixel table redesign — 2026-10-28

Source d43245b adds original SVG portraits for all 40 Gods, local OFL pixel typography, green felt, a desktop run console, illustrated shops and compact mobile controls. All 130 engine checks pass. Public assets include rogue-dice/assets/. Saved run schema remains version 7. Previous production: 784d5792.

## Rolling colors and voucher inventory — October 29, 2026

Fresh runs roll values and colors together; holds preserve both and permanent paint locks colors. Older saves migrate to schema 8 with fixed colors locked to preserve prior paint. Vouchers beside Stakes map lists owned upgrades and purchased levels. Tide, Crown, Prism and Trinity gain two evolution choices each after five relevant hands. 140 tests pass, including paint/hold/roll paths, palette precedence, exact 52/256 natural Pact trays, migrations and all eight new paths. Browser checks cover voucher ownership, evolution selection, desktop and iPhone SE bounds. Previous production: 4ac87607.

## Build variety expansion — October 29, 2026

Catalog grows to 52 Gods, 29 actions and 21 vouchers, with original portraits for every God. Four Pillars and Pactkeeper add two evolution paths each. New content supports Quads, Pacts, fixed and rolling paint, small hands, targeted manipulation and conditional retriggers. Market Pass discounts refreshes without expanding shop size. Existing 8-die, 4-submitted-die and God-slot caps stay intact. Schema 9 adds zero-valued voucher fields while retaining current saves. 168 tests pass; browser checks cover new actions, evolution choice, Pact scoring, all collection counts and mobile bounds. Previous production: 64faba46.

## All dice sets and verified Hard balance — October 30, 2026

All 19 sets are unlocked under New run, with exact face/color weights and starting resources, chosen Seals, Ghost rituals and optional Echo token purchases. New set profiles and enhancements save in schema 10; older runs migrate to Standard with purchases, paint and evolutions retained. Four Pillars progress safely adapts to its three-Quad goal.

Common Striker now gives two repeats; common Portrait applies ×2 on every score of the first Crowned die. Beacon, Tribune and Conductor extend die-trigger builds. Retriggers replay eligible die effects without recursively firing retrigger Gods. Wayfarer/Pactkeeper grow on qualifying scores. All maximum-face effects adapt to d4. Hard removes post-boss doubling: bosses 810/6480, final 23100; Equilibrium doubles targets. Iron Hand costs one starting reroll; Hush and Three’s Company affect only the first hand; Glass Ceiling reduces multiplier bonuses by 25%. Rarity is selected first at 65/25/9/1, redistributed if unavailable.

Validation: 207 tests, including naturally earned full-run victories. Complete seeded audit: 760 runs across 19 sets × 2 modes × 20 seeds, wins in every combination. 42 of 57 retained Hard examples finished without Portrait+Striker. Results are automated-policy samples, not human win rates. Source BALANCE.md and balance/full-run-results.json contain the report and representative full histories. Browser checks cover all 19 set starts, weight previews, selected Seals, Echo purchase, six God slots, repeated multiplier presentation, safe skip/reload, desktop and iPhone SE bounds.

Public deployment must include new rogue-dice/sets.js. Previous production: 27ea3f78.
