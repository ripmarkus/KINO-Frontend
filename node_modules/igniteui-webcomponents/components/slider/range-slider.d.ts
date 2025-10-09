import type { Constructor } from '../common/mixins/constructor.js';
import { IgcSliderBaseComponent } from './slider-base.js';
export interface IgcRangeSliderValueEventArgs {
    lower: number;
    upper: number;
}
export interface IgcRangeSliderComponentEventMap {
    /**
     * Emitted when a value is changed via thumb drag or keyboard interaction.
     */
    igcInput: CustomEvent<IgcRangeSliderValueEventArgs>;
    /**
     * Emitted when a value change is committed on a thumb drag end or keyboard interaction.
     */
    igcChange: CustomEvent<IgcRangeSliderValueEventArgs>;
}
declare const IgcRangeSliderComponent_base: Constructor<import("../common/mixins/event-emitter.js").EventEmitterInterface<IgcRangeSliderComponentEventMap>> & Constructor<IgcSliderBaseComponent>;
/**
 * A range slider component used to select two numeric values within a range.
 *
 * @element igc-range-slider
 *
 * @fires igcInput - Emitted when a value is changed via thumb drag or keyboard interaction.
 * @fires igcChange - Emitted when a value change is committed on a thumb drag end or keyboard interaction.
 *
 * @csspart base - The base wrapper of the slider.
 * @csspart ticks - The ticks container.
 * @csspart tick-group - The tick group container.
 * @csspart tick - The tick element.
 * @csspart tick-label - The tick label element.
 * @csspart tick-label-inner - The inner element of the tick label.
 * @csspart thumbs - The thumbs container.
 * @csspart thumb - The thumb element.
 * @csspart thumb-label - The thumb tooltip label container.
 * @csspart thumb-label-inner - The thumb tooltip label inner element.
 * @csspart track - The track container.
 * @csspart steps - The track steps element.
 * @csspart inactive - The inactive element of the track.
 * @csspart fill - The filled part of the track.
 */
export default class IgcRangeSliderComponent extends IgcRangeSliderComponent_base {
    static readonly tagName = "igc-range-slider";
    static register(): void;
    private thumbFrom;
    private thumbTo;
    private _lower;
    private _upper;
    /**
     * The current value of the lower thumb.
     * @attr
     */
    set lower(val: number);
    get lower(): number;
    /**
     * The current value of the upper thumb.
     * @attr
     */
    set upper(val: number);
    get upper(): number;
    /**
     * The aria label for the lower thumb.
     * @attr thumb-label-lower
     */
    thumbLabelLower: string;
    /**
     * The aria label for the upper thumb.
     * @attr thumb-label-upper
     */
    thumbLabelUpper: string;
    protected get activeValue(): number;
    protected normalizeValue(): void;
    protected getTrackStyle(): {
        insetInlineStart: string;
        width: string;
    };
    private closestTo;
    protected closestHandle(event: PointerEvent): HTMLElement;
    protected updateValue(increment: number): boolean;
    protected emitInputEvent(): void;
    protected emitChangeEvent(): void;
    private toggleActiveThumb;
    private handleFocus;
    protected renderThumb(value: number, ariaLabel?: string, thumbId?: string): import("lit-html").TemplateResult<1>;
    protected renderThumbs(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-range-slider': IgcRangeSliderComponent;
    }
}
export {};
