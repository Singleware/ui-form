/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Element } from './element';

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
    required: false,
    readOnly: false,
    disabled: false
  };

  /**
   * Header element.
   */
  @Class.Private()
  private headerSlot: HTMLSlotElement = <slot name="header" class="header" /> as HTMLSlotElement;

  /**
   * Content element.
   */
  @Class.Private()
  private contentSlot: HTMLSlotElement = <slot name="content" class="content" /> as HTMLSlotElement;

  /**
   * Footer element.
   */
  @Class.Private()
  private footerSlot: HTMLSlotElement = <slot name="footer" class="footer" /> as HTMLSlotElement;

  /**
   * Wrapper element.
   */
  @Class.Private()
  private wrapper: HTMLElement = (
    <div class="wrapper">
      {this.headerSlot}
      {this.contentSlot}
      {this.footerSlot}
    </div>
  ) as HTMLElement;

  /**
   * Form styles.
   */
  @Class.Private()
  private styles: HTMLStyleElement = (
    <style>
      {`:host {
  width: 100%;
}
:host > .wrapper {
  display: flex;
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
  private skeleton: Element = (
    <form slot={this.properties.slot} class={this.properties.class} method={this.properties.method || 'POST'}>
      <div>{this.children}</div>
    </form>
  ) as Element;

  /**
   * Form elements.
   */
  @Class.Private()
  private elements: ShadowRoot = DOM.append(
    (this.skeleton.firstChild as HTMLDivElement).attachShadow({ mode: 'closed' }),
    this.styles,
    this.wrapper
  ) as ShadowRoot;

  /**
   * Sets the specified property to all buttons in the specified element slot.
   * @param slot Element slot.
   * @param type Button type.
   * @param property Expected property.
   * @param value New property value.
   */
  @Class.Private()
  private setButtonsProperty(slot: HTMLSlotElement, type: string, property: PropertyKey, value: any): void {
    Control.listChildByProperty(slot, property, (child: any) => {
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
      this.setButtonsProperty(this.contentSlot, 'submit', 'disabled', disable);
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
   * Bind event handlers to update the custom element.
   */
  @Class.Private()
  private bindHandlers(): void {
    this.skeleton.addEventListener('keyup', Class.bindCallback(this.changeHandler));
    this.skeleton.addEventListener('change', Class.bindCallback(this.changeHandler), true);
    this.skeleton.addEventListener('invalid', Class.bindCallback(this.invalidHandler), true);
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
    Object.defineProperties(this.skeleton, {
      value: super.bindDescriptor(Template.prototype, 'value'),
      required: super.bindDescriptor(Template.prototype, 'required'),
      readOnly: super.bindDescriptor(Template.prototype, 'readOnly'),
      disabled: super.bindDescriptor(Template.prototype, 'disabled'),
      orientation: super.bindDescriptor(Template.prototype, 'orientation')
    });
  }

  /**
   * Assign all elements properties.
   */
  @Class.Private()
  private assignProperties(): void {
    Control.assignProperties(this, this.properties, ['name', 'value', 'required', 'readOnly', 'disabled']);
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
    Control.listChildByProperty(this.contentSlot, 'name', (field: any) => {
      if (field.name.length > 0 && 'value' in field) {
        entity[field.name] = field.value;
      }
    });
    return entity;
  }

  /**
   * Set value entity.
   */
  public set value(entity: any) {
    Control.listChildByProperty(this.contentSlot, 'name', (field: any) => {
      if (field.name.length > 0 && 'value' in field && field.name in entity) {
        field[field.name] = entity[field.value];
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
    return this.wrapper.dataset.orientation || 'row';
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
}
