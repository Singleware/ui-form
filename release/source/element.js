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
const Control = require("@singleware/ui-control");
const JSX = require("@singleware/jsx");
const stylesheet_1 = require("./stylesheet");
/**
 * Form element.
 */
let Element = class Element extends Control.Element {
    /**
     * Default constructor.
     */
    constructor() {
        super();
        /**
         * Element styles.
         */
        this.styles = new stylesheet_1.Stylesheet();
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
        this.formStyles = JSX.create("style", { type: "text/css" }, this.styles.toString());
        const shadow = JSX.append(this.attachShadow({ mode: 'closed' }), this.formStyles, this.formLayout);
        shadow.addEventListener('slotchange', this.changeHandler.bind(this));
        shadow.addEventListener('keyup', this.changeHandler.bind(this));
        shadow.addEventListener('change', this.changeHandler.bind(this));
        shadow.addEventListener('click', this.clickHandler.bind(this));
        shadow.addEventListener('keypress', this.keypressHandler.bind(this));
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
     * Enable or disable all first-level children with submit type.
     */
    updateSubmitButtonState() {
        const isDisabled = this.disabled || !this.checkValidity();
        for (const child of this.children) {
            switch (child.type) {
                case 'submit':
                    child.disabled = isDisabled;
                    break;
            }
        }
    }
    /**
     * Notifies the form submission.
     */
    submitAndNotify() {
        const saved = this.readOnly;
        const event = new Event('submit', { bubbles: true, cancelable: true });
        this.readOnly = true;
        this.dispatchEvent(event);
        this.readOnly = saved;
    }
    /**
     * Notifies the form reset.
     */
    resetAndNotify() {
        const event = new Event('reset', { bubbles: true, cancelable: true });
        if (this.dispatchEvent(event)) {
            this.reset();
        }
    }
    /**
     * Change event handler.
     */
    changeHandler() {
        this.updatePropertyState('empty', this.empty);
        this.updatePropertyState('invalid', !this.empty && !this.checkValidity());
        this.updateSubmitButtonState();
    }
    /**
     * Click event handler.
     * @param event Event information.
     */
    clickHandler(event) {
        const isTarget = event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement;
        const isUsable = !this.disabled && !this.readOnly && this.checkValidity();
        if (isTarget && isUsable) {
            switch (event.target.type) {
                case 'submit':
                    event.preventDefault();
                    this.submitAndNotify();
                    break;
                case 'reset':
                    event.preventDefault();
                    this.resetAndNotify();
                    break;
            }
        }
    }
    /**
     * Keypress event handler.
     * @param event Event information.
     */
    keypressHandler(event) {
        const isTarget = event.target instanceof HTMLInputElement;
        const isUsable = !this.disabled && !this.readOnly && this.checkValidity();
        if (isTarget && isUsable) {
            switch (event.code) {
                case 'Enter':
                    event.preventDefault();
                    this.submitAndNotify();
                    break;
            }
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
        this.updatePropertyState('unwind', state);
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
        this.updatePropertyState('required', state);
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
        this.updatePropertyState('readonly', state);
        this.updateChildrenState('readOnly', state);
        this.changeHandler();
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
        this.updatePropertyState('disabled', state);
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
     * Reset all fields in the element to its initial values.
     */
    reset() {
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
        this.changeHandler();
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
], Element.prototype, "styles", void 0);
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
], Element.prototype, "updateSubmitButtonState", null);
__decorate([
    Class.Private()
], Element.prototype, "submitAndNotify", null);
__decorate([
    Class.Private()
], Element.prototype, "resetAndNotify", null);
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
], Element.prototype, "reset", null);
__decorate([
    Class.Public()
], Element.prototype, "checkValidity", null);
Element = __decorate([
    JSX.Describe('swe-form'),
    Class.Describe()
], Element);
exports.Element = Element;
