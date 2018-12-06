"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic form template.
 */
const Form = require("../source");
const JSX = require("@singleware/jsx");
const form = (JSX.create(Form.Component, null,
    JSX.create("h3", { slot: "header" }, "Form title"),
    JSX.create("input", { slot: "content", type: "text", name: "input" }),
    JSX.create("select", { slot: "content", name: "select" },
        JSX.create("option", { value: "0" }, "Option 1"),
        JSX.create("option", { value: "1" }, "Option 2")),
    JSX.create("button", { slot: "footer", type: "submit" }, "Submit")));
// Change disabled property of all fiends in the form.
form.disabled = true;
// Change read-only property of all fiends in the form.
form.readOnly = true;
// Change required property property of all fiends in the form.
form.required = true;
// Change form name.
form.name = 'new-name';
// Change value of all form fields.
form.value = {
    input: 'New value',
    select: '0'
};
// Change form orientation ('row' or 'column')
form.orientation = 'row';
