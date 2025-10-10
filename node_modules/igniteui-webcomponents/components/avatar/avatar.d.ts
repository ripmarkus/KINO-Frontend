import { LitElement, type PropertyValues } from 'lit';
import type { AvatarShape } from '../types.js';
/**
 * An avatar component is used as a representation of a user identity
 * typically in a user profile.
 *
 * @element igc-avatar
 *
 * @slot - Renders an icon inside the default slot.
 *
 * @csspart base - The base wrapper of the avatar.
 * @csspart initials - The initials wrapper of the avatar.
 * @csspart image - The image wrapper of the avatar.
 * @csspart icon - The icon wrapper of the avatar.
 */
export default class IgcAvatarComponent extends LitElement {
    static readonly tagName = "igc-avatar";
    static styles: import("lit").CSSResult[];
    static register(): void;
    private readonly _internals;
    private _hasError;
    /**
     * The image source to use.
     * @attr
     */
    src?: string;
    /**
     * Alternative text for the image.
     * @attr
     */
    alt?: string;
    /**
     * Initials to use as a fallback when no image is available.
     * @attr
     */
    initials?: string;
    /**
     * The shape of the avatar.
     * @attr
     */
    shape: AvatarShape;
    constructor();
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    protected _handleError(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-avatar': IgcAvatarComponent;
    }
}
