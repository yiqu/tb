# Objective

- Add the feature to be able to hide and show columns for each of the tables based on their tableId.

## Details

- I want to add a feature that we should be able to hide and show columns for each table. My idea is that right now each column has a little three-dot menu. I should be able to click on the three dots. We're going to add a new option in that menu called "Hide Column". Below that, we should have an option that, when you mouse over, shows another submenu to the right side, to the left side, or to the left side, depending. Don't hard-code it to show to a certain side. That submenu should then show a list of all the possible columns. When I check a checkbox in that list of options, the column should be brought back if it's hidden, or if I actually click on it while it's already been shown, it should hide it.

- We're gonna make this thing very, very composable, so we should be able to drop into another application and be used with the setup that is very similar to the current setup of this application.

- It looks like currently in the table.store.ts file, that's where a lot of the table configuration is happening. We're going to create another store in the store folder, and the folder should be called table-columns-adjust. create another zustand store in that folder, it would be a new file. just call it table column-adjuster.store.ts.  This will obviously be persisted in local storage like the other ones are, because I want this to be very composable and not so coupled to the current table setup. We're going to have a table column show/hide configuration object, and that object is just going to be a key-value object. The key is the column ID, and the column ID is actually already defined in the @table.store.ts Just imagine that those keys are hard-coded, and we're just going to use existing stuff. The value of the key is just true/false: true is shown, false is hidden.

- the key value column show hide config object will be a type of key that is limited to the table column array's key for each table, and each table in table.store.ts has a hardcoded list of columns. So the hard coded column IDs will be available, so you can assume that list will always be hardcoded for each new table we add in the future. We can create a helper function, called getDefaultTableColumns() to get that list of hard coded IDs based on the TableId type. We do not have that right now. This is to easily get the list of default (ALL) possible column IDs for any table by their table id look up. This object's Type should be created and call it TableColumnDisplayConfiguration

- So this new zustand store's default store value should include 3 of these TableColumnDisplayConfiguration objects, because right now we have 3 table Ids. these 3 can be hardcoded, their column ids are can be gotten by getDefaultTableColumns() as the initial state. The initial display value for all the columns should be true, as they wil all be shown by default. This zustand store will have localstorage persist. and persist these TableColumnDisplayConfiguration objects.

- In the table itself, for example. BillsTableParentContent.tsx, we get the total width of the table via const totalColumnsWidth = useTotalColumnsWidth('bills'); we will have to make some adjustments to that hook because columns can now be hidden.

- The columns right now are also ordered, as like the hook:  const columnsOrderedByOrdinal = useColumnOrdinalObject('bills'); So we will make this behavior: when a column is hidden, and when it is un-hidden it should automatically goes to the end of its ordering, the last position. So update the position accordingly when a hidden column is brought back into view.

- as u can see all the tables, we get the columns via "columnsSorted", and that is just grabbing the hard coded table column IDs in table.store.ts. Well with this feature, the columns to map from should come from a hook, and return only the columns that are toggled shown.

- Make sure all the logic are extracted to helper functions or hooks, prefer hooks. So it is composable and easy to drop in to other apps.

- the logic to decide whats hidden is use the getDefaultTableColumns(), by its tableId, depending what table it is, then go through that and check the TableColumnDisplayConfiguration object for that table id, and then decide if its supposed to show or not.

- The column display adjust menu in the column's 3-dot menu should show ALL the columns, using getDefaultTableColumns(tableId), and the menu item should be a checkbox menu item, when clicked on, it will check or uncheck that option, which in turn sets the corresponding TableColumnDisplayConfiguration object with the key value to true or false for that column menu option. if the column menu option is not checked, make it dimmer so its visibly easy to tell.

- make sure the helper functions will be in its own file, and hooks are in their own file, and in the hooks folder with meaningful names. Hooks should have good comments as well.

- again, once this is done for one table, it should be easy and compose-able that the other 2 tables will be easy copy and paste most likely just with different tableId.

- This feature and work should be able to work with the FormattedTableHeader.tsx if needs to be, because we use that in the tables already in the app.


## References

- TableId: the type tableId in table.store.ts . This is used to determine what table are we on. 

## Test

- After done, spin up the dev server with some fake data if possible, and take some screenshots in the final report.