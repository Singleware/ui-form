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
const JSX = require("@singleware/jsx");
/**
 * Form element.
 */
let Element = class Element extends HTMLElement {
    /**
     * Default constructor.
     */
    constructor() {
        super();
        /**
         * Header slot element.
         */
        this.headerSlot = JSX.create("slot", { name: "header", class: "header" });
        /**
         * Content slot element.
         */
        this.contentSlot = JSX.create("slot", { name: "content", class: "content" });
        /**
         * Footer slot element.
         */
        this.footerSlot = JSX.create("slot", { name: "footer", class: "footer" });
        /**
         * Form layout element.
         */
        this.formLayout = (JSX.create("div", { class: "form" },
            this.headerSlot,
            this.contentSlot,
            this.footerSlot));
        /**
         * Form styles element.
         */
        this.formStyles = (JSX.create("style", null, `:host > .form {
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
}`));
        const shadow = JSX.append(this.attachShadow({ mode: 'closed' }), this.formStyles, this.formLayout);
        const options = { capture: true, passive: true };
        shadow.addEventListener('slotchange', this.changeHandler.bind(this), options);
        shadow.addEventListener('focus', this.changeHandler.bind(this), options);
        shadow.addEventListener('keyup', this.changeHandler.bind(this), options);
        shadow.addEventListener('change', this.changeHandler.bind(this), options);
        shadow.addEventListener('blur', this.changeHandler.bind(this), options);
        shadow.addEventListener('click', this.clickHandler.bind(this), options);
        shadow.addEventListener('keypress', this.keypressHandler.bind(this), options);
    }
    /**
     * Add all values from the specified child into the given entity.
     * @param entity Target entity.
     * @param child Child element.
     */
    addValues(entity, child) {
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
    addValue(entity, child) {
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
    updateState(name, state) {
        if (state) {
            this.setAttribute(name, '');
        }
        else {
            this.removeAttribute(name);
        }
    }
    /**
     * Update all element's children by the the specified state.
     * @param name State name.
     * @param state State value.
     */
    updateChildrenState(name, state) {
        for (const child of this.children) {
            if (name in child) {
                child[name] = state;
            }
        }
    }
    /**
     * Change event handler.
     */
    changeHandler() {
        this.updateState('empty', this.empty);
        this.updateState('invalid', !this.empty && !this.checkValidity());
        const disable = this.disabled || !this.checkValidity();
        for (const child of this.children) {
            if (child.type === 'submit') {
                child.disabled = disable;
            }
        }
    }
    /**
     * Click event handler.
     * @param event Event information.
     */
    clickHandler(event) {
        switch (event.target.type) {
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
    keypressHandler(event) {
        if (event.target instanceof HTMLInputElement && event.code === 'Enter') {
            this.submit();
        }
    }
    /**
     * Determines whether the element is empty or not.
     */
    get empty() {
        for (const child of this.children) {
            if (!child.empty) {
                return false;
            }
        }
        return true;
    }
    /**
     * Gets the element name.
     */
    get name() {
        return this.getAttribute('name') || '';
    }
    /**
     * Sets the element name.
     */
    set name(name) {
        this.setAttribute('name', name);
    }
    /**
     * Gets the element value.
     */
    get value() {
        const entity = {};
        for (const child of this.children) {
            if (!child.empty) {
                if (child.unwind) {
                    this.addValues(entity, child);
                }
                else {
                    this.addValue(entity, child);
                }
            }
        }
        return entity;
    }
    /**
     * Sets the element value.
     */
    set value(value) {
        for (const child of this.children) {
            if (child.unwind) {
                child.value = value;
            }
            else if (value instanceof Object && value[child.name] !== void 0) {
                child.value = value[child.name];
            }
        }
        this.changeHandler();
    }
    /**
     * Gets the unwind state of the element.
     */
    get unwind() {
        return this.hasAttribute('unwind');
    }
    /**
     * Sets the unwind state of the element.
     */
    set unwind(state) {
        this.updateState('unwind', state);
    }
    /**
     * Gets the required state of the element.
     */
    get required() {
        return this.hasAttribute('required');
    }
    /**
     * Sets the required state of the element.
     */
    set required(state) {
        this.updateState('required', state);
        this.updateChildrenState('required', state);
        this.changeHandler();
    }
    /**
     * Gets the read-only state of the element.
     */
    get readOnly() {
        return this.hasAttribute('readonly');
    }
    /**
     * Sets the read-only state of the element.
     */
    set readOnly(state) {
        this.updateState('readonly', state);
        this.updateChildrenState('readOnly', state);
    }
    /**
     * Gets the disabled state of the element.
     */
    get disabled() {
        return this.hasAttribute('disabled');
    }
    /**
     * Sets the disabled state of the element.
     */
    set disabled(state) {
        this.updateState('disabled', state);
        this.updateChildrenState('disabled', state);
        this.changeHandler();
    }
    /**
     * Gets the element orientation.
     */
    get orientation() {
        return this.getAttribute('orientation') || 'column';
    }
    /**
     * Sets the element orientation.
     */
    set orientation(orientation) {
        this.setAttribute('orientation', orientation);
    }
    /**
     * Move the focus to the first child that can be focused.
     */
    focus() {
        for (const child of this.children) {
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
    submit() {
        if (!this.disabled) {
            if (!this.checkValidity()) {
                this.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
            }
            else {
                return this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        }
        return false;
    }
    /**
     * Reset all fields in the element to its initial values.
     */
    reset() {
        if (this.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }))) {
            for (const child of this.children) {
                if (child.reset instanceof Function) {
                    child.reset();
                }
                else {
                    if ('value' in child) {
                        child.value = child.defaultValue;
                    }
                    if ('checked' in child) {
                        child.checked = child.defaultChecked;
                    }
                }
            }
        }
    }
    /**
     * Checks the element validity.
     * @returns Returns true when the element is valid, false otherwise.
     */
    checkValidity() {
        for (const child of this.children) {
            if (child.checkValidity instanceof Function && !child.checkValidity()) {
                return false;
            }
        }
        return true;
    }
};
__decorate([
    Class.Private()
], Element.prototype, "headerSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "contentSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "footerSlot", void 0);
__decorate([
    Class.Private()
], Element.prototype, "formLayout", void 0);
__decorate([
    Class.Private()
], Element.prototype, "formStyles", void 0);
__decorate([
    Class.Private()
], Element.prototype, "addValues", null);
__decorate([
    Class.Private()
], Element.prototype, "addValue", null);
__decorate([
    Class.Private()
], Element.prototype, "updateState", null);
__decorate([
    Class.Private()
], Element.prototype, "updateChildrenState", null);
__decorate([
    Class.Private()
], Element.prototype, "changeHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "clickHandler", null);
__decorate([
    Class.Private()
], Element.prototype, "keypressHandler", null);
__decorate([
    Class.Public()
], Element.prototype, "empty", null);
__decorate([
    Class.Public()
], Element.prototype, "name", null);
__decorate([
    Class.Public()
], Element.prototype, "value", null);
__decorate([
    Class.Public()
], Element.prototype, "unwind", null);
__decorate([
    Class.Public()
], Element.prototype, "required", null);
__decorate([
    Class.Public()
], Element.prototype, "readOnly", null);
__decorate([
    Class.Public()
], Element.prototype, "disabled", null);
__decorate([
    Class.Public()
], Element.prototype, "orientation", null);
__decorate([
    Class.Public()
], Element.prototype, "focus", null);
__decorate([
    Class.Public()
], Element.prototype, "submit", null);
__decorate([
    Class.Public()
], Element.prototype, "reset", null);
__decorate([
    Class.Public()
], Element.prototype, "checkValidity", null);
Element = __decorate([
    JSX.Describe('swe-form'),
    Class.Describe()
], Element);
exports.Element = Element;
