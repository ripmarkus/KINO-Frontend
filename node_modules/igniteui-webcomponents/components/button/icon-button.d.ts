import type { IconButtonVariant } from '../types.js';
import { IgcButtonBaseComponent } from './button-base.js';
/**
 * @element igc-icon-button
 *
 * @csspart base - The wrapping element of the icon button.
 * @csspart icon - The icon element of the icon button.
 */
export default class IgcIconButtonComponent extends IgcButtonBaseComponent {
    static readonly tagName = "igc-icon-button";
    protected static styles: import("lit").CSSResult[];
    static register(): void;
    /**
     * The name of the icon.
     * @attr
     */
    name?: string;
    /**
     * The name of the icon collection.
     * @attr
     */
    collection?: string;
    /**
     * Whether to flip the icon button. Useful for RTL layouts.
     * @attr
     */
    mirrored: boolean;
    /**
     * The visual variant of the icon button.
     * @attr
     */
    variant: IconButtonVariant;
    constructor();
    protected renderContent(): import("lit-html").TemplateResult<1>;
    protected registerIcon(name: string, url: string, collection?: string): Promise<void>;
    protected registerIconFromText(name: string, iconText: string, collection?: string): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-icon-button': IgcIconButtonComponent;
    }
}
