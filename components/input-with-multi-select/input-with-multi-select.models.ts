import { ComponentProps, ReactNode } from 'react';

/**
 * One entry of the dropdown that sits on the left of the input.
 *
 * `queryParam` is what the nuqs flavour of the component writes to the URL, `display` is
 * what the user reads in the dropdown, and `id` is the stable key used everywhere else.
 */
export interface InputWithMultiSelectSelectOption {
  /** Stable, unique identifier of the option. Used as the dropdown item value. */
  id: string;
  /** URL query parameter this option maps to (used by `InputWithMultiSelectNuqs`). */
  queryParam: string;
  /** Human readable label rendered inside the dropdown. */
  display: string;
}

/**
 * The full value of an `InputWithMultiSelect`: what was typed AND what was selected.
 *
 * `selection` is nullable so the component stays honest when it is handed an empty option
 * list (or a form default with nothing selected yet) — the zod validator is what turns
 * "a selection is required" into an actual error.
 */
export interface InputWithMultiSelectValue {
  /** Raw text currently in the input (not trimmed — trim at the edges, e.g. in the validator). */
  input: string;
  /** The option picked in the dropdown, `null` when there is nothing to pick. */
  selection: InputWithMultiSelectSelectOption | null;
}

/**
 * What produced a value change, handed to `onValueChange` so a wrapper can tell a plain edit
 * apart from a change the component is already submitting on its own.
 *
 * `clear` (the X button) and `reset` (the `clearOnSubmit` follow-up) are compound events: the
 * component fires `onChange` for them too, so treating them as an edit would submit twice.
 */
export const INPUT_WITH_MULTI_SELECT_CHANGE_CAUSES = {
  /** The user typed in the text field. */
  input: 'input',
  /** The user picked a different option in the dropdown. */
  selection: 'selection',
  /** The user pressed the clear button — `onChange` fires alongside this. */
  clear: 'clear',
  /** The text was emptied by `clearOnSubmit` right after a submit. */
  reset: 'reset',
} as const;

export type InputWithMultiSelectChangeCause =
  (typeof INPUT_WITH_MULTI_SELECT_CHANGE_CAUSES)[keyof typeof INPUT_WITH_MULTI_SELECT_CHANGE_CAUSES];

/**
 * Every part of the component that can be restyled from the outside. Kept as its own interface
 * so the nuqs / react-hook-form wrappers can re-expose it without duplicating props.
 */
export interface InputWithMultiSelectClassNames {
  /** Wrapper around the whole control (dropdown + input + trigger). */
  containerClassName?: string;
  /** The dropdown's trigger button on the left. */
  selectClassName?: string;
  /** The dropdown's popover content. */
  selectContentClassName?: string;
  /** The clickable submit icon at the left edge, inside the input. */
  triggerClassName?: string;
  /** The clear ("X") icon at the right edge, inside the input. */
  clearClassName?: string;
}

/**
 * Props of `InputWithMultiSelect`. Both in-field icons appear once the field holds any characters
 * at all — the raw string, deliberately not the trimmed one. Whitespace is still something the
 * clear button has to be able to remove, and submitting it is a real action (it trims to empty,
 * which is how a search gets cleared). Only a genuinely empty field shows neither icon.
 */
export interface InputWithMultiSelectProps
  extends Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'defaultValue' | 'onSubmit'>,
    InputWithMultiSelectClassNames {
  /** The options rendered in the left dropdown. Never hard coded — always passed in. */
  options: InputWithMultiSelectSelectOption[];

  /**
   * Id of the option selected on mount (uncontrolled usage). Falls back to the first option
   * of `options` when omitted or when no option matches.
   */
  defaultSelectedOptionId?: string;
  /** Text the input starts with (uncontrolled usage). */
  defaultInputValue?: string;

  /**
   * Controlled value. Passing it makes the component fully controlled — pair it with
   * `onValueChange`. Leave it out for the uncontrolled behaviour (state lives inside).
   */
  value?: InputWithMultiSelectValue;
  /**
   * Fires on EVERY change: each keystroke, each dropdown change, and each clear. `cause` says
   * which, so a wrapper can avoid acting twice on the changes that also fire `onChange`.
   */
  onValueChange?: (value: InputWithMultiSelectValue, cause: InputWithMultiSelectChangeCause) => void;

  /**
   * Fires only when the user submits: Enter inside the input, or a click on the trigger icon.
   * Changing the dropdown selection alone never fires this.
   */
  onChange?: (value: InputWithMultiSelectValue) => void;

  /** Submit when Enter is pressed inside the input. Defaults to `true`. */
  submitOnEnter?: boolean;
  /** Clear the text (keeping the selection) right after a successful submit. Defaults to `false`. */
  clearOnSubmit?: boolean;
  /**
   * Block submits while the text is empty / whitespace only. Defaults to `false`, so submitting an
   * emptied input is a real event — that is how a search gets cleared (and how the nuqs flavour
   * drops its query param).
   */
  disableSubmitWhenEmpty?: boolean;

  /** Icon rendered in the trigger. Defaults to lucide's `Search`. */
  triggerIcon?: ReactNode;
  /** Accessible label of the trigger button. Defaults to `'Submit'`. */
  triggerLabel?: string;
  /** Icon rendered in the clear button. Defaults to lucide's `X`. */
  clearIcon?: ReactNode;
  /** Accessible label of the clear button. Defaults to `'Clear'`. */
  clearLabel?: string;
  /** Accessible label of the left dropdown. Defaults to `'Select an option'`. */
  selectLabel?: string;
  /** Hides the trigger icon when the whole control should be driven by Enter only. */
  hideTrigger?: boolean;
  /** Hides the clear button, leaving the user to empty the input by hand. */
  hideClearButton?: boolean;
}
