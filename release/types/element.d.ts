/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Form element interface.
 */
export interface Element extends HTMLFormElement {
  /**
   * Form value entity.
   */
  value: any;
  /**
   * Determines whether the form properties must be unrolled.
   */
  unwind: boolean;
  /**
   * Required state.
   */
  required: boolean;
  /**
   * Read-only state.
   */
  readOnly: boolean;
  /**
   * Disabled state.
   */
  disabled: boolean;
  /**
   * Orientation mode.
   */
  orientation: string;
  /**
   * Checks the form validity.
   * @returns Returns true when the form is valid, false otherwise.
   */
  checkValidity: () => boolean;
  /**
   * Reports the form validity.
   * @returns Returns true when the form is valid, false otherwise.
   */
  reportValidity: () => boolean;
  /**
   * Reset all form fields to its initial values.
   */
  reset: () => void;
  /**
   * Appends the specified children into this form.
   * @param children Children instances.
   */
  append: (...children: JSX.Element[]) => void;
  /**
   * Remove all form children.
   */
  clear: () => void;
}
