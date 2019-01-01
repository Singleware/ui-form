/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as OSS from '@singleware/oss';

/**
 * Form stylesheet class.
 */
@Class.Describe()
export class Stylesheet extends OSS.Stylesheet {
  /**
   * Host styles.
   */
  @Class.Private()
  private host = this.select(':host');

  /**
   * Form styles.
   */
  @Class.Private()
  private form = this.select(':host>.form');

  /**
   * Row form styles.
   */
  @Class.Private()
  private rowForm = this.select(':host([orientation="row"])>.form');

  /**
   * Column form styles.
   */
  @Class.Private()
  private columnForm = this.select(':host([orientation="column"])>.form, :host>.form');

  /**
   * Default constructor.
   */
  constructor() {
    super();
    this.host.display = 'block';
    this.form.display = 'flex';
    this.form.width = 'inherit';
    this.form.height = 'inherit';
    this.rowForm.flexDirection = 'row';
    this.rowForm.alignItems = 'center';
    this.columnForm.flexDirection = 'column';
  }
}
