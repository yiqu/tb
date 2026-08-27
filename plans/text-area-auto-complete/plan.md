# Objective

- I want a A text area As you're typing, when you hit a certain key (for example, the colon or the question mark, which is a Shift key on the keyboard), the text area where the typing cursor should populate a dropdown menu where they search inbox on top of the dropdown menu. That dropdown menu should be scrollable because the content and the number of options in that dropdown menu could get pretty large. In this dropdown menu, we should be able to display a list of things, a list of objects, that are passed into this component. When you're searching in the search box, it should be able to start filtering as you're typing. For now, this filtering and the number of items that are passed in should all be local. Nothing is remote searching. It's not calling any server functions or anything like that. There's no pagination on this dropdown list. All the items should be passed in at once.

- The component. This should be a component that's shareable and droppable into other codebases. Make everything componentized, and every display component should be its own file. Any utility functions that you make should be in the utils file. I want this made, and then also use this component in the test route. I already made a component in the test route, so just go ahead and put this textarea component that you make into there so we can test it out.

## Details

- Create a AutoCompletableTextArea.tsx component, and AutoCompletableTextAreaUncontrolled.tsx component, and its supporting files and functions.

- We will be using TEST_GISTS as the list of items, the type is Gist. (located in test.utils.ts file).

- The filter input should take in a callback filter function and then use that as the filtering function, since this component is shareable and should work with other type of objects. In this example, the filter function is itemFilterFunction(), already written.

- Once the dropdown shows up, I could type in the inbox and filter, so the list is getting bigger or smaller based on what I type in. I can use my keyboard and use the down arrow and up arrow to select the item in the dropdown list, or I can use my mouse and click on the item I want. Once I click on the item, it should then automatically fill in what I selected into the text area. I just didn't know what it is. I had to filter and then select it, and then it will automatically fill in the text area based on what I selected.

- Now that I selected something, I don't want to necessarily display the ID or whatever some other field. Now this text area component should also take in an item display function. Based on this function that you pass it in, you can then decide what to actually show as the text string in the text area. In this example, the display function is displayItemFunction()

- When the drop-down shows up and the user decides that he doesn't actually want to select anything, he should be able to press the escape key and then close that drop-down list.

-When you're using the down arrow and up arrow on the keyboard to navigate the items in this list, you should be able to also just press Enter. It should also trigger the same select function as if you clicked on it.

- When the dropdown list first opens, the mouse cursor should automatically focus on the filter input field so that the user can start filtering stuff right away. Once you type something, you should just be able to use the down arrow or up arrow to start selecting the item, or, if it's better, whichever is easier: use the down arrow or up arrow to start selecting, or use the Tab and then Tab into the selections and start using your barrel down arrow to select items.

- Once the item is selected and autofilled into the text area, is there a way to make this really visible to the user that this is something that was autofilled and that they didn't type it in? What's going to show up in the text area is based on the callback function that was passed to tell it to show up as such. For example, the list of gist options shows up. I click on one. What actually gets displayed in the text area should be the ID, for example, in this case. So i would pass in textAreaItemDisplay(), But I should be able to pass in any text or item display function, and then it will display based on whatever that function tells it to.

- What I want is that now the ID is being shown, but in the textarea, really make the ID display a little bit differently, maybe with a squiggly, squiggly, deep-colored underline or a border around it, so that this looks like an actual item. Maybe it doesn't have to be even text, whatever you think is better, like a React node or something, but like an item attached to the picture from Gmail, because the Gmail one is a really good example. When you type in an email address, that email address, when you click on it, actually looks like a button and has a dropdown, because we want to do the same thing here:
- We're going to make it distinguishable from regular text so they know this is an alias auto-filled item.
- Once they click on it, this item will show a popover menu. Now, if you look at the Gmail example picture I attached, that is a menu.
- This should have a Edit option. Once you click on Edit, we should show that dropdown list again to select something different.
- Show Details. When I click on Show Details, it should pop over another dialog. Use the share dialog that's used everywhere in this app. Just find the one that's currently used. Don't make a brand-new one. Once you click on Show Details, we should show everything about this. This actual Gist, in this case, is the Gist, but it could be anything else in a different place. That's why the display functions and all this stuff should be componentized so that it is easily composable.  Anyway, the details option, when you click on it, is just to show a dialog with everything about this inside that dialog, so the users know what the actual content of the Gist is.

