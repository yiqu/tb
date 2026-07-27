# Objective

- Be able to auto adjust table's column width by double clicking the resizer component <FormattedTableHeadResizeHandle />.

# Specs

- In FormattedTableHeader component, which is a shared component that is used by many different datasets. There is FormattedTableHeadResizeHandle. 
- User should be able to double click FormattedTableHeadResizeHandle, and it will auto resize the column based on the content of the visible content of the table.
- For example, BillsTableParentContent wraps FormattedTableHeader and the drag handler action takes place in BillsTableParentContent.
- I need this feature to work on any dataset though, newly added code or components should be easily shared across the app, and copy paste-able to other projects.
- Make use of libraries if needs to, like zustand or whatnot if needs to.
- The solution should be flexible, not tied down to a specific set of data or hardcoded stuff, it needs to be composable. Preferably the logic will live in useColumnResize.ts hook.
- After double clicking, which resizes, it should still save that to the zustand table state like how we currently do with the hook useColumnResize.ts.


# Test

- Make BillsTableParentContent work with this new feature.
- One thing to note: a table could be infinite scrolling, so just auto size to what's currently on screen or loaded. Data will be loaded with tanstack infinite query if that matters. In this app, everything is paged though, but could be infinite scrolling in the future.


# Details

- all displays should be in its file.
- all work should be componentized, with props if needed.
- this component should be in its own sub folder in /shared. So it is easily portable.
- use hooks and create hooks as needed (prefer custom hooks the most)
