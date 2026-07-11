# Objective

- Create a standalone multi-sort configuration component.
- This component will not be used in this application, so do not make this with any of the specifics in this app, it could be used here, but this should also work anywhere else in other repos by a drop in or components / store copy paste.
- gist of this is that when sort options are checked/unchecked, dragged. these changes are stored in the zustand table-sort store, persisted in the localstorage, then when selecting it via a selector.

# Specs

- table-sort.ts. is already created with placeholder and other constants for use.
- This component should let user click on it and show a dropdown menu to click to check to turn on a sort, and checked sort options can be dragged vertically to determine the order of the sort.
- When this component is not "opened" it should be a combobox with multiple turned on. This is so that a user can easily remove a sort option by clicking the "x" clear button in the combobox.
- Then a user click this combobox to open, it should show a dropdown menu. Then it should display the SORT_ORDER_OPTIONS vertically, the displayed name should be using the SortOptionDisplayMap.
- There should be a checkbox to the left of the option, we want the user to be able to click the checkbox to add this menu option as part of the sort array. Thus, don't trigger a actual select effect when the menu item is clicked, matter of fact, the menu item display name should not fire any events when clicked. It's just text. this dropdown menu should only be closed when clicked outside. the user will be clicking the checkbox to add this sort to the sort list.
- Once a menu item is checked, the display sort of these menu items should show the "checked" items first, from the top. This will be important because the next step.
- For the options that are checked, they should have a draggable icon grip-vertical (lucide) shown at the most right-end of the menu item display. This should allow the user to drag the menu item within the area of only menu items that are checked. Dragging an item below items that are not checked should just put that item at the end of all checked items, because the unchecked items is not a droppable zone.
- The available options are already stated in table-sort.ts. There are also zustand store stuff and settings already created as a placeholder.
- The default sort array is listed in there, so when a user opens the dropdown, that default one should be showing already. DEFAULT_SORT_OPTION should always be checked, users should not be able to uncheck that default one. Don't hardcode the actual values when working these logic because DEFAULT_SORT_OPTION can be swapped to something else in the future.
- When a user checks or drags (working) in this dropdown menu, do not fire off zustand updates for every change. Fire off the zustand store update to currentSort when the dropdown menu is closed. this indicates the user has finished.
- put a small label on top of the dropdown menu when opened: that conveys to user that this is the sort order for multiple sorts of columns.
- if another item (more than 1, the 1 being the default sort option) is checked, display a button (or dropdown menu item), that looks nice as part of this dropdown menu that lets user to clear all but the default when clicked.
- then via a hook, user can get the sort array in the order the user has ordered, and there should be 2 options when getting this value. one is the raw SortConfig array, the other is a string in the format of URLSearchParam string, so it could look like search?sort=arrival_date&sort=status&sort=user_id&direction=asc&direction=asc&direction=desc (as an example). so i should be able to call a hook and get those 2 values returned.
- for persistence, setCurrentSort in the zustand should be saved in the localstorage.
- one option i want to add is that, add a prop in the component (Wherever it should be), that is "fireChangeOnClose", set this to true by default. this is that if true, then only update zustand store to make changes if user closed the dropdown menu. If this is false, then update the zustand store on every check and drag.
- this combobox should show each sort option as their display name, and its sort direction (asc or desc). this combobox's max width should be customizable, so the display is longer, then truncate ellipses it. 
- when done, put this in the /app(base)/test page so i can see it in action.


# Test

- to verify this is working: an sort array of

```js
const arr = [
  {
    field: 'arrival_date',
    direction: 'asc',
  },
   {
    field: 'user_id',
    direction: 'desc',
  },
   {
    field: 'status',
    direction: 'desc',
  },
];
```

should produce the following search param string:

```js
 search?sort=arrival_date&sort=user_id&sort=status&direction=asc&direction=desc&direction=desc 
 ```

Each of the items in that array is displayed in the string with the sort key, in ORDER. then the direction is then displayed in that string in ORDER.


# Details

- Use shadcn components
- for drag and drop, use @hello-pangea/dnd library.
- all displays should be in its file.
- all work should be componentized, with props if needed.
- this should be customizable, for example className prop can be passed in to change things if need to be with cn() util function.
- this component should be in its own sub folder in /shared. So it is easily portable.
- use hooks and create hooks as needed (prefer custom hooks the most)


# Extra

- Create a new tanstack query action file, that uses the hook we created above to get the 2 values (array and searchparams string). then use this the search param string to be part of a fake (example) GET request API URL. like:  search?sort=arrival_date&sort=user_id&sort=status&direction=asc&direction=desc&direction=desc 