- Let's call this component AutoCompletableTextArea.tsx.

- Make this AutoCompletableTextArea component workable with react-hook-form, so it's controlled. 

- Make a dumb version of AutoCompletableTextArea as well, call it AutoCompletableTextAreaUncontrolled.tsx, no need hook form prop passed in, it should have a initValue, and onChange callback.

- Examples to test and show should be in app\(base)\test\page.tsx


## Customization
- This text area component should also take in className, so it can use TW classes to adjust the style of this text area.
- the keyboard key to trigger the dropdown select display. For example, it could be the question mark, plus sign, whatever. When you detect this is entered, then it should show that drop down list at the input cursor where the location input cursor is.
- those 3 callback fn's i mentioned earlier. For this example, it is in test.utils.ts, and read the comments for each function. Filter function and option item display function. The goal here is to make this very composable and usable with a different list of different objects, because in this example it is using the gist object. It should also be composable and easy to use, so that it can pop into any list with a different shape of object and just pass in those two functions. It will then be usable.
- List of the items passed in is a  prop. Typed.
- dropdown select's className should be a prop, can call it selectItemClassName.
- Use shadcn components in the ui folder. Dont modify the original shadcn components, if need to, copy it and extend it.
- The menu options, when you click on an autocompleted item, should be in their own thing so that it is composable, easily changeable, and maintainable in the future. Make it so that, for each menu item, the callbacks don't make that so tied to this. Also make it easy to swap in something else. Everything should be its own function and composable. Make sure you write a comment on everything so we know what to change in the future if we want something else.



## Glossary
- "autocompleted item": the item that was autocompleted from select the item in the dropdown list. 

## Bonus
- Create a different type of Object, create the type for it. Then a list to pass in, and Demonstrate that this component is also usable with other types of objects.

---

# Tech Spec (implemented)

Everything below documents what was actually built, how it works internally, and the traps to
know about when debugging. All plan items above are DONE, plus follow-ups requested later:
no squiggly underline on chips (plain pill only), clipboard copy/cut serializes chips via the
transform function, paste is forced to plain text, existing item ids in text are converted
to chips on load and on blur, a clear ("X") button in the top right corner, and Copy /
Copy display entries in the chip menu.

## File map

Component suite (shareable, generic over item type `T`) — `components/auto-completable-textarea/`:

| File | Responsibility |
| --- | --- |
| `AutoCompletableTextArea.tsx` | Main controlled component. Owns the contentEditable surface, trigger-key handling, clipboard handlers, blur id-detection, and orchestrates dropdown / chips / details dialog. |
| `AutoCompletableTextAreaUncontrolled.tsx` | Dumb wrapper: `initValue` + `onChange`, holds state internally, renders the controlled one. |
| `AutoCompleteDropdown.tsx` | Caret-anchored Popover + cmdk Command: search input on top (auto-focused), scrollable filtered list, ArrowUp/Down + Enter, Escape/outside-click closes. |
| `AutoCompleteItemChip.tsx` | One autocompleted item inside the text area: `contentEditable={false}` pill span + DropdownMenu (the chip popover menu). |
| `AutoCompleteChipMenu.tsx` | `getDefaultChipMenuItems()`: data-driven default menu (Edit / Copy / Copy display / Show details / Remove). Pass a custom array via `chipMenuItems` prop to add/remove/reorder entries. |
| `AutoCompleteClearButton.tsx` | The clear ("X") button pinned to the top right corner. |
| `AutoCompleteItemDetailsDialog.tsx` | "Show details" dialog. Reuses the app-wide `shared/dialogs/StyledDialogContent`. Custom body via `renderItemDetails`, generic key/value dump fallback. |
| `autocompletable-textarea.models.ts` | All types: segments, value, props, chip menu item config + context. |
| `autocompletable-textarea.utils.ts` | DOM parsing, hydration scan, caret helpers, serialization helpers. |

