import { LitElement, type PropertyValues } from 'lit';
export default class IgcComboItemComponent extends LitElement {
    static readonly tagName: string;
    static styles: import("lit").CSSResult[];
    static register(): void;
    private readonly _internals;
    index: number;
    /**
     * Determines whether the item is selected.
     * @attr selected
     * @default false
     */
    selected: boolean;
    /**
     * Determines whether the item is active.
     */
    active: boolean;
    /**
     * Determines whether the item is active.
     * @attr hide-checkbox
     */
    hideCheckbox: boolean;
    constructor();
    connectedCallback(): void;
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    private renderCheckbox;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-combo-item': IgcComboItemComponent;
    }
}
