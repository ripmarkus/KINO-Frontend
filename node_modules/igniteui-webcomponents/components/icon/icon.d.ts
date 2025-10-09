import { LitElement } from 'lit';
import type { IconMeta } from './registry/types.js';
/**
 * The icon component allows visualizing collections of pre-registered SVG icons.
 *
 * @element igc-icon
 *
 *
 */
export default class IgcIconComponent extends LitElement {
    static readonly tagName = "igc-icon";
    static styles: import("lit").CSSResult[];
    static register(): void;
    private readonly _internals;
    private svg;
    /**
     * The name of the icon glyph to draw.
     * @attr
     */
    name: string;
    /**
     * The name of the registered collection for look up of icons.
     * Defaults to `default`.
     * @attr
     */
    collection: string;
    /**
     * Whether to flip the icon. Useful for RTL layouts.
     * @attr
     */
    mirrored: boolean;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected iconChanged(prev: string, curr: string): void;
    private _themeChangedCallback;
    private iconLoaded;
    private getIcon;
    protected render(): import("lit-html").TemplateResult<1>;
    protected registerIcon(name: string, url: string, collection?: string): Promise<void>;
    protected registerIconFromText(name: string, iconText: string, collection?: string): void;
    protected setIconRef(name: string, collection: string, icon: IconMeta): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-icon': IgcIconComponent;
    }
}