Demos — `app/(base)/test/`:
- `_components/AutoCompleteTextAreaDemo.tsx` — controlled + react-hook-form (Controller) + Zod, Gist list, trigger `:`. Default form value contains a raw `GIST-3333333` to demo load-time hydration. Submit shows the server string.
- `_components/AutoCompleteTextAreaDemo2.tsx` — same text area as one field among ordinary ones (Location seeded, Car name empty, Is driveable false), reusing `HFInputField` / `HFCheckbox`; submit echoes every value.
- `_components/AutoCompleteTextAreaUncontrolledDemo.tsx` — uncontrolled + bonus `Teammate` type, trigger `@`.
- `_components/test.utils.ts` — also carries `CriticalIssue`/`TEST_CRITICAL_ISSUES`, the
  production-shaped example: ids look like `CRIT-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` (each `X` a
  letter in either case or a digit) and `getCriticalIssueRegex()` returns
  ``/CRIT-[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}/g``.
  Intentionally unguarded (no `\b`), because ids are often typed flush against neighbouring
  characters and must still match. Consequences: `XCRIT-9f3a…` matches from the `C`, and an
  over-long FINAL group matches greedily from the left, chipping the first twelve characters and
  leaving the rest as text. An over-long group anywhere else fails to match outright, since each is
  followed by a literal dash.
- `_components/test.utils.ts` — `Gist`/`TEST_GISTS` (ids are `GIST-1111111`…`GIST-9999999`), `Teammate`/`TEST_TEAMMATES`, and the callback fns: `itemFilterFunction`, `textAreaItemDisplay`, `textAreaItemTransformForServerFunction` (returns `item.id`), `getAutocompleteItemIdPrefix` (returns `'GIST-'`), `isItemDisabled` (non-aliasable gists are unselectable), teammate equivalents.
- `_components/Utils.tsx` — dropdown row renderers (`ItemOptionDisplay`, `TeammateOptionDisplay`).

## Value model

The value is NOT a string. It is `AutoCompleteValue<T> = AutoCompleteSegment<T>[]` where a segment
is `{ kind: 'text', text }` or `{ kind: 'item', chipId, item }`. `chipId` is a unique per-insert id
(`generateChipId()`) so the same item can appear twice. Helpers:
- `autoCompleteValueToText(value, itemToText)` — flatten to a string. Pass `itemDisplayFunction`
  for what the user sees, or `itemTransformFunction` (e.g. `item => item.id`) for the server string.
- This value flows through react-hook-form as the field value; derive the server string at submit.

## Shared substrate: `components/auto-completable-shared/`

Pieces the editable and read-only components both need. The rule for this folder: only things with
NO props (pure functions, types) or a small FIXED prop set that does not grow when either component
changes. The two feature components, their chips, their menus and their prop interfaces stay
separate on purpose — sharing those would produce one component with many props, which is what this
design is trying to avoid.

| File | Contents |
| --- | --- |
| `autocompletable-shared.utils.ts` | `copyTextToClipboard` — was byte-identical in both folders. |
| `autocompletable-shared.models.ts` | `ItemDisplayFunction<T>`, `RenderItemDetails<T>`, and `ChipMenuItemConfig<TContext>`. |
| `AutoCompleteItemDetailsDialog.tsx` | The details dialog + its generic key/value fallback. Five fixed props. |

`ChipMenuItemConfig` is generic over the menu CONTEXT, not over the item type — that is what lets
one config shape serve two unrelated menus. Each folder re-exports its own named alias
(`AutoCompleteChipMenuItemConfig<T>` / `AutoCompleteReadOnlyChipMenuItemConfig<T>`) so call sites
read unchanged and each menu still only sees its own actions.

Trade-off, recorded deliberately: dropping either component into another codebase now means taking
this folder too — three folders instead of two self-contained ones. Kept small and dependency-light
(one `StyledDialogContent` import) so that stays cheap.

