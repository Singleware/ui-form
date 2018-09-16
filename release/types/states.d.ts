/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Form states interface.
 */
export interface States {
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
}
