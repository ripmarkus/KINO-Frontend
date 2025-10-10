import { LitElement, type TemplateResult } from 'lit';
import type { Constructor } from '../common/mixins/constructor.js';
export interface IgcButtonEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
}
declare const IgcButtonBaseComponent_base: Constructor<import("../common//mixins/event-emitter.js").EventEmitterInterface<IgcButtonEventMap>> & Constructor<LitElement>;
export declare abstract class IgcButtonBaseComponent extends IgcButtonBaseComponent_base {
    static readonly formAssociated = true;
    protected readonly _internals: import("../common/controllers/internals.js").ElementInternalsController;
    private readonly _focusRingManager;
    protected _disabled: boolean;
    private readonly _nativeButton;
    /**
     * The type of the button. Defaults to `button`.
     * @attr
     */
    type: 'button' | 'reset' | 'submit';
    /**
     * The URL the button points to.
     * @attr
     */
    href?: string;
    /**
     * Prompts to save the linked URL instead of navigating to it.
     * @attr
     */
    download?: string;
    /**
     * Where to display the linked URL, as the name for a browsing context.
     * @attr
     */
    target?: '_blank' | '_parent' | '_self' | '_top';
    /**
     * The relationship of the linked URL.
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types
     * @attr
     */
    rel?: string;
    /**
     * The disabled state of the component
     * @attr [disabled=false]
     */
    set disabled(value: boolean);
    get disabled(): boolean;
    /** Returns the HTMLFormElement associated with this element. */
    get form(): HTMLFormElement | null;
    /** Sets focus in the button. */
    focus(options?: FocusOptions): void;
    /** Simulates a mouse click on the element */
    click(): void;
    /** Removes focus from the button. */
    blur(): void;
    protected _handleClick(): void;
    protected formDisabledCallback(state: boolean): void;
    private renderButton;
    private renderLinkButton;
    protected abstract renderContent(): TemplateResult;
    protected render(): TemplateResult<1>;
}
export {};
