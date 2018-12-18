/**
 * Form element.
 */
export declare class Element extends HTMLElement {
    /**
     * Header slot element.
     */
    private headerSlot;
    /**
     * Content slot element.
     */
    private contentSlot;
    /**
     * Footer slot element.
     */
    private footerSlot;
    /**
     * Form layout element.
     */
    private formLayout;
    /**
     * Form styles element.
     */
    private formStyles;
    /**
     * Add all values from the specified child into the given entity.
     * @param entity Target entity.
     * @param child Child element.
     */
    private addValues;
    /**
     * Add the value from the specified child into the given entity.
     * @param entity Target entity.
     * @param child Child element.
     */
    private addValue;
    /**
     * Updates the specified state in the element.
     * @param name State name.
     * @param state State value.
     */
    private updateState;
    /**
     * Update all element's children by the specified state.
     * @param name State name.
     * @param state State value.
     */
    private updateChildrenState;
    /**
     * Activate or deactivate all first-level children with submit type.
     */
    private updateSubmitState;
    /**
     * Change event handler.
     */
    private changeHandler;
    /**
     * Click event handler.
     * @param event Event information.
     */
    private clickHandler;
    /**
     * Keypress event handler.
     * @param event Event information.
     */
    private keypressHandler;
    /**
     * Default constructor.
     */
    constructor();
    /**
     * Determines whether the element is empty or not.
     */
    readonly empty: boolean;
    /**
     * Gets the element name.
     */
    /**
    * Sets the element name.
    */
    name: string;
    /**
     * Gets the element value.
     */
    /**
    * Sets the element value.
    */
    value: any;
    /**
     * Gets the unwind state of the element.
     */
    /**
    * Sets the unwind state of the element.
    */
    unwind: boolean;
    /**
     * Gets the required state of the element.
     */
    /**
    * Sets the required state of the element.
    */
    required: boolean;
    /**
     * Gets the read-only state of the element.
     */
    /**
    * Sets the read-only state of the element.
    */
    readOnly: boolean;
    /**
     * Gets the disabled state of the element.
     */
    /**
    * Sets the disabled state of the element.
    */
    disabled: boolean;
    /**
     * Gets the element orientation.
     */
    /**
    * Sets the element orientation.
    */
    orientation: string;
    /**
     * Move the focus to the first child that can be focused.
     */
    focus(): void;
    /**
     * Submits the form element.
     * @returns Returns true when the form has been submitted, false otherwise.
     */
    submit(): boolean;
    /**
     * Reset all fields in the element to its initial values.
     */
    reset(): void;
    /**
     * Checks the element validity.
     * @returns Returns true when the element is valid, false otherwise.
     */
    checkValidity(): boolean;
}
