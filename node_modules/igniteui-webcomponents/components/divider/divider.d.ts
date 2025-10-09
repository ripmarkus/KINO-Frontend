import { LitElement } from 'lit';
import type { DividerType } from '../types.js';
/**
 * The igc-divider allows the content author to easily create a horizontal/vertical rule as a break between content to better organize information on a page.
 *
 * @element igc-divider
 *
 * @cssproperty --color - Sets the color of the divider.
 * @cssproperty --inset - Shrinks the divider by the given amount from the start. If `middle` is set it will shrink from both sides.
 *
 */
export default class IgcDividerComponent extends LitElement {
    static readonly tagName = "igc-divider";
    static styles: import("lit").CSSResult[];
    static register(): void;
    private readonly _internals;
    private _vertical;
    /**
     * Whether to render a vertical divider line.
     * @attr
     * @default false
     */
    set vertical(value: boolean);
    get vertical(): boolean;
    /**
     * When set and inset is provided, it will shrink the divider line from both sides.
     * @attr
     * @default false
     */
    middle: boolean;
    /**
     * Whether to render a solid or a dashed divider line.
     * @attr type
     * @default 'solid'
     */
    type: DividerType;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-divider': IgcDividerComponent;
    }
}
