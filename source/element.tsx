/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as JSX from '@singleware/jsx';

/**
 * Form element.
 */
@JSX.Describe('swe-form')
@Class.Describe()
export class Element extends HTMLElement {
  /**
   * Header slot element.
   */
  @Class.Private()
  private headerSlot = <slot name="header" class="header" /> as HTMLSlotElement;

  /**
   * Content slot element.
   */
  @Class.Private()
  private contentSlot = <slot name="content" class="content" /> as HTMLSlotElement;

  /**
   * Footer slot element.
   */
  @Class.Private()
  private footerSlot = <slot name="footer" class="footer" /> as HTMLSlotElement;

  /**
   * Form layout element.
   */
  @Class.Private()
  private formLayout = (
    <div class="form">
      {this.headerSlot}
      {this.contentSlot}
      {this.footerSlot}
    </div>
  ) as HTMLDivElement;

  /**
   * Form styles element.
   */
  @Class.Private()
  private formStyles = (
    <style>
      {`:host {
  display: block;
}
:host > .form {
  display: flex;
  height: inherit;
  width: inherit;
}
:host([orientation='row']) > .form {
  flex-direction: row;
  align-items: center;
}
:host > .form,
:host([orientation='column']) > .form {
  flex-direction: column;
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Add all values from the specified child into the given entity.
   * @param entity Target entity.
   * @param child Child element.
   */
  @Class.Private()
  private addValues(entity: any, child: any): void {
    const values = child.value;
    if (values instanceof Object) {
      for (const name in values) {
        if (values[name] !== void 0) {
          entity[name] = values[name];
        }
      }
    }
  }

  /**
   * Add the value from the specified child into the given entity.
   * @param entity Target entity.
   * @param child Child element.
   */
  @Class.Private()
  private addValue(entity: any, child: any): void {
    if (child.name) {
      const value = child.value;
      if (value !== void 0) {
        entity[child.name] = value;
      }
    }
  }

  /**
   * Updates the specified state in the element.
   * @param name State name.
   * @param state State value.
   */
  @Class.Private()
  private updateState(name: string, state: boolean): void {
    if (state) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  /**
   * Update all element's children by the specified state.
   * @param name State name.
   * @param state State value.
   */
  @Class.Private()
  private updateChildrenState(name: string, state: boolean): void {
    for (const child of this.children as any) {
      if (name in child) {
        child[name] = state;
      }
    }
  }

  /**
   * Activate or deactivate all first-level children with submit type.
   */
  @Class.Private()
  private updateSubmitState(): void {
    const disable = this.disabled || !this.checkValidity();
    for (const child of this.children as any) {
      if (child.type === 'submit') {
        child.disabled = disable;
      }
    }
  }

  /**
   * Change event handler.
   */
  @Class.Private()
  private changeHandler(): void {
    this.updateSubmitState();
    this.updateState('empty', this.empty);
    this.updateState('invalid', !this.empty && !this.checkValidity());
  }

  /**
   * Click event handler.
   * @param event Event information.
   */
  @Class.Private()
  private clickHandler(event: MouseEvent): void {
    switch ((event.target as any).type) {
      case 'submit':
        this.submit();
        break;
      case 'reset':
        this.reset();
        break;
    }
  }

  /**
   * Keypress event handler.
   * @param event Event information.
   */
  @Class.Private()
  private keypressHandler(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement && event.code === 'Enter') {
      this.submit();
    }
  }

  /**
   * Default constructor.
   */
  constructor() {
    super();
    const shadow = JSX.append(this.attachShadow({ mode: 'closed' }), this.formStyles, this.formLayout) as ShadowRoot;
    shadow.addEventListener('slotchange', this.changeHandler.bind(this));
    shadow.addEventListener('keyup', this.changeHandler.bind(this));
    shadow.addEventListener('change', this.changeHandler.bind(this));
    shadow.addEventListener('click', this.clickHandler.bind(this) as EventListener);
    shadow.addEventListener('keypress', this.keypressHandler.bind(this) as EventListener);
  }

  /**
   * Determines whether the element is empty or not.
   */
  @Class.Public()
  public get empty(): boolean {
    for (const child of this.children as any) {
      if (!child.empty) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the element name.
   */
  @Class.Public()
  public get name(): string {
    return this.getAttribute('name') || '';
  }

  /**
   * Sets the element name.
   */
  public set name(name: string) {
    this.setAttribute('name', name);
  }

  /**
   * Gets the element value.
   */
  @Class.Public()
  public get value(): any {
    const entity = {} as any;
    for (const child of this.children as any) {
      if (child.empty) {
        continue;
      }
      if (child.unwind) {
        this.addValues(entity, child);
      } else {
        this.addValue(entity, child);
      }
    }
    return entity;
  }

  /**
   * Sets the element value.
   */
  public set value(value: any) {
    for (const child of this.children as any) {
      if (child.unwind) {
        child.value = value;
      } else if (value instanceof Object && value[child.name] !== void 0) {
        child.value = value[child.name];
      }
    }
    this.changeHandler();
  }

  /**
   * Gets the unwind state of the element.
   */
  @Class.Public()
  public get unwind(): boolean {
    return this.hasAttribute('unwind');
  }

  /**
   * Sets the unwind state of the element.
   */
  public set unwind(state: boolean) {
    this.updateState('unwind', state);
  }

  /**
   * Gets the required state of the element.
   */
  @Class.Public()
  public get required(): boolean {
    return this.hasAttribute('required');
  }

  /**
   * Sets the required state of the element.
   */
  public set required(state: boolean) {
    this.updateState('required', state);
    this.updateChildrenState('required', state);
    this.changeHandler();
  }

  /**
   * Gets the read-only state of the element.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.hasAttribute('readonly');
  }

  /**
   * Sets the read-only state of the element.
   */
  public set readOnly(state: boolean) {
    this.updateState('readonly', state);
    this.updateChildrenState('readOnly', state);
  }

  /**
   * Gets the disabled state of the element.
   */
  @Class.Public()
  public get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  /**
   * Sets the disabled state of the element.
   */
  public set disabled(state: boolean) {
    this.updateState('disabled', state);
    this.updateChildrenState('disabled', state);
    this.changeHandler();
  }

  /**
   * Gets the element orientation.
   */
  @Class.Public()
  public get orientation(): string {
    return this.getAttribute('orientation') || 'column';
  }

  /**
   * Sets the element orientation.
   */
  public set orientation(orientation: string) {
    this.setAttribute('orientation', orientation);
  }

  /**
   * Move the focus to the first child that can be focused.
   */
  @Class.Public()
  public focus(): void {
    for (const child of this.children as any) {
      if (child.focus instanceof Function && !child.disabled && !child.readOnly) {
        child.focus();
        break;
      }
    }
  }

  /**
   * Submits the form element.
   * @returns Returns true when the form has been submitted, false otherwise.
   */
  @Class.Public()
  public submit(): boolean {
    if (!this.disabled) {
      if (!this.checkValidity()) {
        this.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
      } else {
        return this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }
    return false;
  }

  /**
   * Reset all fields in the element to its initial values.
   */
  @Class.Public()
  public reset(): void {
    if (this.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }))) {
      for (const child of this.children as any) {
        if (child.reset instanceof Function) {
          child.reset();
        } else {
          if ('value' in child) {
            child.value = child.defaultValue;
          }
          if ('checked' in child) {
            child.checked = child.defaultChecked;
          }
        }
      }
      this.changeHandler();
    }
  }

  /**
   * Checks the element validity.
   * @returns Returns true when the element is valid, false otherwise.
   */
  @Class.Public()
  public checkValidity(): boolean {
    for (const child of this.children as any) {
      if (child.checkValidity instanceof Function && !child.checkValidity()) {
        return false;
      }
    }
    return true;
  }
}
