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
transform function, paste is forced to plain text, and existing item ids in text are converted
to chips on load and on blur.

## File map

Component suite (shareable, generic over item type `T`) — `components/auto-completable-textarea/`:

| File | Responsibility |
| --- | --- |
| `AutoCompletableTextArea.tsx` | Main controlled component. Owns the contentEditable surface, trigger-key handling, clipboard handlers, blur id-detection, and orchestrates dropdown / chips / details dialog. |
| `AutoCompletableTextAreaUncontrolled.tsx` | Dumb wrapper: `initValue` + `onChange`, holds state internally, renders the controlled one. |
| `AutoCompleteDropdown.tsx` | Caret-anchored Popover + cmdk Command: search input on top (auto-focused), scrollable filtered list, ArrowUp/Down + Enter, Escape/outside-click closes. |
| `AutoCompleteItemChip.tsx` | One autocompleted item inside the text area: `contentEditable={false}` pill span + DropdownMenu (the chip popover menu). |
| `AutoCompleteChipMenu.tsx` | `getDefaultChipMenuItems()`: data-driven default menu (Edit / Show details / Remove). Pass a custom array via `chipMenuItems` prop to add/remove/reorder entries. |
| `AutoCompleteItemDetailsDialog.tsx` | "Show details" dialog. Reuses the app-wide `shared/dialogs/StyledDialogContent`. Custom body via `renderItemDetails`, generic key/value dump fallback. |
| `autocompletable-textarea.models.ts` | All types: segments, value, props, chip menu item config + context. |
| `autocompletable-textarea.utils.ts` | DOM parsing, hydration scan, caret helpers, serialization helpers. |

Demos — `app/(base)/test/`:
- `_components/AutoCompleteTextAreaDemo.tsx` — controlled + react-hook-form (Controller) + Zod, Gist list, trigger `:`. Default form value contains a raw `GIST-3333333` to demo load-time hydration. Submit shows the server string.
- `_components/AutoCompleteTextAreaUncontrolledDemo.tsx` — uncontrolled + bonus `Teammate` type, trigger `@`.
- `_components/test.utils.ts` — `Gist`/`TEST_GISTS` (ids are `GIST-1111111`…`GIST-9999999`), `Teammate`/`TEST_TEAMMATES`, and the callback fns: `itemFilterFunction`, `textAreaItemDisplay`, `textAreaItemTransformForServerFunction` (returns `item.id`), `getAutocompleteItemIdPrefix` (returns `'GIST-'`), teammate equivalents.
- `_components/Utils.tsx` — dropdown row renderers (`ItemOptionDisplay`, `TeammateOptionDisplay`).

## Value model

The value is NOT a string. It is `AutoCompleteValue<T> = AutoCompleteSegment<T>[]` where a segment
is `{ kind: 'text', text }` or `{ kind: 'item', chipId, item }`. `chipId` is a unique per-insert id
(`generateChipId()`) so the same item can appear twice. Helpers:
- `autoCompleteValueToText(value, itemToText)` — flatten to a string. Pass `itemDisplayFunction`
  for what the user sees, or `itemTransformFunction` (e.g. `item => item.id`) for the server string.
- This value flows through react-hook-form as the field value; derive the server string at submit.

## Key props (all item-specific behavior is injected)

- `items: T[]` — full local list. No remote search, no pagination.
- `filterFunction(item, filter)` — dropdown search filtering.
- `itemDisplayFunction(item)` — chip label text.
- `itemTransformFunction?(item)` — "real" id text; used for clipboard copy/cut and id detection. Falls back to `itemDisplayFunction`.
- `getItemIdPrefix?(item)` — prefix all ids start with (e.g. `'GIST-'`). Presence ENABLES hydration (load + blur). Ids that don't start with their own prefix are skipped by the scan.
- `renderItemOption?/renderItemDetails?` — dropdown row / details dialog body renderers.
- `triggerKey?` (default `':'`), `className`, `selectItemClassName`, `chipClassName`, `placeholder`, `searchPlaceholder`, `emptyText`, `disabled`, `chipMenuItems?`, `onBlur`, `id`.

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

Scans only text segments. Performance: builds `token = itemTransformFunction(item)` per item and a
set of prefixes; the text is searched with `indexOf(prefix)` — each prefix occurrence is the only
candidate position where full tokens are compared (longest match wins). Returns the ORIGINAL array
reference when nothing matched (callers rely on that identity check). Runs:
1. **On mount / true external value change** (the `[value]` effect). If hydration changed anything
   the hydrated value is emitted back so the form state gets the chips.
2. **On blur** (`handleBlur`): re-parse DOM → hydrate → `commitStructural(..., { type: 'none' })`.
   Skipped when `event.relatedTarget` is still inside the wrapper or the dropdown is open —
   otherwise the remount would kill the chip menu / dropdown that is opening mid-interaction.

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
  ArrowUp/Down + Enter or click inserts chip; typing continues right after the chip; Escape closes
  and restores the caret; chip click → Edit / Show details / Remove; copy whole content → clipboard
  has ids; paste → plain text; blur → valid `GIST-…` ids become chips, unknown ids stay text;
  form reset re-hydrates; submit shows the id string.
- Playwright drove all of the above headlessly during development (chromium at
  `/opt/pw-browsers/chromium`; grant `clipboard-read`/`clipboard-write` permissions to test copy).
  Gotcha: wait for hydration (~5s on first dev-server compile) before typing, and don't include the
  trigger char in typed test strings.