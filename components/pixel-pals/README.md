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
   - the shadcn `button`, `dialog`, `field`, `input`, `select` and `tooltip` components from `@/components/ui/`
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

Dark mode follows the `dark` class on `<html>`. If the art and the font are served from somewhere else, change
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
- **Conversations**: every 9 to 22 seconds two free pets meet, one walks over, they swap lines in speech bubbles.
- **Climbing**: a pet that walks into the left or right wall sometimes climbs it, hangs on, then drops down.
- **Themes** (backgrounds): `PIXEL_PALS_THEMES` is the master list. Locked ones are listed with a lock and cannot be picked.
- **Stepping stones** (Autumn lake): the pets stand on three stones spread across the lake. At the end of a stone a
  pet hops to the next one or turns around, and a pet going somewhere (to a friend, to the ball) hops across stone by
  stone. A ball that lands in the water floats and drifts to the nearest stone. Nobody climbs here.
- **Resize**: drag the top edge (double-click resets, arrow keys nudge) between `PIXEL_PALS_MIN_HEIGHT_PX` (room for the
  biggest pet on the tallest ground, worked out from the master lists) and `PIXEL_PALS_MAX_HEIGHT_PX`. Above the art, the theme's `fillColor` blends it into the background.
- **Nav width**: when the nav gets wider or narrower, everything keeps its place across the width, as the stones do.
  Narrower than `PIXEL_PALS_MIN_WORLD_WIDTH_PX` (the nav collapsed to icons, or mid-animation) the world keeps its last
  real size. Pets that joined while it was hidden spread out the first time it shows.

Every pet draws its own speed factor and its own durations, so no two move in sync.

## The pets

Everything about a kind of pet is one object in `PIXEL_PALS_PETS` (`constants/pixel-pals-pets.constants.ts`):

| Field          | What it does                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `petId`        | its key in `PIXEL_PALS_PETS`                                                                     |
| `label`        | its name in the dialogs                                                                          |
| `defaultName`  | the name it goes by without a nickname, and the one the Spawn dialog starts with                 |
| `unlocked`     | the default of `unlockedPets`, `true` or `false` (see Locks)                                     |
| `spriteFolder` | its folder in `public/pixel-pals/pets/`, kinds can share one (the three pandas)           |
| `sizeScale`    | its size, 1 is `PIXEL_PALS_SPRITE_SIZE_PX` (Big panda 1.45, Little panda 0.7)                       |
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
| Pets, background, pet count, locks     | local storage, `PIXEL_PALS_STORAGE_KEY` | Zustand `persist` in `store/pixel-pets.store.ts`    |
| Height                                 | cookie, `PIXEL_PALS_HEIGHT_COOKIE_NAME` | the server renders the right height, nothing shifts |

The pixel-pets store is what Pixel Pals shows; the dialogs only call its actions. What it saves:

| State                    | What it is                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `userPixelPetCount`      | how many pets can be out at once, `PIXEL_PALS_DEFAULT_PET_COUNT` (10), kept in 1 to 30      |
| `userPixelPetBackground` | the id of the background (theme) shown                                                    |
| `userPixelPets`          | the pets out, each `{ id, petId, color, nickName? }`; starts with one brown dog (`PIXEL_PALS_DEFAULT_PETS`) |
| `unlockedBackgrounds`    | `{ [backgroundId]: boolean }`, only the backgrounds a lock action changed                  |
| `unlockedPets`           | `{ [petId]: boolean }`, only the kinds of pet a lock action changed                        |

A saved pet is filled in from its master list entry to be shown (`getResolvedPixelPet`): everything comes from
`PIXEL_PALS_PETS[petId]`, with the person's `color` and its `nickName` (or else the kind's `defaultName`) on top. The
Spawn dialog saves a `nickName` only when the name is not the default one.

Getter hooks: `useGetUserPixelPetCount`, `useGetUserPixelPetBackground`, `useGetUserPixelPets`,
`useGetUnlockedBackgrounds`, `useGetUnlockedPets` (every entry, see Locks), `useGetSpawnedPixelPetCount`. Actions (`usePixelPetStoreActions`):
`setUserPixelPetCount`, `setUserPixelPetBackground`, `setUserPixelPets`, `addUserPixelPet`, `removeUserPixelPet`,
`setPetUnlocked`, `unlockAllPets`, `lockAllPets`, `setBackgroundUnlocked`, `unlockAllBackgrounds`,
`lockAllBackgrounds`. Lowering `userPixelPetCount` below the pets out removes none, it only stops new ones.

The store uses `skipHydration`: the server cannot see local storage, so `usePixelPetsStoreHydration` loads it after mount
and the world renders then. Saved data is checked with Zod on load, value by value: a bad pet (unknown kind or color)
is dropped, a repeated pet id keeps its first pet, a bad count or background falls back to its default, and a value
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

`PixelPalsEngine` (in `engine/`) runs one `requestAnimationFrame` loop. Each frame it steps the ball, the food and every pet,
then writes transforms, sprite URLs and bubble text straight to DOM nodes that the pet and food components registered
(`PixelPalsPetSprite` registers a pet's nodes, `PixelPalsFood` the image slots that `renderPixelPalsFoods` fills).
React renders only when a pet is added or removed, the theme changes or the app switches between light and dark,
never per frame. The loop pauses while
Pixel Pals is hidden or off screen (an `IntersectionObserver` in `usePixelPalsEngine`).

```
components/   PixelPals (entry), PixelPalsWorld, PixelPalsPetSprite, PixelPalsNameTag, PixelPalsIslandLayer, PixelPalsBall, PixelPalsFood,
              PixelPalsToolbar, the dialogs and forms
constants/    sizes and storage keys, the pet catalog, the themes, the foods, timing and physics, messages, labels
engine/       PixelPalsEngine
hooks/        engine lifecycle, store hydration, dark mode, height resize
models/       saved types (pixel-pals.models) and runtime types (pixel-pals-runtime.models)
schemas/      Zod schemas for the dialogs and for what is loaded from local storage
store/        the pixel-pets Zustand store with persist, its getter hooks and actions
styles/       pixel font, speech bubble, crisp pixel art
utils/        behavior (the state machine, flight), ball and food physics, clicks, speech, stepping stones, rendering,
              sprites, themes, unlocks, height, storage
```

### Adding a pet or a theme

- Pet: put `<color>_<animation>_8fps.gif` files in `public/pixel-pals/pets/<folder>/`, add its id to
  `PIXEL_PALS_PET_IDS` and an entry to `PIXEL_PALS_PETS` (see the table above). Missing animations fall back (see
  `utils/pixel-pals-sprite.utils.ts`).
- Theme: put the images in `public/pixel-pals/backgrounds/<id>/`, add the id to `PIXEL_PALS_THEME_IDS` and an
  entry to `PIXEL_PALS_THEMES` with its ground height (`floorPx`) and a light and dark `fillColor`. For ground made of
  stepping stones, add `islands` (each placed by a share of the width, its image's top row is the ground) and
  `waterDepthPx` for where a ball floats.

Art credits and licenses: `public/pixel-pals/CREDITS.md`.
