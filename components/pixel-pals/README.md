# Pixel Pals

Little 8-bit pets living in a strip of the UI, inspired by [VS Code Pets](https://github.com/tonybaloney/vscode-pets)
and using most of its art. The pets walk, run, hop, lie down, climb the side walls, drop back down, walk over to each
other for a chat, chase a ball and eat what you feed them. The flying dinosaurs and the alicorn fly around. On the lake they hop
between stepping stones. In this app it sits at the bottom
of the left nav, above the account button.

## Using it in another project

1. Copy this folder and `public/pixel-pals/` (the art).
2. Needs: React 19, Zustand, Zod, React Hook Form, `@hookform/resolvers`, lucide-react and Tailwind 4, plus these
   modules of the host app, imported through the `@/` path alias. Point the imports elsewhere if your app keeps them
   in other places:
   - `cn` from `@/lib/utils` (the shadcn helper, clsx + tailwind-merge)
   - the shadcn `button`, `dialog`, `field`, `input`, `select`, `slider` and `tooltip` components from `@/components/ui/`
   - `RowStack` from `@/shared/components/RowStack` and `ColumnStack` from `@/shared/components/ColumnStack`
   - `Typography` from `@/components/typography/Typography`
3. Render it. It fills the width of its parent:

```tsx
import PixelPals from '@/components/pixel-pals/components/PixelPals';

<PixelPals />
```

To keep a resized height across reloads without a jump, read the height cookie on the server and pass it in:

```tsx
const heightCookie = (await cookies()).get(PIXEL_PALS_HEIGHT_COOKIE_NAME);
<PixelPals initialHeight={ parsePixelPalsHeight(heightCookie?.value) } />
```

Pass `className` to change its border or background (this app passes `border-sidebar-border`). Dark mode follows the
`dark` class on `<html>`. If the art and the font are served from somewhere else, change
`PIXEL_PALS_ASSET_BASE_URL`.

## What it does

- **Toolbar** (top right, shown on hover or focus): Spawn pet, Throw ball, Feed, Delete pet, Change theme.
  Spawn, Delete and Change theme open a dialog with dropdowns; nothing changes until OK.
- **Spawn pet**: kind, color and name. The name starts as the kind's default name ("Biscuit 2" when taken) and
  follows the kind until you type your own. Locked kinds are listed with a lock and cannot be picked. The new pet
  hops in and greets you in its own voice. Disabled once `userPixelPetCount` pets are out.
- **Throw ball**: a green ball drops in and bounces. Every pet on the ground runs after it, the first to reach it
  holds it for a few seconds, then it is gone. Pets on a wall join in once they are down.
- **Feed**: a random food (`PIXEL_PALS_FOODS`: hamburger, bao, pizza, carrot, dumpling) drops in, on the lake onto a
  stone. Every free pet goes for the nearest piece, the first one there eats it and says so. Up to
  `PIXEL_PALS_MAX_FOODS` pieces at once (more pushes out the oldest), and a piece nobody eats is gone after a while.
- **Flying** (Pteranodon, Pterodactyl, Alicorn, `canFly`): now and then they take off and fly around, and they fly straight at
  a ball or food, catching it in the air. Before anything else they fly down and land, on the lake on a stone.
- **Hover a pet** (or focus it): its name shows above it.
- **Click a pet** (or focus it and press Enter or Space): a paw swipe and a bubble, one of its own lines or a shared
  one. Three quick clicks: a big jump. Five: zoomies. A pet on a wall lets go.
- **Conversations**: every 25 to 50 seconds (`PIXEL_PALS_CONVERSATION_INTERVAL`) two free pets meet, one walks over,
  they swap lines in speech bubbles.
- **Climbing**: a pet that walks into the left or right wall sometimes climbs it, hangs on, then drops down.
- **Themes** (backgrounds): `PIXEL_PALS_THEMES` is the master list. Locked ones are listed with a lock and cannot be picked.
- **Weather**: a background with `particles` gets a slider under the dropdown in Change theme, from Off to 100%:
  snow (Winter, Snowy peak), falling leaves (Autumn, Autumn lake), gray debris (Portal gate), rain (Overgrown city,
  Karst peaks) or fog (Misty cove, Castle gate). The slider sets how many particles there are, never their size: a
  flake, leaf or speck is 1 to 2 px and a raindrop a 1 px wide streak, so the art always shows through. Fog is the
  exception: each wisp is 22 to 44 px wide and 3 to 6 px tall, kept faint (30% opacity, 20% in dark). Every background
  starts at its `defaultLevel` (0, off); OK saves the level only when it was moved.
- **Stepping stones** (Autumn lake): the pets stand on three stones spread across the lake. At the end of a stone a
  pet hops to the next one or turns around, and a pet going somewhere (to a friend, to the ball) hops across stone by
  stone. A ball that lands in the water floats and drifts to the nearest stone. Nobody climbs here.
- **Resize**: drag the top edge (double-click resets, arrow keys nudge) between `PIXEL_PALS_MIN_HEIGHT_PX` (room for the
  biggest pet on the tallest ground, worked out from the master lists) and `PIXEL_PALS_MAX_HEIGHT_PX`. Above the art, the theme's `fillColor` blends it into the background.
- **Nav width**: when the nav gets wider or narrower, everything keeps its place across the width, as the stones do.
  Narrower than `PIXEL_PALS_MIN_WORLD_WIDTH_PX` (the nav collapsed to icons, or mid-animation) the world keeps its last
  real size. Pets that joined while it was hidden spread out the first time it shows.

Every pet draws its own speed factor and its own durations, so no two move in sync.

## Tuning

How often the pets talk, how fast they move, how long they do each thing, jumps, climbing, flying, the ball and the
food are all numbers in `constants/pixel-pals-behavior.constants.ts`. The file is split into numbered sections
(1. Talking, 2. Moving speed, ...) and each number says what it changes and which way. Every constant you can change,
what it changes and its value now is in the [constants reference](#constants-reference) at the bottom.

One kind's own speed and size are `speed` and `sizeScale` on its entry in `PIXEL_PALS_PETS`. What pets say is in
`constants/pixel-pals-messages.constants.ts` and each pet's `voice`.

## The pets

Everything about a kind of pet is one object in `PIXEL_PALS_PETS` (`constants/pixel-pals-pets.constants.ts`). The
order of `PIXEL_PALS_PET_IDS` in the same file is the order of the Spawn dialog's Pet dropdown (the dinosaurs first),
and `PIXEL_PALS_DEFAULT_PET_ID` is the default pet: the one Pixel Pals starts with. The Spawn dialog starts on it when
it is unlocked, otherwise on the first unlocked kind in that order.

| Field          | What it does                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `petId`        | its key in `PIXEL_PALS_PETS`                                                                     |
| `label`        | its name in the dialogs                                                                          |
| `defaultName`  | the name it goes by without a nickname, and the one the Spawn dialog starts with                 |
| `unlocked`     | the default of `unlockedPets`, `true` or `false` (see Locks)                                     |
| `spriteFolder` | its folder in `public/pixel-pals/pets/`, kinds can share one (the three pandas)           |
| `sizeScale`    | its size, 1 is `PIXEL_PALS_SPRITE_SIZE_PX` (Big panda 1.45, Little panda 0.7). The art made for this project fills its frame edge to edge, so it uses about 0.8 to 1 to look as big as the VS Code Pets art, and the unicorn foal 0.7 |
| `speed`, `canClimb`, `canFly`, `colors`, `animations` | how it moves and what sprites it has (a flyer needs `fly`) |
| `voice`        | its `sound`, its `greeting` and its own `lines`                                                  |

The pandas, the dinosaurs and the unicorns also come in three aurora colors (`aurora_borealis`, `aurora_rose`,
`aurora_frost`, `AURORA_COLORS`): a vibrant gradient that drifts over the pet as it moves. They are recolors of one of
the kind's own colors, so they have every animation the kind has.

Lines every pet can say are in `PIXEL_PALS_MESSAGES` (`constants/pixel-pals-messages.constants.ts`). In any line, `{name}`
is replaced by the pet's name and `{sound}` by its sound.

## Saved state

| What                                   | Where                                   | Why                                                 |
| -------------------------------------- | --------------------------------------- | --------------------------------------------------- |
| Pets, background, pet count, locks, weather | local storage, `PIXEL_PALS_STORAGE_KEY` | Zustand `persist` in `store/pixel-pets.store.ts`    |
| Height                                 | cookie, `PIXEL_PALS_HEIGHT_COOKIE_NAME` | the server renders the right height, nothing shifts |

The pixel-pets store is what Pixel Pals shows; the dialogs only call its actions. What it saves:

| State                    | What it is                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `userPixelPetCount`      | how many pets can be out at once, `PIXEL_PALS_DEFAULT_PET_COUNT` (10), kept in 1 to 30      |
| `userPixelPetBackground` | the id of the background (theme) shown                                                    |
| `userPixelPets`          | the pets out, each `{ id, petId, color, nickName? }`; starts with one default pet, `PIXEL_PALS_DEFAULT_PET_ID` (Brachiosaurus) in its first color (`PIXEL_PALS_DEFAULT_PETS`) |
| `unlockedBackgrounds`    | `{ [backgroundId]: boolean }`, only the backgrounds a lock action changed                  |
| `unlockedPets`           | `{ [petId]: boolean }`, only the kinds of pet a lock action changed                        |
| `userPixelPetParticleLevels` | `{ [backgroundId]: 0 to 100 }`, only the backgrounds whose weather slider was moved; the others use `particles.defaultLevel` |

A saved pet is filled in from its master list entry to be shown (`getResolvedPixelPet`): everything comes from
`PIXEL_PALS_PETS[petId]`, with the person's `color` and its `nickName` (or else the kind's `defaultName`) on top. The
Spawn dialog saves a `nickName` only when the name is not the default one.

Getter hooks: `useGetUserPixelPetCount`, `useGetUserPixelPetBackground`, `useGetUserPixelPets`,
`useGetUnlockedBackgrounds`, `useGetUnlockedPets` (every entry, see Locks), `useGetParticleLevels` (every background's
weather level), `useGetSpawnedPixelPetCount`. Actions (`usePixelPetStoreActions`):
`setUserPixelPetCount`, `setUserPixelPetBackground`, `setUserPixelPetParticleLevel`, `setUserPixelPets`, `addUserPixelPet`, `removeUserPixelPet`,
`setPetUnlocked`, `unlockAllPets`, `lockAllPets`, `setBackgroundUnlocked`, `unlockAllBackgrounds`,
`lockAllBackgrounds`. Lowering `userPixelPetCount` below the pets out removes none, it only stops new ones.

The store uses `skipHydration`: the server cannot see local storage, so `usePixelPetsStoreHydration` loads it after mount
and the world renders then. Saved data is checked with Zod on load, value by value: a bad pet (unknown kind or color)
is dropped, a repeated pet id keeps its first pet, a bad count or background falls back to its default, a weather
level is kept only for a background with `particles` and only as a whole number in 0 to 100, and a value
that is not JSON at all reads as nothing saved (`utils/pixel-pals-storage.utils.ts`). Positions and behaviors are not
saved.

### Locks

The `unlocked` of each master list entry (`PIXEL_PALS_PETS`, `PIXEL_PALS_THEMES`) decides whether it can be picked,
unless a lock action changed it: `setPetUnlocked`, `setBackgroundUnlocked`, `unlockAllPets`, `lockAllPets`,
`unlockAllBackgrounds` or `lockAllBackgrounds`. The store's `unlockedPets` and `unlockedBackgrounds` save only the
entries an action changed, and those win. So a change to a master list reaches everyone, except for the entries an
action set for them. `useGetUnlockedPets` and `useGetUnlockedBackgrounds` give the result for every entry, which is
what the Spawn and Change theme dropdowns read: `false` is listed with a lock and cannot be picked.

On load a saved entry is kept only if its id is still in the master list and its value is a boolean
(`utils/pixel-pals-unlock.utils.ts`). Storage version 1 saved every entry, so its locks are dropped on load (`migrate`
in the store). To open something on a date, call `setPetUnlocked` or `setBackgroundUnlocked` then.

Locks are only about picking. The actions do not check them, so code can still add a locked pet, and locking a kind or
a background leaves the pets out and the background shown as they are.

## How it is built

`PixelPalsEngine` (in `engine/`) runs one `requestAnimationFrame` loop. Each frame it steps the ball, the food, the
weather and every pet, then writes transforms, sprite URLs and bubble text straight to DOM nodes that the pet and food
components registered (`PixelPalsPetSprite` registers a pet's nodes, `PixelPalsFood` the image slots that
`renderPixelPalsFoods` fills), and draws the weather on the canvas of `PixelPalsParticleLayer` (1 canvas px per CSS px,
in front of the foreground, ignoring clicks).
React renders only when a pet is added or removed, the theme or its weather level changes or the app switches between
light and dark, never per frame. The loop pauses while
Pixel Pals is hidden or off screen (an `IntersectionObserver` in `usePixelPalsEngine`).

```
components/   one display component per file: PixelPals (entry), PixelPalsWorld, PixelPalsPetSprite, PixelPalsNameTag,
              PixelPalsSpeechBubble, PixelPalsIslandLayer and PixelPalsIsland, PixelPalsBall, PixelPalsFood and PixelPalsFoodSlot,
              PixelPalsParticleLayer, PixelPalsToolbar and its buttons, the dialogs, their forms and fields (select, text, slider)
constants/    sizes and storage keys, the pet catalog, the themes, the foods, the weather effects, the tuning numbers (behavior),
              messages, labels
engine/       PixelPalsEngine
hooks/        engine lifecycle, store hydration, dark mode, height resize
models/       saved types (pixel-pals.models) and runtime types (pixel-pals-runtime.models)
schemas/      Zod schemas for the dialogs and for what is loaded from local storage
store/        the pixel-pets Zustand store with persist, its getter hooks and actions
styles/       pixel font, speech bubble, crisp pixel art
utils/        behavior (the state machine, flight), ball and food physics, weather particles and levels, clicks, speech,
              stepping stones, rendering, sprites, themes, unlocks, height, storage
```

### Adding a pet or a theme

- Pet: put `<color>_<animation>_8fps.gif` files in `public/pixel-pals/pets/<folder>/`, add its id to
  `PIXEL_PALS_PET_IDS` and an entry to `PIXEL_PALS_PETS` (see the table above). Missing animations fall back (see
  `utils/pixel-pals-sprite.utils.ts`).
- Theme: put the images in `public/pixel-pals/backgrounds/<id>/`, add the id to `PIXEL_PALS_THEME_IDS` and an
  entry to `PIXEL_PALS_THEMES` with its ground height (`floorPx`) and a light and dark `fillColor`. For ground made of
  stepping stones, add `islands` (each placed by a share of the width, its image's top row is the ground) and
  `waterDepthPx` for where a ball floats. For weather, add `particles: { effect, defaultLevel }` (an effect id from
  `PIXEL_PALS_PARTICLE_EFFECT_IDS`, a level from 0 to 100); the slider shows up for it in Change theme. A new effect
  needs its id there, its look in `PIXEL_PALS_PARTICLE_EFFECTS` and its motion in `PIXEL_PALS_PARTICLE_TUNING`.

Art credits and licenses: `public/pixel-pals/CREDITS.md`.

## Constants reference

Every constant in `constants/` that you can change, what it changes, and its value now. Units: distances in px, times
in seconds, speeds in px per second, chances from 0 (never) to 1 (always). A range `[min, max]` means a value is picked
at random in it each time, so the pets never move in sync. "Sprite sizes" means pet widths (1 = one
`PIXEL_PALS_SPRITE_SIZE_PX` sprite). Rows marked _worked out_ follow from other constants, so change those instead.

### Behavior: `pixel-pals-behavior.constants.ts`

**1. Talking**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_CONVERSATION_INTERVAL` | seconds between two pets starting a chat on their own; higher = they chat less | `[25, 50]` |
| `PIXEL_PALS_CONVERSATION_LINE_SECONDS` | how long each of the two chat lines stays on screen | `2.4` |
| `PIXEL_PALS_CONVERSATION_REPLY_GAP_SECONDS` | the pause between the first line going away and the answer | `0.2` |
| `PIXEL_PALS_CONVERSATION_SECONDS` | how long the two stand together to talk; _worked out_ from the two above | `5.2` |
| `PIXEL_PALS_CONVERSATION_DISTANCE_IN_SPRITES` | how close two pets stand to talk, middle to middle | `1.1` |
| `PIXEL_PALS_APPROACH_FRIEND_MAX_SECONDS` | a pet only walks over to a friend it can reach in this time, so slow pets pick one nearby | `25` |
| `PIXEL_PALS_APPROACH_FRIEND_MARGIN_SECONDS` | extra time that walk may take, for the stone hops on the lake | `3` |
| `PIXEL_PALS_WAIT_FOR_FRIEND_EXTRA_SECONDS` | how much longer than the walk the friend waits before it gives up | `1` |
| `PIXEL_PALS_BUBBLE_SECONDS` | how long every other bubble stays up: clicks, greetings, "Yum!", ball lines | `2.2` |
| `PIXEL_PALS_OWN_LINE_CHANCE` | chance a pet says one of its own `voice.lines` instead of a shared line; 1 = always its own | `0.5` |
| `PIXEL_PALS_MISSED_BALL_LINE_CHANCE` | chance each pet that lost the race to the ball says something; 0 = they stay quiet | `0.5` |

**2. Moving speed**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_SPEED_MULTIPLIER` | every pet's speed at once (walk, run, chase, zoomies, fly, climb); 0.5 = half speed, 2 = twice | `1` |
| `PIXEL_PALS_SPEED_FACTOR_RANGE` | each pet's speed is its kind's `speed` times a random factor in this range | `[0.75, 1.25]` |
| `PIXEL_PALS_RUN_SPEED_MULTIPLIER` | running speed = walking speed times this | `1.6` |
| `PIXEL_PALS_CHASE_SPEED_MULTIPLIER` | going for the ball or food = walking speed times this | `1.9` |
| `PIXEL_PALS_ZOOMIES_SPEED_MULTIPLIER` | zoomies (five quick clicks) = walking speed times this | `2.4` |
| `PIXEL_PALS_FLY_SPEED_MULTIPLIER` | flying = walking speed times this | `2.5` |
| `PIXEL_PALS_CLIMB_SPEED` | how fast every pet climbs a wall, px per second | `14` |

**3. What a pet does next, and for how long**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_BEHAVIOR_DURATION` | seconds each activity lasts before the pet picks the next one | idle `[1.5, 4]`, lie `[3, 7]`, stand `[2, 4]`, walk `[2, 5]`, run `[1.2, 3]`, wallHang `[1, 3]`, fly `[3, 7]`, withBall `[3, 4]`, eat `1.6`, swipe `0.7`, land `0.25`, zoomies `3`, talk follows the talking settings |
| `PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS` | how likely each activity is next. Weights, not percents: only their size next to each other counts. More idle and lie = calmer pets, more run = livelier | walk `0.38`, run `0.16`, idle `0.26`, lie `0.1`, stand `0.1`, fly `0.3` |
| `PIXEL_PALS_REST_AT_EDGE_CHANCE` | chance a pet takes a short rest after turning around at a wall or the end of a stone | `0.4` |

**4. Hops, jumps and gravity**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_GRAVITY` | how fast pets, the ball and food fall, px per second²; higher = quicker, lower jumps | `700` |
| `PIXEL_PALS_HOP_CHANCE_PER_SECOND` | chance per second that a walking or running pet does a little hop; 0 = no hops | `0.18` |
| `PIXEL_PALS_ZOOMIES_HOP_CHANCE_PER_SECOND` | the same during zoomies | `0.72` |
| `PIXEL_PALS_HOP_VELOCITY` | how high the little hops go (take-off speed) | `120` |
| `PIXEL_PALS_SPAWN_HOP_VELOCITY` | how high a new pet hops as it says hi | `168` |
| `PIXEL_PALS_BIG_JUMP_VELOCITY` | how high the jump on the third quick click goes | `240` |

**5. Climbing walls**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_CLIMB_CHANCE` | chance a pet that walks into the left or right wall climbs it; 0 = no climbing | `0.4` |
| `PIXEL_PALS_CLIMB_HEIGHT_FACTOR_RANGE` | how far up a climb goes, as a share of the free height above the ground (0.5 = halfway) | `[0.35, 0.9]` |
| `PIXEL_PALS_MIN_CLIMB_HEIGHT_IN_SPRITES` | no climbing when the free height is less than this many sprite sizes | `1.5` |

**6. Flying**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_MIN_FLY_HEIGHT_IN_SPRITES` | no flying around when the free height is less than this many sprite sizes | `1` |
| `PIXEL_PALS_MIN_FLIGHT_HEIGHT_IN_SPRITES` | the lowest a flying pet aims, in sprite sizes above the ground | `0.3` |
| `PIXEL_PALS_FLY_CATCH_REACH_IN_SPRITES` | how close a flyer's middle gets to the ball or food to catch it | `0.6` |

**7. Stepping stones (Autumn lake)**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_SKIP_CHANCE` | chance a pet at the end of its stone hops to the next one instead of turning around | `0.6` |
| `PIXEL_PALS_ZOOMIES_SKIP_CHANCE` | the same during zoomies | `0.85` |
| `PIXEL_PALS_SKIP_MIN_VELOCITY` | the slowest take-off of a hop between stones, so even a short hop has an arc | `110` |
| `PIXEL_PALS_SKIP_LANDING_INSET_PX` | how far onto the next stone a hop lands, from its edge | `6` |
| `PIXEL_PALS_ISLAND_CATCH_REACH_PX` | extra reach for a ball or food floating next to a pet's stone | `6` |

**8. Clicking a pet**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_CLICK_STREAK_SECONDS` | clicks on the same pet closer together than this count as one streak | `1.2` |
| `PIXEL_PALS_CLICKS_FOR_BIG_JUMP` | the click in a streak that makes the big jump | `3` |
| `PIXEL_PALS_CLICKS_FOR_ZOOMIES` | the click in a streak that starts zoomies | `5` |

**9. Ball, and catching things**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_BALL_THROW_SPEED_RANGE` | how fast the ball flies sideways when thrown | `[60, 150]` |
| `PIXEL_PALS_BALL_BOUNCE_DAMPING` | share of its speed the ball keeps on each bounce; 1 = bounces forever, 0 = no bounce | `0.7` |
| `PIXEL_PALS_BALL_WALL_DAMPING` | share of its speed the ball keeps when it hits a wall | `0.9` |
| `PIXEL_PALS_BALL_MIN_BOUNCE_SPEED` | the ball stops bouncing once it lands slower than this | `40` |
| `PIXEL_PALS_BALL_ROLL_FRICTION` | how fast a rolling ball slows down, per second | `1.4` |
| `PIXEL_PALS_BALL_DRIFT_SPEED` | how fast a ball in the water drifts to the nearest stone | `10` |
| `PIXEL_PALS_BALL_LIFETIME_SECONDS` | a ball nobody catches is gone after this | `12` |
| `PIXEL_PALS_CATCH_REACH_IN_SPRITES` | how close a pet on the ground gets to the ball or food to catch it, sideways from its middle | `0.45` |
| `PIXEL_PALS_CATCH_HEIGHT_IN_SPRITES` | how low the ball or food must be for a pet on the ground to catch it | `0.7` |

**10. Food**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_MAX_FOODS` | pieces of food out at once; one more pushes out the oldest | `5` |
| `PIXEL_PALS_FOOD_LIFETIME_SECONDS` | food nobody eats is gone after this | `30` |

**11. Frame loop**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_MAX_FRAME_SECONDS` | the longest step the simulation takes at once, so pets don't jump ahead after the tab was in the background | `0.1` |

**12. Weather particles**

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_PARTICLE_TUNING` | per effect: `maxPer10kPx` (how many at 100% for every 10,000 px²; the default 240 × 150 is 3.6 of those), `size` (px), `fallSpeed` (px per second down), `drift` (px per second sideways, negative = left), `sway` (px side to side) and `swaySeconds` (one swing); rain also has `streakLength`, fog `thickness` | snow `40` (about 144 flakes at 100%), 1 to 2 px, falls `[10, 24]`; leaves `9` (about 32), 2 px, falls `[12, 22]`; debris `24` (about 86), 1 to 2 px, drifts left `[6, 16]`; rain `30` (108), 1 px, streaks `[3, 5]` px long; fog `6` (about 22), wisps `[22, 44]` px wide and `[3, 6]` tall |
| `PIXEL_PALS_RAIN_FALL_SPEED` | how fast rain falls, px per second; a drop takes about 1.3 s to reach the ground at the default height | `[80, 110]` |
| `PIXEL_PALS_RAIN_SLANT` | how much rain slants: px left for every px down; 0 = straight down | `0.1` |
| `PIXEL_PALS_RAIN_SPLASH_SECONDS` | how long the little splash shows where a drop lands | `0.12` |
| `PIXEL_PALS_PARTICLE_SMALL_SHARE` | share of snow and debris drawn at the smaller of their two sizes | `0.75` |
| `PIXEL_PALS_FOG_TOP_SHARE` | fog stays low: its wisps sit between this share of the height from the top and the ground | `0.35` |
| `PIXEL_PALS_PARTICLE_SPAWN_SPREAD_PX` | a particle going back to the top starts up to this far above it, so they don't arrive in one row | `12` |

### Weather look and slider: `pixel-pals-particles.constants.ts`

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_PARTICLE_EFFECT_IDS` | the weather effects there are; a theme's `particles.effect` is one of them | `snow`, `leaves`, `debris`, `rain`, `fog` |
| `PIXEL_PALS_PARTICLE_EFFECTS` | per effect: the slider's `label`, the `colors` (light and dark, one picked at random per particle) and the `opacity` (0 to 1, light and dark) | e.g. rain `'Rain'`, opacity `0.6` light, `0.55` dark; fog opacity `0.3` light, `0.2` dark |
| `PIXEL_PALS_PARTICLE_LEVEL_MIN`, `PIXEL_PALS_PARTICLE_LEVEL_MAX` | the ends of the weather slider; a saved level outside them is dropped on load | `0`, `100` |
| `PIXEL_PALS_PARTICLE_LEVEL_STEP` | how much one step of the slider moves | `5` |

### Sizes, storage and assets: `pixel-pals.constants.ts` and `pixel-pals-height.constants.ts`

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_ASSET_BASE_URL` | where the art and the font are served from | `'/pixel-pals'` |
| `PIXEL_PALS_DEFAULT_HEIGHT_PX` | the height before the person resizes it, and after a double-click on the handle | `150` |
| `PIXEL_PALS_MAX_HEIGHT_PX` | the tallest it can be dragged; above the art the theme's `fillColor` takes over | `420` |
| `PIXEL_PALS_MIN_HEIGHT_PX` | the shortest it can be dragged: the biggest pet on the tallest ground, plus the border; _worked out_ from the pets and themes | `91` |
| `PIXEL_PALS_HEIGHT_KEYBOARD_STEP_PX` | how much one arrow key press on the resize handle changes the height | `10` |
| `PIXEL_PALS_MIN_WORLD_WIDTH_PX` | narrower than this (nav collapsed or mid-animation) the world keeps its last size | `120` |
| `PIXEL_PALS_HEIGHT_COOKIE_NAME` | the cookie that keeps the height | `'pixel-pals-height'` |
| `PIXEL_PALS_HEIGHT_COOKIE_MAX_AGE_SECONDS` | how long that cookie is kept | one year |
| `PIXEL_PALS_STORAGE_KEY` | the local storage key of the pixel-pets store; a new key starts everyone fresh | `'pixel-pets-store'` |
| `PIXEL_PALS_STORAGE_VERSION` | raise it, with a `migrate` step in the store, when the saved shape changes | `2` |
| `PIXEL_PALS_DEFAULT_PET_COUNT` | how many pets can be out at once until the person changes it | `10` |
| `PIXEL_PALS_MIN_PET_COUNT`, `PIXEL_PALS_MAX_PET_COUNT` | the range that count is kept in | `1`, `30` |
| `PIXEL_PALS_PET_NAME_MAX_LENGTH` | the longest name the Spawn dialog takes | `20` |
| `PIXEL_PALS_SPRITE_SIZE_PX` | the base sprite square; each pet is this times its kind's `sizeScale` | `30` |
| `PIXEL_PALS_BUBBLE_FONT` | the font the bubbles are measured in; keep it the same as `.pixel-pals-bubble` in `styles/pixel-pals.css` | `"8px 'PixelPalsSilkscreen'"` |
| `PIXEL_PALS_FONT_FACE_CSS` | the `@font-face` of the pixel font; _worked out_ from `PIXEL_PALS_ASSET_BASE_URL` | Silkscreen |
| `PIXEL_PALS_BALL_RADIUS_PX` | the ball's radius; it is drawn twice this wide (6 px now) | `3` |
| `PIXEL_PALS_BALL_COLOR` | the ball's color | `'#2ed851'` |

### Pets: `pixel-pals-pets.constants.ts`

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_PET_IDS` | every kind of pet, in the order of the Spawn dialog's Pet dropdown | 37 kinds, the 8 dinosaurs first |
| `PIXEL_PALS_DEFAULT_PET_ID` | the pet a new person starts with (`PIXEL_PALS_DEFAULT_PETS` in the store) and the one Spawn starts on | `'brachiosaurus'` |
| `PIXEL_PALS_SPEED` | the named walking speeds a kind's `speed` picks from, px per second | still `0`, verySlow `9`, slow `16`, normal `24`, fast `32`, veryFast `40` |
| `PIXEL_PALS_COLOR_LABELS` | how each color name from the file names shows in the Color dropdown | e.g. `sky: 'Sky blue'` |
| `AURORA_COLORS` (not exported) | the gradient colors the pandas, dinosaurs and unicorns get on top of their own | `aurora_borealis`, `aurora_rose`, `aurora_frost` |
| `PIXEL_PALS_PETS` | everything about each kind (see [The pets](#the-pets)): `label`, `defaultName`, `unlocked`, `sizeScale`, `speed`, `canClimb`, `canFly`, `colors`, `voice` | e.g. dog: `'Biscuit'`, `sizeScale: 1`, `speed: normal`, colors brown, black, white, red, akita |

### Backgrounds: `pixel-pals-themes.constants.ts`

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_THEME_IDS` | every background, in the order of the Change theme dropdown | 21, `'none'` first |
| `PIXEL_PALS_DEFAULT_THEME_ID` | the background a new person starts with | `'library'` |
| `PIXEL_PALS_THEMES` | each background: `label`, `unlocked`, `floorPx` (ground height), `fillColor` (light, dark), its image layers, `islands` and `waterDepthPx` (the lake), and `particles` (its weather effect and where the slider starts) | e.g. winter: `particles: { effect: 'snow', defaultLevel: 0 }` |

### Food: `pixel-pals-foods.constants.ts`

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_FOOD_KINDS` | what the Feed button can drop, one picked at random | `hamburger`, `bao`, `pizza`, `carrot`, `dumpling` |
| `PIXEL_PALS_FOODS` | each food's `label`, its image `fileName` and the `line` the pet that eats it says | e.g. pizza: `'Pizza time! 🍕'` |
| `PIXEL_PALS_FOOD_SIZE_PX` | the size food is drawn at | `12` |

### Text: `pixel-pals-messages.constants.ts` and `pixel-pals-labels.constants.ts`

| Constant | What it changes | Value now |
| --- | --- | --- |
| `PIXEL_PALS_MESSAGES` | what every pet can say: `conversations` (pairs of lines), `chatReplies`, `clickReactions`, and the one-off lines (`bigJump`, `zoomies`, `fall`, `caughtBall`, `missedBall`...). `{name}` and `{sound}` are filled in | e.g. `['Wanna play?', 'Yes!! 🎾']` |
| `PIXEL_PALS_LABELS` | the text of the toolbar, the dialogs and their errors | e.g. `spawnPet: 'Spawn pet'` |
