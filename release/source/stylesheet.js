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
const OSS = require("@singleware/oss");
/**
 * Form stylesheet class.
 */
let Stylesheet = class Stylesheet extends OSS.Stylesheet {
    /**
     * Default constructor.
     */
    constructor() {
        super();
        /**
         * Host styles.
         */
        this.host = this.select(':host');
        /**
         * Form styles.
         */
        this.form = this.select(':host>.form');
        /**
         * Row form styles.
         */
        this.rowForm = this.select(':host([orientation="row"])>.form');
        /**
         * Column form styles.
         */
        this.columnForm = this.select(':host([orientation="column"])>.form, :host>.form');
        this.host.display = 'block';
        this.form.display = 'flex';
        this.form.width = 'inherit';
        this.form.height = 'inherit';
        this.rowForm.flexDirection = 'row';
        this.rowForm.alignItems = 'center';
        this.columnForm.flexDirection = 'column';
    }
};
__decorate([
    Class.Private()
], Stylesheet.prototype, "host", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "form", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "rowForm", void 0);
__decorate([
    Class.Private()
], Stylesheet.prototype, "columnForm", void 0);
Stylesheet = __decorate([
    Class.Describe()
], Stylesheet);
exports.Stylesheet = Stylesheet;