## Read-only display: `components/auto-completable-textarea-read-only/`

A separate, view-only component — deliberately NOT a `readOnly` flag on the editable text area,
which is already busy with contentEditable mechanics; folding both in would have traded readability
for reuse. Nothing is imported from the editable folder, so this one can be dropped in on its own.

| File | Responsibility |
| --- | --- |
| `AutoCompletableTextAreaReadOnly.tsx` | Main: takes a `text` string, scans it with `getItemRegex()`, renders matches as chips and the rest as plain text. |
| `AutoCompleteReadOnlyChip.tsx` | The clickable chip + its menu. |
| `AutoCompleteReadOnlyChipMenu.tsx` | `getDefaultReadOnlyChipMenuItems()`: View details / Copy / Copy display. Data-driven, override via `chipMenuItems`. |
| `AutoCompleteReadOnlyDetailsDialog.tsx` | "View details" dialog, reusing the shared `StyledDialogContent`. |
| `*.models.ts` / `*.utils.ts` | Types; `splitTextByItemRegex` + a local `copyTextToClipboard`. |

Key points:
- `getItemRegex: () => RegExp` takes NO argument — the regex describes the id FORMAT, which must be
  known before any item exists to match against. It must be unanchored (`^…$` can never match inside
  a sentence); `splitTextByItemRegex` builds a fresh `g`-flagged copy per scan so a caller-held
  regex never has its `lastIndex` mutated, and steps over zero-length matches.
- `resolveItem(matchedText)` maps an id to its item. An id that resolves to nothing STILL becomes a
  chip — dashed amber border + warning triangle — so a stale reference is visible rather than
  silently blending into the text. Its View details / Copy entries disable themselves; Copy display
  still works (an unresolved chip displays its raw matched text, which is valid to copy).
- Copy copies `itemCopyContentFunction(item)`; Copy display copies exactly what the chip shows
  (the `itemDisplayFunction` result). `matchedText` (the raw id) stays on the menu context for
  custom entries.
- Styling hooks: `className` (whole surface), `textClassName` (plain runs), `chipClassName`,
  `unresolvedChipClassName`.
- `showOriginal` skips the scan entirely: the whole string stays one plain-text run, so raw ids
  show as ordinary text and nothing becomes a chip.
- Demos: `_components/AutoCompleteReadOnlyDemo.tsx` (four examples: two known ids; multi-line with an
  unknown id; no ids at all plus a restyled surface; scanned vs `showOriginal` side by side) and
  `_components/AutoCompleteMoreExamplesDemo.tsx` (read-only with the Teammate type matched by email
  regex; a custom menu entry; a custom details body; the editable component with a custom menu entry
  and the same custom body; the editable component with the Teammate type on trigger `@`).
- `_components/AutoCompleteShowOriginalDemo.tsx` drives BOTH components from one `showOriginal`
  checkbox: ON means ids are left as raw text instead of being auto-converted to chips.

## Typing model: generic component, concrete callbacks

The component (and every internal piece: dropdown, chip, chip menu, details dialog, the segment
types) is generic over `T` and knows NOTHING about the item shape. Every callback you hand it is
written against the CONCRETE type — `(item: Gist) => ...`, never `<T>(item: T) => ...`. Call sites
pin the generic explicitly (`<AutoCompletableTextArea<Gist> ... />`), so TypeScript checks the
callbacks against that type.

Do NOT write a "generic" callback that casts internally (`(item as Gist).alias`): it compiles for
ANY item type and fails at runtime instead of at the call site. Verified: handing Gist callbacks to
`AutoCompletableTextArea<Teammate>` is a compile error on every mismatched prop.

## Key props (all item-specific behavior is injected)

