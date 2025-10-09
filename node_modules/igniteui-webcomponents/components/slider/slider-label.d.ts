import { LitElement } from 'lit';
/**
 * Allows formatting the values of the slider as string values.
 * The text content of the slider labels is used for thumb and tick labels.
 *
 * @remarks
 * When slider labels are provided, the `min`, `max` and `step` properties are automatically
 * calculated so that they do not allow values that do not map to the provided labels.
 *
 * @element igc-slider-label
 */
export default class IgcSliderLabelComponent extends LitElement {
    static readonly tagName = "igc-slider-label";
    static styles: import("lit").CSSResult;
    static register(): void;
    protected createRenderRoot(): this;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-slider-label': IgcSliderLabelComponent;
    }
}
