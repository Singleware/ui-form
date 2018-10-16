/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Element } from './element';
import { States } from './states';

/**
 * Form template class.
 */
@Class.Describe()
export class Template extends Control.Component<Properties> {
  /**
   * Form states.
   */
  @Class.Private()
  private states = {
    unwind: false,
    required: false,
    readOnly: false,
    disabled: false
  } as States;

  /**
   * Header element.
   */
  @Class.Private()
  private headerSlot = <slot name="header" class="header" /> as HTMLSlotElement;

  /**
   * Content element.
   */
  @Class.Private()
  private contentSlot = <slot name="content" class="content" /> as HTMLSlotElement;

  /**
   * Footer element.
   */
  @Class.Private()
  private footerSlot = <slot name="footer" class="footer" /> as HTMLSlotElement;

  /**
   * Wrapper element.
   */
  @Class.Private()
  private wrapper = (
    <div class="wrapper">
      {this.headerSlot}
      {this.contentSlot}
      {this.footerSlot}
    </div>
  ) as HTMLDivElement;

  /**
   * Form styles.
   */
  @Class.Private()
  private styles = (
    <style>
      {`:host {
  width: 100%;
  height: 100%;
}
:host > .wrapper {
  display: flex;
  height: inherit;
  width: inherit;
}
:host > .wrapper[data-orientation='row'] {
  flex-direction: row;
}
:host > .wrapper,
:host > .wrapper[data-orientation='column'] {
  flex-direction: column;
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Form skeleton.
   */
  @Class.Private()
  private skeleton = (
    <form slot={this.properties.slot} class={this.properties.class} method={this.properties.method || 'POST'}>
      <div>{this.children}</div>
    </form>
  ) as Element;

  /**
   * Sets the specified property to all buttons in the specified element slot.
   * @param slot Element slot.
   * @param type Button type.
   * @param property Expected property.
   * @param value New property value.
   */
  @Class.Private()
  private setButtonsProperty(slot: HTMLSlotElement, type: string, property: PropertyKey, value: any): void {
    Control.listChildrenByProperty(slot, property, (child: any) => {
      if ('type' in child && child.type === type) {
        child[property] = value;
      }
    });
  }

  /**
   * Change event handler.
   */
  @Class.Private()
  private changeHandler(): void {
    const disable = !this.skeleton.reportValidity();
    if (!this.states.disabled) {
      this.setButtonsProperty(this.headerSlot, 'submit', 'disabled', disable);
      this.setButtonsProperty(this.footerSlot, 'submit', 'disabled', disable);
    }
  }

  /**
   * Invalid event handler.
   * @param event Event information.
   */
  @Class.Private()
  private invalidHandler(event: Event): void {
    event.preventDefault();
  }

  /**
   * Submit event handler.
   * @param event Event information.
   */
  @Class.Private()
  private submitHandler(event: Event): void {
    if (!this.skeleton.hasAttribute('action')) {
      event.preventDefault();
    }
  }

  /**
   * Bind event handlers to update the custom element.
   */
  @Class.Private()
  private bindHandlers(): void {
    this.skeleton.addEventListener('keyup', this.changeHandler.bind(this));
    this.skeleton.addEventListener('change', this.changeHandler.bind(this), true);
    this.skeleton.addEventListener('invalid', this.invalidHandler.bind(this), true);
    this.skeleton.addEventListener('submit', this.submitHandler.bind(this));
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
    this.bindComponentProperties(this.skeleton, [
      'value',
      'unwind',
      'required',
      'readOnly',
      'disabled',
      'orientation',
      'checkValidity',
      'reportValidity',
      'reset',
      'append',
      'clear'
    ]);
  }

  /**
   * Assign all elements properties.
   */
  @Class.Private()
  private assignProperties(): void {
    this.assignComponentProperties(this.properties, ['name', 'value', 'unwind', 'required', 'readOnly', 'disabled']);
    this.orientation = this.properties.orientation || 'column';
    this.changeHandler();
  }

  /**
   * Default constructor.
   * @param properties Form properties.
   * @param children Form children.
   */
  constructor(properties?: Properties, children?: any[]) {
    super(properties, children);
    DOM.append((this.skeleton.firstChild as HTMLDivElement).attachShadow({ mode: 'closed' }), this.styles, this.wrapper);
    this.bindHandlers();
    this.bindProperties();
    this.assignProperties();
  }

  /**
   * Get value entity.
   */
  @Class.Public()
  public get value(): any {
    const entity = {} as any;
    Control.listChildrenByProperty(this.contentSlot, 'value', (field: any) => {
      if ('unwind' in field && field.unwind === true) {
        const values = field.value;
        for (const name in values) {
          if (values[name] !== void 0) {
            entity[name] = values[name];
          }
        }
      } else if ('name' in field && field.name) {
        const value = field.value;
        if (value !== void 0) {
          entity[field.name] = value;
        }
      }
    });
    return entity;
  }

  /**
   * Set value entity.
   */
  public set value(entity: any) {
    Control.listChildrenByProperty(this.contentSlot, 'value', (field: any) => {
      if ('unwind' in field && field.unwind === true) {
        field.value = entity;
      } else if ('name' in field && field.name in entity) {
        field.value = entity[field.name];
        delete entity[field.name];
      }
    });
    this.changeHandler();
  }

  /**
   * Get form name.
   */
  @Class.Public()
  public get name(): string {
    return this.skeleton.name;
  }

  /**
   * Set form name.
   */
  public set name(name: string) {
    this.skeleton.name = name;
  }

  /**
   * Get unwind state.
   */
  @Class.Public()
  public get unwind(): boolean {
    return this.states.unwind;
  }

  /**
   * Set unwind state.
   */
  public set unwind(state: boolean) {
    this.states.unwind = state;
  }

  /**
   * Get required state.
   */
  @Class.Public()
  public get required(): boolean {
    return this.states.required;
  }

  /**
   * Set required state.
   */
  public set required(state: boolean) {
    Control.setChildrenProperty(this.contentSlot, 'required', (this.states.required = state));
    this.changeHandler();
  }

  /**
   * Get read-only state.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.states.readOnly;
  }

  /**
   * Set read-only state.
   */
  public set readOnly(state: boolean) {
    Control.setChildrenProperty(this.contentSlot, 'readOnly', (this.states.readOnly = state));
  }

  /**
   * Get disabled state.
   */
  @Class.Public()
  public get disabled(): boolean {
    return this.states.disabled;
  }

  /**
   * Set disabled state.
   */
  public set disabled(state: boolean) {
    this.states.disabled = state;
    Control.setChildrenProperty(this.headerSlot, 'disabled', state);
    Control.setChildrenProperty(this.contentSlot, 'disabled', state);
    Control.setChildrenProperty(this.footerSlot, 'disabled', state);
    if (!state) {
      this.changeHandler();
    }
  }

  /**
   * Get orientation mode.
   */
  @Class.Public()
  public get orientation(): string {
    return this.wrapper.dataset.orientation || 'column';
  }

  /**
   * Set orientation mode.
   */
  public set orientation(mode: string) {
    this.wrapper.dataset.orientation = mode;
  }

  /**
   * Form element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Checks the form validity.
   * @returns Returns true when the form is valid, false otherwise.
   */
  @Class.Public()
  public checkValidity(): boolean {
    const validity = Control.listChildrenByProperty(
      this.contentSlot,
      'checkValidity',
      (field: any) => (field.checkValidity() ? void 0 : false)
    );
    return validity !== false && HTMLFormElement.prototype.checkValidity.call(this.skeleton);
  }

  /**
   * Reports the form validity.
   * @returns Returns true when the form is valid, false otherwise.
   */
  @Class.Public()
  public reportValidity(): boolean {
    const validity = Control.listChildrenByProperty(
      this.contentSlot,
      'reportValidity',
      (field: any) => (field.reportValidity() ? void 0 : false)
    );
    return validity !== false && HTMLFormElement.prototype.reportValidity.call(this.skeleton);
  }

  /**
   * Reset all form fields to its initial values.
   */
  @Class.Public()
  public reset(): void {
    HTMLFormElement.prototype.reset.call(this.skeleton);
    Control.listChildrenByProperty(this.contentSlot, 'reset', (field: any) => {
      field.reset();
    });
    this.changeHandler();
  }

  /**
   * Appends the specified children into this form.
   * @param children Children instances.
   */
  @Class.Public()
  public append(...children: JSX.Element[]): void {
    DOM.append(this.skeleton.firstChild as HTMLElement, children);
    this.changeHandler();
  }

  /**
   * Remove all form children.
   */
  @Class.Public()
  public clear(): void {
    DOM.clear(this.skeleton.firstChild as HTMLElement);
  }
}