- `items: T[]` — full local list. No remote search, no pagination.
- `filterFunction(item, filter)` — dropdown search filtering.
- `itemDisplayFunction(item)` — chip label text.
- `itemTransformFunction?(item)` — "real" id text; used for clipboard copy/cut and id detection. Falls back to `itemDisplayFunction`.
- `getItemRegex?()` — the regex that identifies an id in plain text, the SAME contract as the
  read-only display's prop of the same name, so both components are configured alike. Each match is
  looked up against `items` (keyed by `itemTransformFunction`, falling back to
  `itemDisplayFunction`); a match that resolves to a real item becomes a chip, one that resolves to
  nothing is left as plain text — the editable component never shows a chip for an item it does not
  have. Omit to disable hydration. Replaced the old `getItemIdPrefix`, whose silent
  `token.startsWith(prefix)` guard skipped items without warning.
- `renderItemOption?/renderItemDetails?` — dropdown row / details dialog body renderers.
- `isItemDisabled?(item)` — return true and that dropdown row is not selectable. Passed straight to
  cmdk's `CommandItem disabled`, which blocks click/Enter AND skips the row during arrow
  navigation; `onSelect` also guards. Omit to leave every item selectable.
  It ALSO marks existing chips: a chip whose item is disabled (hydrated from text, or disabled
  after it was picked) renders a triangle warning icon before its label plus an amber border,
  instead of silently looking fine. Such a chip stays clickable so the menu can Edit or Remove it.
  The warning classes are placed before `chipClassName` in the `cn(...)` call, so tailwind-merge
  lets a caller-supplied border/background win (verified: `chipClassName="border-red-500"` beats
  the amber border while the icon still shows).
- `triggerKey?` (default `':'`), `className`, `selectItemClassName`, `chipClassName`, `placeholder`, `searchPlaceholder`, `emptyText`, `disabled`, `chipMenuItems?`, `onBlur`, `id`.
- `showClearButton?` (default `true`), `clearButtonClassName?`.
- `showOriginal?` turns OFF the automatic id scan, on BOTH passes — the incoming value and the
  blur-time one — so raw text stays raw. A dropdown pick inserts the `itemTransformFunction` text as
  PLAIN TEXT (not a chip), so while the flag is on nothing on screen is a chip. That insertion goes
  in as a text node followed by a re-parse, which keeps the caret after the inserted text rather
  than re-mounting, and it is bracketed so it forms its own undo entry. The flag rides on
  `hydrationRef` so the stable blur handler reads the current value.
  It is also REACTIVE: a dedicated effect watches the flag and converts the CURRENT content in
  place, both ways — ON flattens chips via `flattenAutoCompleteValue`, OFF re-scans via
  `hydrateAutoCompleteValue`. It reads the content from the DOM (not `render.segments`, which is
  intentionally stale between structural changes), skips work when either helper returns its input
  reference unchanged, and only touches the caret when the editor actually has focus, so a toggle
  elsewhere on the page cannot steal it. The conversion is lossless for the submitted string but
  emits a new value, which dirties a react-hook-form field.

## Clear button

`AutoCompleteClearButton` is rendered as a SIBLING of the editable surface (never inside it, or the
browser would treat it as editable content). Clicking it calls `commitStructural([], { type: 'end' })`,
which wipes text and chips and emits `[]` through `onValueChange` — so react-hook-form (controlled)
and the uncontrolled wrapper's `onChange` both see the cleared value with no special-casing.

Two details that matter:
- `onMouseDown` is `preventDefault()`ed so the editor never blurs. That both skips a pointless blur
  hydration pass over content about to be wiped, and leaves the caret in the editor ready to type.
- Visibility is CSS-driven, not state-driven: the editor carries `peer` + the live `data-empty`
  attribute, and the button carries `peer-data-[empty=true]:hidden`. This is deliberate — emptiness
  must reflect the DOM the user is typing into, and `render.segments` is intentionally stale during
  plain typing. Do NOT "fix" this by deriving visibility from `render.segments` (it would be wrong
  until the next structural change) nor by adding state in `onInput` (a re-render per keystroke).
  `handleInput` keeps `data-empty` current imperatively; React does not clobber it because the JSX
  value only changes on remount.

## Chip menu copy entries

