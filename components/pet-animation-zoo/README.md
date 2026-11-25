# Pet animation zoo

Little 8-bit pets living in a strip of the UI, inspired by [VS Code Pets](https://github.com/tonybaloney/vscode-pets)
and using most of its art. The pets walk, run, hop, lie down, climb the side walls, drop back down, walk over to each
other for a chat, chase a ball and eat what you feed them. Two flying dinosaurs fly around. On the lake they hop
between stepping stones. In this app it sits at the bottom
of the left nav, above the account button.

## Using it in another project

1. Copy this folder and `public/pet-animation-zoo/` (the art).
2. Needs: React 19, Zustand, Zod, React Hook Form, `@hookform/resolvers`, Luxon (with `@types/luxon`), lucide-react and Tailwind 4, plus these
   modules of the host app, imported through the `@/` path alias. Point the imports elsewhere if your app keeps them
   in other places:
   - `cn` from `@/lib/utils` (the shadcn helper, clsx + tailwind-merge)
   - the shadcn `button`, `dialog`, `field`, `input`, `select` and `tooltip` components from `@/components/ui/`
   - `RowStack` from `@/shared/components/RowStack` and `ColumnStack` from `@/shared/components/ColumnStack`
   - `Typography` from `@/components/typography/Typography`
3. Render it. It fills the width of its parent:

```tsx
import PetAnimationZoo from '@/components/pet-animation-zoo/components/PetAnimationZoo';

<PetAnimationZoo />
```

To keep a resized height across reloads without a jump, read the height cookie on the server and pass it in:

```tsx
const heightCookie = (await cookies()).get(PET_ZOO_HEIGHT_COOKIE_NAME);
<PetAnimationZoo initialHeight={ parsePetZooHeight(heightCookie?.value) } />
```

Dark mode follows the `dark` class on `<html>`. If the art is served from somewhere else, change
`PET_ZOO_ASSET_BASE_URL`.

## What it does

- **Toolbar** (top right, shown on hover or focus): Spawn pet, Throw ball, Feed, Delete pet, Change theme.
  Spawn, Delete and Change theme open a dialog with dropdowns; nothing changes until OK.
- **Spawn pet**: kind, color and name. The name starts as the kind's default name ("Biscuit 2" when taken) and
  follows the kind until you type your own. Locked kinds are listed with a lock and cannot be picked. The new pet
  hops in and greets you in its own voice. Capped at `PET_ZOO_MAX_PETS`.
- **Throw ball**: a green ball drops in and bounces. Every pet on the ground runs after it, the first to reach it
  holds it for a few seconds, then it is gone. Pets on a wall join in once they are down.
- **Feed**: a random food (`PET_ZOO_FOODS`: hamburger, bao, pizza, carrot, dumpling) drops in, on the lake onto a
  stone. Every free pet goes for the nearest piece, the first one there eats it and says so. Up to
  `PET_ZOO_MAX_FOODS` pieces at once (more pushes out the oldest), and a piece nobody eats is gone after a while.
- **Flying** (Pteranodon, Pterodactyl, `canFly`): now and then they take off and fly around, and they fly straight at
  a ball or food, catching it in the air. Before anything else they fly down and land, on the lake on a stone.
- **Hover a pet** (or focus it): its name shows above it.
- **Click a pet** (or focus it and press Enter or Space): a paw swipe and a bubble, one of its own lines or a shared
  one. Three quick clicks: a big jump. Five: zoomies. A pet on a wall lets go.
- **Conversations**: every 9 to 22 seconds two free pets meet, one walks over, they swap lines in speech bubbles.
- **Climbing**: a pet that walks into the left or right wall sometimes climbs it, hangs on, then drops down.
- **Themes**: `PET_ZOO_THEMES` is the master list. Locked themes are listed with a lock and cannot be picked.
- **Stepping stones** (Autumn lake): the pets stand on three stones spread across the lake. At the end of a stone a
  pet hops to the next one or turns around, and a pet going somewhere (to a friend, to the ball) hops across stone by
  stone. A ball that lands in the water floats and drifts to the nearest stone. Nobody climbs here.
- **Resize**: drag the top edge (double-click resets, arrow keys nudge) between `PET_ZOO_MIN_HEIGHT_PX` and
  `PET_ZOO_MAX_HEIGHT_PX`. Above the art, the theme's `fillColor` blends it into the background.

Every pet draws its own speed factor and its own durations, so no two move in sync.

## The pets

Everything about a kind of pet is one object in `PET_ZOO_PETS` (`constants/pet-zoo-pets.constants.ts`):

| Field          | What it does                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `label`        | its name in the dialogs                                                                          |
| `defaultName`  | the name the Spawn dialog starts with; what the person types is what is saved                    |
| `unlocked`     | `true`, `false` (shown with a lock, cannot be spawned), or a time in ms when it unlocks          |
| `spriteFolder` | its folder in `public/pet-animation-zoo/pets/`, kinds can share one (the three pandas)           |
| `sizeScale`    | its size, 1 is `PET_ZOO_SPRITE_SIZE_PX` (Big panda 1.45, Little panda 0.7)                       |
| `speed`, `canClimb`, `canFly`, `colors`, `animations` | how it moves and what sprites it has (a flyer needs `fly`) |
| `voice`        | its `sound`, its `greeting` and its own `lines`                                                  |

Lines every pet can say are in `PET_ZOO_MESSAGES` (`constants/pet-zoo-messages.constants.ts`). In any line, `{name}`
is replaced by the pet's name and `{sound}` by its sound. A saved pet is `{ id, type, color, name }`.

## Saved state

| What                | Where                                   | Why                                                    |
| ------------------- | --------------------------------------- | ------------------------------------------------------ |
| Pets, theme, unlocks | local storage, `PET_ZOO_STORAGE_KEY`    | Zustand `persist` in `store/pet-zoo.store.ts`          |
| Height              | cookie, `PET_ZOO_HEIGHT_COOKIE_NAME`     | the server renders the right height, nothing shifts    |

The store uses `skipHydration`: the server cannot see local storage, so `usePetZooStoreHydration` loads it after mount
and the world renders then. Saved data is checked with Zod on load; unknown pets are dropped, an unknown theme
falls back to the default, a repeated pet id keeps its first pet, and a value that is not JSON at all reads as nothing
saved (`utils/pet-zoo-storage.utils.ts`). Positions and behaviors are not saved.

### Locks

`PET_ZOO_PETS` and `PET_ZOO_THEMES` are the master lists, each entry has `unlocked`: `true`, `false` or a time in ms.
The store saves an `unlocks` record next to the pets, one entry per kind of pet and per theme, seeded from the master
lists; `unlockPet` and `unlockTheme` set an entry to `true`, for unlocks earned later. Something can be picked when
its master list entry or its saved entry says so (`utils/pet-zoo-unlock.utils.ts`). On load the saved record is
rebuilt on the master lists: an entry for a pet or theme no longer in them is dropped, so it never shows up again,
and a new one starts from its master value. A saved theme that is locked falls back to the default theme.

## How it is built

`PetZooEngine` (in `engine/`) runs one `requestAnimationFrame` loop. Each frame it steps the ball, the food and every pet,
then writes transforms, sprite URLs and bubble text straight to DOM nodes that the pet components registered.
React renders only when a pet is added or removed or the theme changes, never per frame. The loop pauses while
the zoo is hidden or off screen (an `IntersectionObserver` in `usePetZooEngine`).

```
components/   PetAnimationZoo (entry), PetZooWorld, PetZooPetSprite, PetZooNameTag, PetZooIslandLayer, PetZooBall, PetZooFood,
              PetZooToolbar, the dialogs and forms
constants/    sizes and storage keys, the pet catalog, the themes, the foods, timing and physics, messages, labels
engine/       PetZooEngine
hooks/        engine lifecycle, store hydration, dark mode, height resize
models/       saved types (pet-zoo.models) and runtime types (pet-zoo-runtime.models)
schemas/      Zod schemas for the dialogs and for what is loaded from local storage
store/        Zustand store with persist
styles/       pixel font, speech bubble, crisp pixel art
utils/        behavior (the state machine, flight), ball and food physics, clicks, speech, stepping stones, rendering,
              sprites, themes, unlocks, height, storage
```

### Adding a pet or a theme

- Pet: put `<color>_<animation>_8fps.gif` files in `public/pet-animation-zoo/pets/<folder>/`, add the type to
  `PET_ZOO_PET_TYPES` and an entry to `PET_ZOO_PETS` (see the table above). Missing animations fall back (see
  `utils/pet-zoo-sprite.utils.ts`).
- Theme: put the images in `public/pet-animation-zoo/backgrounds/<id>/`, add the id to `PET_ZOO_THEME_IDS` and an
  entry to `PET_ZOO_THEMES` with its ground height (`floorPx`) and a light and dark `fillColor`. For ground made of
  stepping stones, add `islands` (each placed by a share of the width, its image's top row is the ground) and
  `waterDepthPx` for where a ball floats.

Art credits and licenses: `public/pet-animation-zoo/CREDITS.md`.
