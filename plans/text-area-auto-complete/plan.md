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