`AutoCompleteChipMenuContext<T>` exposes `itemServerText` (the `itemTransformFunction` result, e.g.
the id), `itemDisplayText` (the chip label), and a `copyText(text)` helper backed by
`copyTextToClipboard` in the utils (async Clipboard API with a hidden-textarea + `execCommand`
fallback for non-secure origins). The default "Copy" entry copies `itemServerText`, "Copy display"
copies `itemDisplayText`. The `react-hot-toast` "Copied." toast lives in `AutoCompleteChipMenu.tsx`
(the swappable defaults layer), NOT in the shared util — that keeps the component droppable into a
codebase with a different toast library.

## Core mechanism: contentEditable + remount-on-structural-change

A plain `<textarea>` cannot render chips, so the surface is a `contentEditable` div styled like the
shadcn Textarea. The hard part is React vs. browser ownership of the DOM. The rule:

- **Plain typing never re-renders.** The browser owns the DOM. `onInput` parses the DOM back into
  segments (`parseEditorDom`) and emits via `onValueChange`, but does NOT setState. The caret is
  never disturbed. React's vdom for the children goes stale on purpose and is never re-applied.
- **Structural changes fully remount the surface.** Chip insert/replace/remove, incoming external
  value, and blur hydration go through `commitStructural(segments, caret)` which bumps
  `render.key`. The editor div has `key={render.key}`, so React rebuilds the whole children tree
  from segments (guaranteeing DOM == state), then a `useLayoutEffect` on `render.key` restores the
  caret (`PendingCaret`: `after-chip` [+ optional `offsetIntoNext`], `end`, or `none` — `none`
  skips focus entirely, used by blur hydration so focus is not stolen back).
- **Echo suppression.** `lastEmittedRef` holds the last value this component emitted. The `[value]`
  effect ignores incoming values that are content-equal to it (`areAutoCompleteValuesEqual`),
  otherwise every keystroke would remount and drop the caret. CRITICAL: react-hook-form
  deep-clones values, so item equality uses lodash `isEqual`, not reference equality. If you ever
  see the caret jumping to the start on every keystroke, this equality check regressed.
- **Chip identity in the DOM.** Chip wrapper spans carry `data-autocomplete-chip-id`. `chipItemsRef`
  (Map chipId→item) is the source of truth when re-parsing; a chip whose id is missing from the
  map simply disappears from the parsed value (that's how menu "Remove" works: delete from map,
  re-parse, commit). Backspace deletes a chip atomically because the span is `contentEditable={false}`.

## Dropdown open/insert flow

1. `onKeyDown` sees `triggerKey` (no ctrl/meta/alt) → `preventDefault()` (the trigger char is never
   typed), saves the caret `Range` into `insertRangeRef`, computes the caret rect relative to the
   wrapper (`getCaretPositionInWrapper`) and opens the dropdown anchored there (absolute-positioned
   `PopoverAnchor` span inside the `relative` wrapper).
2. Selection (click or Enter): a temporary marker element (`data-autocomplete-insert-marker`) is
   inserted at the saved range, the DOM is parsed with the marker standing in for the new chip,
   then committed. If no text segment follows the chip, a `' '` text segment is appended and the
   caret goes 1 char into it (`offsetIntoNext: 1`) so typing continues naturally.
3. Escape / outside click: close, refocus the editor, restore the saved range.
4. Edit flow (chip menu → Edit): dropdown opens anchored at the chip element; selection swaps the
   item under the same chipId in `chipItemsRef` and re-parses.

## Clipboard

- `onCopy`/`onCut`: `preventDefault()`, serialize `selection.getRangeAt(0).cloneContents()` through
  `parseEditorDom` (it accepts a `DocumentFragment`) and write `text/plain` where chips become
  `itemTransformFunction(item)`. Cut then `deleteContents()` + re-emit.
- `onPaste`: `preventDefault()`, insert clipboard `text/plain` as a text node manually. This both
  keeps pasted ids as plain text (until blur/reload hydrates them) and blocks the browser's HTML
  paste from re-inserting dead chip markup (which would also duplicate `data-autocomplete-chip-id`s
  and corrupt parsing).

