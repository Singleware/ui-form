/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic form template.
 */
import * as Form from '../source';
import * as DOM from '@singleware/jsx';

const form = (
  <Form.Template>
    <h3 slot="header">Form title</h3>
    <input slot="content" type="text" name="input" />
    <select slot="content" name="select">
      <option value="0">Option 1</option>
      <option value="1">Option 2</option>
    </select>
    <button slot="footer" type="submit">
      Submit
    </button>
  </Form.Template>
) as Form.Element;

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
