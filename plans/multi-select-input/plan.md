# Objective

- Add a new type of input that lets you select a option from a dropdown, then when you type text into the input field, the selection is taken into account as well.

## details

- the input will have 3 components, left side is a dropdown selection, middle part is the text input field, then right side is the trigger (clickable) lucide-icon that conveys clicking this will trigger a submit or onchange manually. The icon should be inside the input field to the right.
- The selection to the left (beginning) of this input is a list of options (do not hard code, let it take in a list, object type InputWithMultiSelectSelectOption, so it will be InputWithMultiSelectSelectOption[]). 
- there will be a default, so InputWithMultiSelect component will have a prop to take in a default selection, if not passed in, use the first one of the InputWithMultiSelectSelectOption[] list that is passed in.
- the default html input's props should be extended so users can use all those props, similar to HFInputFieldProps.
- pressing enter should trigger the onSubmit, this should come by default?
- Create a nuqs ready version of this, can use this with nuqs to update the url query params. In this nuqs ready component, InputWithMultiSelectNuqs.tsx, the query param this will update comes from the selection item, InputWithMultiSelectSelectOption, in that list of objects, there is a key called queryParam, so whatever  user has selected, that queryParam will be used. The nuqs extra options can just be passed in via props (spread should work?), so nuqs options (Options) like throttleMs, scroll, history, etc can be just passed in as a object to use? (verify this works, if not, then don't worry about this feature.)
- also create a version of this that works with react-hook-forms, with the react-hook-forms version the defaultValue or the value shape should be the InputWithMultiSelectValue object, not a string anymore because the selection has to be taken into account now. so create the input object shape that is needed (verify this logic i stated here for react hook forms, and InputWithMultiSelectValue will work.).
- create a zod validator, so it can be used to validation if need to be. the InputWithMultiSelectSelectOption is required (user has to have a selection made), and input is required after trim.
- for react hook form version of the component, onChange can still be exposed, but optional, so just in case something wants to be done when value changes.
- for uncontrolled version: changing the selection should not trigger onChange though.
- pressing enter when typing in the input will trigger onChange, and if its in the InputWithMultiSelectNuqs, it will trigger the query update via nuqs, thus setting the params.
- className should be able to be passed in to customize the input, trigger icon, and the dropdown selection part.
- dark mode ready.



# Note
- all display components should be in its own file, default export.
- create a main folder in "components" folder as parent folder
- nuqs specific one should be located in the nuqs sub folder
- react hook forms one should be located in the RHF sub folder
- the default one should be uncontrolled, works with onChange callback to see the value and its selection
- componentize everything, and make the props as type of interface.
- extract helper functions into its own util files with proper names and location in proper location.
- should be composable, and easy for drop into another project to use.
- decoupling is very important, this should be able to be used with other use scenarios and use cases easily with decoupled and composable design.


# Test
- these inputs will be used for entering IDs for searching (querying).
- The testing: pass in a list of InputWithMultiSelectSelectOption, that is [ { id: "userId", queryParam: "userId", display: "User ID"  }, { id: "requestId", queryParam: "requestId", display: "Request ID"  }, { id: "triId", queryParam: "triId", display: "Tri ID"  }  ] 
- Add the testing components on /test page. 
- Show the nuqs-ready component InputWithMultiSelectNuqs, pressing enter when typing into the input will cause the query params to update, using the nuqs-ready component. With different options passed in, history, shallow, throttleMs, so probably have like 3-4 different test components for nuqs testing.
- also show one that works with react-hook-forms, with a default selection and default input value passed in.
- show one that is uncontrolled, no nuqs nor react-hook-forms. Spitting out InputWithMultiSelectValue


## Shape interfaces, naming
- This input component should be called InputWithMultiSelect, its props can be called Props if it lives in the same component, or call it InputWithMultiSelectProps if elsewhere.
- the list of options it takes in will be InputWithMultiSelectSelectOption: a interface that has a id, queryParam, and display.
- The nuqs ready component using InputWithMultiSelect under the hood should be called InputWithMultiSelectNuqs
- the react hook forms component using InputWithMultiSelect under the hood should be called HFInputWithMultiSelect
- the object shape that holds the input value and the selection should be called InputWithMultiSelectValue, which is a object that has the string input from the input, and the selection which is "InputWithMultiSelectSelectOption".