## Id detection / hydration (`hydrateAutoCompleteValue`)

Scans only text segments. Candidates come from `getItemRegex()` (a fresh `g`-flagged copy per scan,
so a caller-held regex never has its `lastIndex` mutated); each match is resolved back to an item
through the text -> item map built from `items`, keyed by `resolveItemText`. A match that resolves
to nothing is LEFT AS TEXT, and text that two or more items serialize to is treated as ambiguous
and also left as text. Returns the ORIGINAL array reference when nothing matched (callers rely on
that identity check). Runs:
1. **On mount / true external value change** (the `[value]` effect). If hydration changed anything
   the hydrated value is emitted back so the form state gets the chips.
2. **On every input** (`handleInput`) — typing, pasting, cutting; switched off by the
   `updateOnBlur` prop, which reverts to blur-only detection. The match the caret is sitting in
   (or immediately against) is passed as `protectedCaret` and skipped: converting an id under the
   cursor would pull the text out from under it, and the id may not be finished yet. So an id chips
   as soon as the caret moves off it, and a paste chips every id except one ending exactly at the
   caret. Cost is one regex pass next to the DOM parse that already ran — measured at ~0.4 ms
   median (1.4 ms max) per keystroke over a 7k-character document holding 181 chips. The expensive
   part, re-mounting the surface, only runs when something actually converts.
3. **On blur** (`handleBlur`): re-parse DOM → hydrate → `commitStructural(..., { type: 'none' })`.
   This is what catches the id left protected at the caret. Skipped when `event.relatedTarget` is
   still inside the wrapper or the dropdown is open — otherwise the remount would kill the chip
   menu / dropdown that is opening mid-interaction.

The typing-time scan is what needs `readEditorDom` (the caret-aware form of `parseEditorDom`) and
the `'text-offset'` `PendingCaret`: the caret is translated DOM -> segment space on the way in, and
back to an absolute character offset on the way out. Hydration is length-preserving in that space
(a chip is only ever created from text equal to its own serialization), so the offset still points
at the same character after the conversion, and `placeCaretAtAbsoluteTextOffset` walks the
re-mounted DOM to put the caret back — the user keeps typing mid-sentence without noticing.
The scan is skipped while `showOriginal` is on, while an IME composition is in flight, while the
dropdown is open, and whenever the caret cannot be resolved to a text node.

## autoFocus

`autoFocus` focuses the surface and drops the caret at the end, once — React's own `autoFocus` does
nothing here because the surface is a contentEditable div, not an `<input>`.

"Once" is the first moment the component is ELIGIBLE (`autoFocus` on, `disabled` off), not
literally mount, which is why the effect depends on both flags rather than running mount-only: a
text area that mounts disabled cannot be focused then, and a mount-only effect would leave it never
focused at all. `didAutoFocusRef` is what holds it to a single shot, so a prop that flips back and
forth does not re-focus. Demoed by `_components/AutoCompleteDialogFocusDemo.tsx` on the test page.

Two things it has to get right, both learned the hard way:
- **It runs two animation frames out**, not synchronously. A Radix dialog claims focus for its
  content when it opens, after this effect runs, and lands on the first tabbable thing inside —
  which, with a hydrated initial value, is a CHIP. Focusing synchronously just loses that race.
- **The "already focused" flag is set inside the frame callback**, not when the frames are
  scheduled. StrictMode invokes the effect twice and the first run's cleanup cancels its frames, so
  flagging up front makes the surviving run skip the focus entirely — the failure looks exactly
  like the race above.

It never fires twice. The surface re-mounts on every structural change (`render.key`), and
refocusing on those would drag focus out of a chip menu or dropdown mid-use.

## z-index inside a dialog

