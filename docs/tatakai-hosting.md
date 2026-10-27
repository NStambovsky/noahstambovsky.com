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
