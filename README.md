# UI-Form

Custom HTML element used to mirror field properties in its first-level children, while the form is invalid, any element with submit type will be disabled by default. Also provides the common form structure with header, content and footer slots.

### State Attributes

| Name    | Description                                                              |
| ------- | ------------------------------------------------------------------------ |
| empty   | Automatically assigned when all first-level children are empty           |
| invalid | Automatically assigned when one or more first-level children are invalid |

### Mirrored Properties

| Name     | Description                                                                    |
| -------- | ------------------------------------------------------------------------------ |
| value    | Get or set an object with the `name` and `value` from all first-level children |
| required | Get the `required` state or set it in all first-level children                 |
| readOnly | Get the `readOnly` state or set it in all first-level children                 |
| disabled | Get the `disabled` state or set it in all first-level children                 |

### Properties

| Name        | Description                                                                                |
| ----------- | ------------------------------------------------------------------------------------------ |
| name        | Get or set the element name                                                                |
| empty       | Get the empty state based on all first-level children                                      |
| unwind      | Get or set the unwind state determining whether the value property must be unrolled or not |
| orientation | Get and set the field orientation. Use: `row` or `column` value                            |

### Methods

| Name          | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| focus         | Move the focus to the first-level child that can be focused                       |
| submit        | Notify the form submission (Dispatches submit or invalid event)                   |
| reset         | Reset all first-level children to its initial values (Dispatches the reset event) |
| checkValidity | Check whether all first-level children are valid or not                           |

### Slots

| Name    | Description                                                        |
| ------- | ------------------------------------------------------------------ |
| header  | Element to contain any header child, always on top of the form     |
| content | Element to contain any content child, always on middle of the form |
| footer  | Element to contain any footer child, always on bottom of the form  |

### Events

| Name   | Description                                       |
| ------ | ------------------------------------------------- |
| change | Dispatched when some field in the form is changed |
| submit | Dispatched when the form is submitted             |
| reset  | Dispatched when the form was reset                |

## Install

Using npm:

```sh
npm i @singleware/ui-form
```

## License

[MIT &copy; Silas B. Domingos](https://balmante.eti.br)