Every popper this feature portals to `<body>` carries `z-[200]`: the chip menu (editable and
read-only) and the caret-anchored dropdown. The shadcn defaults are `z-50`, and this project's
dialog sits at `z-150` (`components/ui/dialog.tsx`), so a text area used INSIDE a dialog rendered
its menus underneath it — open in the DOM, `isVisible()` true, but painted under the dialog panel
and unclickable (`elementFromPoint` at the menu's centre returns the dialog). Radix copies the
content's computed z-index onto the popper wrapper, so setting it on the content is enough.
`components/ui/select.tsx` already uses `z-[200]` for exactly this reason — same layer, on purpose.

## Undo / redo

Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (plus Ctrl+Y) are handled by the component, over a history of
VALUE snapshots — the browser's native stack cannot serve this component, because every structural
change remounts the editable surface (`render.key`) and throws that stack away, and chips are
inserted by direct DOM manipulation the browser never records. Left alone, typing was partly
undoable but a chip insertion was not undoable at all.

- `historyRef` / `historyIndexRef` hold the snapshots and the cursor; `recordHistory` is called from
  `handleInput` (typing) and `commitStructural` (every structural change).
- Consecutive typing within `HISTORY_COALESCE_MS` (600ms) collapses into ONE entry, so a single
  undo removes a word/burst rather than one character. Structural changes always get their own entry.
- A new edit after undoing drops the redo branch. `HISTORY_LIMIT` (200) caps retained snapshots.
- `isRestoringRef` stops a restore from recording itself; restores go through `commitStructural`
  with an end-of-content caret.
- An incoming external value (form reset, setValue) re-seeds the history — the previous document's
  entries are no longer meaningful.
- The key handler and `commitStructural` reach `undo`/`redo`/`recordHistory` through refs, since
  they are declared earlier; those refs are synced in the commit-phase effect, never during render.

## Focus/Radix gotchas (hard-won — do not "simplify" these away)

- `AutoCompleteDropdown` PopoverContent sets `onOpenAutoFocus`, `onCloseAutoFocus` AND
  `onFocusOutside` to `preventDefault()`. Without `onFocusOutside`, the focus-return of the closing
  chip menu instantly dismisses the Edit dropdown as an "outside focus".
- The chip's `DropdownMenu` is `modal={ false }` and its content prevents `onCloseAutoFocus`.
  Otherwise the closing menu yanks focus back to the chip button and the Edit dropdown's search
  input never keeps focus.
- The dropdown focuses its search input via ref in a `setTimeout(0)` effect (in addition to
  `autoFocus`) to win any focus race with whatever closed just before it.

## Styling notes

- Chip: rounded-full pill, `border-primary/40 bg-primary/10`, ChevronDown, no underline
  (squiggly underline was removed on request). Override via `chipClassName`.
- Dropdown list: `CommandList` has `p-2` gutter and items `px-3 py-2` (items are NOT inside a
  `CommandGroup`, which is what normally provides the gutter in shadcn).
- Placeholder: CSS `before:content-[attr(data-placeholder)]` shown when `data-empty="true"`;
  the attribute is updated imperatively in `onInput` (no re-render) and computed in JSX on remount.

## How to verify / debug

- `npx tsc --noEmit` must be clean. Dev: `npx next dev` → http://localhost:3100/test (the
  "Error retrieving favorites" console errors are unrelated — no DB in the sandbox).
- Behavior checklist: type `:` → dropdown at caret with focused search; filter shrinks list;
  ArrowUp/Down + Enter or click inserts chip; disabled rows (via `isItemDisabled`) are dimmed,
  unclickable and skipped by the arrows; typing continues right after the chip; Escape closes
  and restores the caret; chip click → Edit / Copy / Copy display / Show details / Remove; copy
  whole content → clipboard has ids; paste → plain text; blur → valid `GIST-…` ids become chips,
  unknown ids stay text; form reset re-hydrates; submit shows the id string; clear button appears
  only when there is content, wipes everything, and leaves focus in the editor.
- Playwright drove all of the above headlessly during development (chromium at
  `/opt/pw-browsers/chromium`; grant `clipboard-read`/`clipboard-write` permissions to test copy).
  Gotcha: wait for hydration (~5s on first dev-server compile) before typing, and don't include the
  trigger char in typed test strings.