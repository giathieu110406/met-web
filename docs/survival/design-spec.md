# Đêm Canh Hoa — design and gameplay contract

## Purpose
Single-player real-time survival, 600 × 400 logical pixels, six 50-second waves,
six optional 10-second upgrade breaks, a skippable 20-second tutorial and a
90-second boss. A successful run takes roughly 5–8 minutes excluding pauses.
Enter passcode 1104 to launch survival directly; exit returns to the passcode screen. Passcode 1406 opens the original story, with no survival shortcut. No online service.

## Visual direction
Met pixel garden at night: navy #111426, violet #353052, pink #f5b6cf,
warm ivory #fff0d5, mint #99d8bd. Rain, moonlit trees and one luminous flower.
Readable silhouettes and restrained particles. Existing hero identity and
umbrella are retained. Generated reference is composition guidance only.
HUD, menus, health and control labels are semantic HTML in Be Vietnam Pro.
ImageGen first: full composition, then background and transparent sprites.

## Layout
Top: player and flower health, wave/time, pause and sound. Boss health below.
Battlefield: ground at y=320, flower x=300, player x=260. Bottom: keyboard help.
Overlays: welcome, tutorial hint, three upgrade cards, pause and result.
Desktop 1440×900; mobile landscape 844×390 and 667×375; portrait 390×844
blocks play. Touch controls live outside the battlefield with physical 44px
minimum targets and safe-area padding. Modal actions remain physically 44px.
Reduced motion removes decorative rain, pulsing and screen effects.

## Combat defaults
Player and flower start at 100. Move 180px/s. Ground jump, gravity 1100px/s²,
jump velocity -420px/s. J: 12/12/20 combo every .35s, base reach 65px.
K: 90px dash over .2s, invulnerable, cooldown 1.2s. L: 35 damage in 140px,
knockback and projectile clear, cooldown 10s. Hit grace .6s.
Leaf 24HP (8 player/5 flower damage), firefly 20HP (8 player projectile),
thorn 60HP (15 player/8 flower). Boss 600HP, sweep/rain/dash cycle,
at least .8s telegraph, 1s recovery (.6s below half health).
Six waves schedule 6/8/10/12/14/16 spawns in first 40s, alternating sides,
max eight living enemies. Survivors retreat without points at 50s.
Waves 5–6 add telegraphed rain. Six upgrade breaks, including before boss.
Upgrade: heal/repair 25; damage +15% max3; reach +12px max2;
dash cooldown -.15s max2; special cooldown -1s max3. Full/capped options
excluded. Distinct eligible choices, bonus score fillers when necessary.
Auto-select visibly marked first card after 10 seconds.
Score: leaf10/firefly15/thorn30/boss300; victory bonus 5×remaining combined HP.
Death takes priority over simultaneous victory; boss timeout loses.

## Architecture and acceptance
Independent simulation and content definitions; one mounted mode, fixed 1/60s
simulation using the existing loop, unified keyboard/pointer action dispatcher.
Pause on blur, hidden tab or portrait. Clear held/queued actions, explicit resume.
Versioned per-level local records, defensive reads/writes, no mid-run save.
No extra game framework. Future levels use data plus explicitly supported hazards.
Validate simulation, 30/60/120Hz, complete real-time run, touch/rotation,
story entry and book regression, tsc, ESLint, production build, diff check.
Physical iPhone testing is separate from Chromium device emulation.
