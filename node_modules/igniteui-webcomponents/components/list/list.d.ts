import { LitElement } from 'lit';
/**
 * Displays a collection of data items in a templatable list format.
 *
 * @element igc-list
 *
 * @slot - Renders the list items and list headers inside default slot.
 */
export default class IgcListComponent extends LitElement {
    static readonly tagName = "igc-list";
    static styles: import("lit").CSSResult[];
    static register(): void;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-list': IgcListComponent;
    }
}
