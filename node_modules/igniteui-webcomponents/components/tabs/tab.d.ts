import { LitElement } from 'lit';
/**
 * A tab element slotted into an `igc-tabs` container.
 *
 * @element igc-tab
 *
 * @slot - Renders the tab's content.
 * @slot label - Renders the tab header's label.
 * @slot prefix - Renders the tab header's prefix.
 * @slot suffix - Renders the tab header's suffix.
 *
 * @csspart tab-header - The header of a single tab.
 * @csspart prefix - Tab header's label prefix.
 * @csspart content - Tab header's label slot container.
 * @csspart suffix - Tab header's label suffix.
 * @csspart tab-body - Holds the body content of a single tab, only the body of the selected tab is visible.
 */
export default class IgcTabComponent extends LitElement {
    static readonly tagName = "igc-tab";
    static styles: import("lit").CSSResult[];
    static register(): void;
    private static increment;
    /**
     * The tab item label.
     * @attr
     */
    label: string;
    /**
     * Determines whether the tab is selected.
     * @attr
     */
    selected: boolean;
    /**
     * Determines whether the tab is disabled.
     * @attr
     */
    disabled: boolean;
    constructor();
    /** @internal */
    connectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-tab': IgcTabComponent;
    }
}
