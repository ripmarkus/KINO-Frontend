import { LitElement } from 'lit';
/**
 * @element igc-carousel-indicator-container
 *
 * @slot - Default slot for the carousel indicator container.
 *
 * @csspart base - The wrapping container of all carousel indicators.
 */
export default class IgcCarouselIndicatorContainerComponent extends LitElement {
    static readonly tagName = "igc-carousel-indicator-container";
    static styles: import("lit").CSSResult[];
    static register(): void;
    private readonly _focusRingManager;
    constructor();
    private _handleFocusOut;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-carousel-indicator-container': IgcCarouselIndicatorContainerComponent;
    }
}
