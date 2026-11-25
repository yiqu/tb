# Pet animation zoo

Little 8-bit pets living in a strip of the UI, inspired by [VS Code Pets](https://github.com/tonybaloney/vscode-pets)
and using its art. The pets walk, run, hop, lie down, climb the side walls, drop back down, walk over to each
other for a chat, and chase a ball. In this app it sits at the bottom of the left nav, above the account button.

## Using it in another project

1. Copy this folder and `public/pet-animation-zoo/` (the art).
2. Needs: React 19, Zustand, Zod, React Hook Form, `@hookform/resolvers`, lucide-react and Tailwind 4, plus these
   modules of the host app, imported through the `@/` path alias. Point the imports elsewhere if your app keeps them
   in other places:
   - `cn` from `@/lib/utils` (the shadcn helper, clsx + tailwind-merge)
   - the shadcn `button`, `dialog`, `field`, `input`, `select` and `tooltip` components from `@/components/ui/`
   - `RowStack` and `ColumnStack` from `@/shared/components/`
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

- **Toolbar** (top right, shown on hover or focus): Spawn pet, Throw ball, Delete pet, Change theme.
  Spawn, Delete and Change theme open a dialog with dropdowns; nothing changes until OK.
- **Spawn pet**: kind, color and name. The new pet hops in and says hi. Capped at `PET_ZOO_MAX_PETS`.
- **Throw ball**: a green ball drops in and bounces. Every pet on the ground runs after it, the first to reach it
  holds it for a few seconds, then it is gone. Pets on a wall join in once they are down.
- **Click a pet** (or focus it and press Enter or Space): a paw swipe and a bubble. Three quick clicks: a big jump.
  Five: zoomies. A pet on a wall lets go.
- **Conversations**: every 9 to 22 seconds two free pets meet, one walks over, they swap lines in speech bubbles.
- **Climbing**: a pet that walks into the left or right wall sometimes climbs it, hangs on, then drops down.
- **Resize**: drag the top edge (double-click resets, arrow keys nudge) between `PET_ZOO_MIN_HEIGHT_PX` and
  `PET_ZOO_MAX_HEIGHT_PX`. Above the art, the theme's `fillColor` blends it into the background.

Every pet draws its own speed factor and its own durations, so no two move in sync.

## Saved state

| What                | Where                                   | Why                                                    |
| ------------------- | --------------------------------------- | ------------------------------------------------------ |
| Pets and the theme  | local storage, `PET_ZOO_STORAGE_KEY`     | Zustand `persist` in `store/pet-zoo.store.ts`          |
| Height              | cookie, `PET_ZOO_HEIGHT_COOKIE_NAME`     | the server renders the right height, nothing shifts    |

The store uses `skipHydration`: the server cannot see local storage, so `usePetZooStoreHydration` loads it after mount
and the world renders then. Saved data is checked with Zod on load; unknown pets are dropped, an unknown theme
falls back to the default, a repeated pet id keeps its first pet, and a value that is not JSON at all reads as nothing
saved (`utils/pet-zoo-storage.utils.ts`). Positions and behaviors are not saved.

## How it is built

`PetZooEngine` (in `engine/`) runs one `requestAnimationFrame` loop. Each frame it steps the ball and every pet,
then writes transforms, sprite URLs and bubble text straight to DOM nodes that the pet components registered.
React renders only when a pet is added or removed or the theme changes, never per frame. The loop pauses while
the zoo is hidden or off screen (an `IntersectionObserver` in `usePetZooEngine`).

```
components/   PetAnimationZoo (entry), PetZooWorld, PetZooPetSprite, PetZooBall, PetZooToolbar, the dialogs and forms
constants/    sizes and storage keys, the pet catalog, the themes, timing and physics, messages, labels
engine/       PetZooEngine
hooks/        engine lifecycle, store hydration, dark mode, height resize
models/       saved types (pet-zoo.models) and runtime types (pet-zoo-runtime.models)
schemas/      Zod schemas for the dialogs and for what is loaded from local storage
store/        Zustand store with persist
styles/       pixel font, speech bubble, crisp pixel art
utils/        behavior (the state machine), ball physics, clicks, rendering, sprites, themes, height, storage
```

### Adding a pet or a theme

- Pet: put `<color>_<animation>_8fps.gif` files in `public/pet-animation-zoo/pets/<type>/`, add the type to
  `PET_ZOO_PET_TYPES` and an entry to `PET_ZOO_PETS` listing its colors and the animations that have a file.
  Missing animations fall back (see `utils/pet-zoo-sprite.utils.ts`).
- Theme: put the images in `public/pet-animation-zoo/backgrounds/<id>/`, add the id to `PET_ZOO_THEME_IDS` and an
  entry to `PET_ZOO_THEMES` with its ground height (`floorPx`) and a light and dark `fillColor`.

Art credits and licenses: `public/pet-animation-zoo/CREDITS.md`.
