# Tatakai browser edition

Source: https://github.com/NStambovsky/tatakai

Published URL: https://www.noahstambovsky.com/tatakai/

The game is static and needs no build. Its five public files are mirrored in `tatakai/` and linked from `projects.html`. GitHub source is pushed before Cloudflare Direct Upload. Preserve all current public site files (including Canvas Lite) in every full upload. The complete current site mirror is in the local Cloudflare Sites/noahstambovsky folder; this repository predates some existing live pages. Do not deploy only this repository until those older live pages have also been synchronized.

Pre-game production deployment for rollback: `87db622e-88cb-4c92-b75f-aef61db00797`.

Validated with 15 engine checks (including 24 complete simulated games), browser turns/save restoration/dialogs, and 320/390/768/1280px layout checks.

The creator’s short rules reel is linked in the game. Browser edge-case conventions are disclosed in its briefing and the source README.

## Rules correction

Source app commit `5b9e6af`: agents must deploy onto their home numbered half before crossing. No direct camp-to-camp infiltration. Captures enter the empty adjacent partner space. A resident defender can use a six to remove an infiltrator without moving. These follow the user’s deployment clarification and the creator’s longer video: https://www.facebook.com/tim.grayson/videos/2068646447088149/ .

21 gameplay checks pass. Browser validation confirms only the two home-side matching spaces are offered for an initial deployment and resident camp defence removes an infiltrator without moving defenders. Previous-version saves are superseded because the rules changed.

## Home capture advantage update

Source PR: https://github.com/NStambovsky/tatakai/pull/1 (88e572a). Six requires an agent already on the enemy numbered half for base entry. Home agents may escape or countercapture before an invader can spend a later turn capturing in place. All 33 engine checks and browser control checks passed, including 320px layout. Version 4 starts fresh saves. Previous production deployment: 832b115e-a972-43cf-ac62-ff47db6f7f16.

## Capture controls and Ultra mode

Source 0b5e474 adds an explicit Capture enemy piece button with target choices and explanations. New game offers Classic or Ultra. Ultra includes capture/base income, recruitment, rerolls, chosen rolls, and queued enemy rolls; both sides use the same costs and limits. Existing saves remain Classic-compatible. 54 engine tests pass; browser checks cover all powers, mode selection, capture choices, saves, AI turns, and phone/desktop layout. Deploy the five public Tatakai files within the complete site bundle.

## Ultra tactics cards

Source d7f82f6 adds eight cards, one random starting card per side, three new market offers each turn, held cards, unlimited card plays, and extra actions. Fresh approaches still require an opponent response turn before capture. Legacy Ultra saves migrate once without losing the board or coins. 64 tests pass; browser checks cover card purchases, chains, draws, extra actions, persistence, computer card turns, and phone/desktop layouts.

Home-advantage clarification (d6e3cf0): the home resident gets first capture without rolling; if both remain after that response turn, the invader may capture next turn without rolling. Extra actions cannot bypass the response turn. 65 tests and browser verification pass.

## Desktop rack and opponent reveals

Source 8c18aaf keeps board, controls and tabbed card rack visible together at laptop sizes. Opponent card plays show a paced reveal with actual effect, Continue/Escape, automatic resume, and a persisted summary. Browser checks cover 1280×720 through 1440×900, full hands, mobile 320px, tab navigation, reveal sequencing, and reload without replay. All 65 game tests pass.

## Linear release — 2026-10-27

Source commit 710d81b adds Linear: two lanes of 12 spaces, forward movement by roll, six optional die specials, and unrestricted turn skipping. All difficulties support the mode. 89 tests pass; browser checks cover all six specials, saving, desktop and mobile. Cache suffix v12. Deploy all six public files, now including linear.js, which engine.js imports for all modes.

### Square Linear board

The v13 release wraps the same 24 positions into two perimeter routes, with bases at opposite corners and mirrored 1–6 labels. Existing games and movement rules remain compatible. Browser checks cover labels, all 24 spaces, movement across a bend, and phone overflow.

## Crosscamp release

Renamed to Crosscamp at /crosscamp/; legacy /tatakai/ links redirect. Storage key retained for save continuity. Linear now captures on landing, uses 3 base health, and returns scoring agents home after one damage. Six targets home-half invaders. 93 tests and browser capture/damage/victory/migration checks pass. Cache v14. Classic and Ultra rules preserved.

## Extreme public release — 2026-10-28

Publishes the current shared v5 Linear/Ultra build plus Extreme. Extreme has 48 spaces, ten agents, five health, three independent dice, interchangeable tracks, full-row blockades and coordinated attacks. Each agent may spend one movement die per turn; reverse can combine with a second die for its distance. Actions and individual die skips are supported. All 90 tests pass and browser combination, save, blockade and AI checks pass. Cache v17. The public bundle now contains seven files including extreme.js. v4 saves remain untouched; v5 saves use crosscamp-v5.

### Extreme protected pairs and repair — 2026-10-28

Cache v18. Vault still jumps blockades but cannot land on protected pairs; switching routes cannot capture a protected pair. Strike Ahead and coordinated attacks remain ways to break pairs. Six now repairs one base health with a home agent, up to five, consuming one die. 96 tests pass, plus browser checks for protected destinations, Vault passage, repair controls, log and save persistence. Existing v5 saves remain compatible.

### Linear/Ultra home response — 2026-10-28

Cache v19. Approaching an enemy defender on its home turf creates a contested shared space. The home defender can capture without rolling; an invader can capture only after the defender’s full response turn. Either moving clears the face-off. Ultra extra actions do not bypass the response. Strike Ahead only targets home-side invaders. Added capture button, choices, guidance and contested outlines. Existing v5 saves remain compatible. All 118 tests pass plus browser checks for both capture priorities, Ultra lockout and phone overflow.

### Extreme home blockade response — 2026-10-28

Cache v20. Enemy pairs invading your turf can be attacked immediately; home-defending pairs require preparation, a full response turn, then a die next turn to finish. Applies to coordinated assault and Strike Ahead. Moving any involved blocker or attacker, or capturing an attacker, cancels preparation. Pending attacks and readiness save; UI shows warnings, target outlines and prepare/finish controls. Existing saves without pending attacks remain compatible. 130 tests pass plus browser preparation/finishing and phone layout checks.

### Extreme Roles Edition — 2026-10-28

Source b823e7f, cache v21. Fixed armies: six Agents, two Guards, two Runners; five health and two repair tokens. Guard pairs cannot be vaulted; Guards cannot enter the enemy base. Runners advance 1 up to the movement die, cannot capture, and may support attacks. Visible role deployment choices, symbols, Guard walls, movement markers and repair counters. Previous Extreme saves gain roles/tokens once and incompatible Runner attacks clear. Full printable tabletop rules at /crosscamp/extreme-rules.html; eight public files now required. 147 tests pass with browser deployment, role, repair, Guard-wall and phone checks.
