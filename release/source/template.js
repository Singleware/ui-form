"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const DOM = require("@singleware/jsx");
const Control = require("@singleware/ui-control");
/**
 * Form template class.
 */
let Template = class Template extends Control.Component {
    /**
     * Default constructor.
     * @param properties Form properties.
     * @param children Form children.
     */
    constructor(properties, children) {
        super(properties, children);
        /**
         * Form states.
         */
        this.states = {
            unwind: false,
            required: false,
            readOnly: false,
            disabled: false
        };
        /**
         * Header element.
         */
        this.headerSlot = DOM.create("slot", { name: "header", class: "header" });
        /**
         * Content element.
         */
        this.contentSlot = DOM.create("slot", { name: "content", class: "content" });
        /**
         * Footer element.
         */
        this.footerSlot = DOM.create("slot", { name: "footer", class: "footer" });
        /**
         * Wrapper element.
         */
        this.wrapper = (DOM.create("div", { class: "wrapper" },
            this.headerSlot,
            this.contentSlot,
            this.footerSlot));
        /**
         * Form styles.
         */
        this.styles = (DOM.create("style", null, `:host {
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
}`));
        /**
         * Form skeleton.
         */
        this.skeleton = (DOM.create("form", { slot: this.properties.slot, class: this.properties.class, method: this.properties.method || 'POST' },
            DOM.create("div", null, this.children)));
        DOM.append(this.skeleton.firstChild.attachShadow({ mode: 'closed' }), this.styles, this.wrapper);
        this.bindHandlers();
        this.bindProperties();
        this.assignProperties();
    }
    /**
     * Sets the specified property to all buttons in the specified element slot.
     * @param slot Element slot.
     * @param type Button type.
     * @param property Expected property.
     * @param value New property value.
     */
    setButtonsProperty(slot, type, property, value) {
        Control.listChildrenByProperty(slot, property, (child) => {
            if ('type' in child && child.type === type) {
                child[property] = value;
            }
        });
    }
    /**
     * Change event handler.
     */
    changeHandler() {
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
    invalidHandler(event) {
        event.preventDefault();
    }
    /**
     * Bind event handlers to update the custom element.
     */
    bindHandlers() {
        this.skeleton.addEventListener('keyup', this.changeHandler.bind(this));
        this.skeleton.addEventListener('change', this.changeHandler.bind(this), true);
        this.skeleton.addEventListener('invalid', this.invalidHandler.bind(this), true);
    }
    /**
     * Bind exposed properties to the custom element.
     */
    bindProperties() {
        this.bindComponentProperties(this.skeleton, [
            'value',
            'unwind',
            'required',
            'readOnly',
            'disabled',
            'orientation',
            'checkValidity',
            'reportValidity',
            'reset'
        ]);
    }
    /**
     * Assign all elements properties.
     */
    assignProperties() {
        this.assignComponentProperties(this.properties, ['name', 'value', 'unwind', 'required', 'readOnly', 'disabled']);
        this.orientation = this.properties.orientation || 'column';
        this.changeHandler();
    }
    /**
     * Get value entity.
     */
    get value() {
        const entity = {};
        Control.listChildrenByProperty(this.contentSlot, 'value', (field) => {
            if ('unwind' in field && field.unwind === true) {
                const values = field.value;
                for (const name in values) {
                    if (values[name] !== void 0) {
                        entity[name] = values[name];
                    }
                }
            }
            else if ('name' in field && field.name) {
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
    set value(entity) {
        Control.listChildrenByProperty(this.contentSlot, 'value', (field) => {
            if ('unwind' in field && field.unwind === true) {
                field.value = entity;
            }
            else if ('name' in field && field.name in entity) {
                field.value = entity[field.name];
                delete entity[field.name];
            }
        });
        this.changeHandler();
    }
    /**
     * Get form name.
     */
    get name() {
        return this.skeleton.name;
    }
    /**
     * Set form name.
     */
    set name(name) {
        this.skeleton.name = name;
    }
    /**
     * Get unwind state.
     */
    get unwind() {
        return this.states.unwind;
    }
    /**
     * Set unwind state.
     */
    set unwind(state) {
        this.states.unwind = state;
    }
    /**
     * Get required state.
     */
    get required() {
        return this.states.required;
    }
    /**
     * Set required state.
     */
    set required(state) {
        Control.setChildrenProperty(this.contentSlot, 'required', (this.states.required = state));
        this.changeHandler();
    }
    /**
     * Get read-only state.
     */
    get readOnly() {
        return this.states.readOnly;
    }
    /**
     * Set read-only state.
     */
    set readOnly(state) {
        Control.setChildrenProperty(this.contentSlot, 'readOnly', (this.states.readOnly = state));
    }
    /**
     * Get disabled state.
     */
    get disabled() {
        return this.states.disabled;
    }
    /**
     * Set disabled state.
     */
    set disabled(state) {
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
    get orientation() {
        return this.wrapper.dataset.orientation || 'column';
    }
    /**
     * Set orientation mode.
     */
    set orientation(mode) {
        this.wrapper.dataset.orientation = mode;
    }
    /**
     * Form element.
     */
    get element() {
        return this.skeleton;
    }
    /**
     * Checks the form validity.
     * @returns Returns true when the form is valid, false otherwise.
     */
    checkValidity() {
        let validity = true;
        Control.listChildrenByProperty(this.contentSlot, 'checkValidity', (field) => {
            if (!(validity = field.reportValidity())) {
                return false;
            }
        });
        return validity && HTMLFormElement.prototype.checkValidity.call(this.skeleton);
    }
    /**
     * Reports the form validity.
     * @returns Returns true when the form is valid, false otherwise.
     */
    reportValidity() {
        let validity = true;
        Control.listChildrenByProperty(this.contentSlot, 'reportValidity', (field) => {
            if (!(validity = field.reportValidity())) {
                return false;
            }
        });
        return validity && HTMLFormElement.prototype.reportValidity.call(this.skeleton);
    }
    /**
     * Reset all form fields to its initial values.
     */
    reset() {
        HTMLFormElement.prototype.reset.call(this.skeleton);
        Control.listChildrenByProperty(this.contentSlot, 'reset', (field) => {
            field.reset();
        });
        this.changeHandler();
    }
};
__decorate([
    Class.Private()
], Template.prototype, "states", void 0);
__decorate([
    Class.Private()
], Template.prototype, "headerSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "contentSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "footerSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "wrapper", void 0);
__decorate([
    Class.Private()
], Template.prototype, "styles", void 0);
__decorate([
    Class.Private()
], Template.prototype, "skeleton", void 0);
__decorate([
    Class.Private()
], Template.prototype, "setButtonsProperty", null);
__decorate([
    Class.Private()
], Template.prototype, "changeHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "invalidHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "bindHandlers", null);
__decorate([
    Class.Private()
], Template.prototype, "bindProperties", null);
__decorate([
    Class.Private()
], Template.prototype, "assignProperties", null);
__decorate([
    Class.Public()
], Template.prototype, "value", null);
__decorate([
    Class.Public()
], Template.prototype, "name", null);
__decorate([
    Class.Public()
], Template.prototype, "unwind", null);
__decorate([
    Class.Public()
], Template.prototype, "required", null);
__decorate([
    Class.Public()
], Template.prototype, "readOnly", null);
__decorate([
    Class.Public()
], Template.prototype, "disabled", null);
__decorate([
    Class.Public()
], Template.prototype, "orientation", null);
__decorate([
    Class.Public()
], Template.prototype, "element", null);
__decorate([
    Class.Public()
], Template.prototype, "checkValidity", null);
__decorate([
    Class.Public()
], Template.prototype, "reportValidity", null);
__decorate([
    Class.Public()
], Template.prototype, "reset", null);
Template = __decorate([
    Class.Describe()
], Template);
exports.Template = Template;
