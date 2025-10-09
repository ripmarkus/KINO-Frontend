import { LitElement } from 'lit';
import type { Constructor } from '../common/mixins/constructor.js';
import type { TabsActivation, TabsAlignment } from '../types.js';
import IgcTabComponent from './tab.js';
export interface IgcTabsComponentEventMap {
    igcChange: CustomEvent<IgcTabComponent>;
}
declare const IgcTabsComponent_base: Constructor<import("../common/mixins/event-emitter.js").EventEmitterInterface<IgcTabsComponentEventMap>> & Constructor<LitElement>;
/**
 * Tabs organize and allow navigation between groups of content that are related and at the same level of hierarchy.
 *
 * The `<igc-tabs>` component allows the user to navigate between multiple `<igc-tab>` elements.
 * It supports keyboard navigation and provides API methods to control the selected tab.
 *
 * @element igc-tabs
 *
 * @fires igcChange - Emitted when the selected tab changes.
 *
 * @slot - Renders the `IgcTabComponents` inside default slot.
 *
 * @csspart start-scroll-button - The start scroll button displayed when the tabs overflow.
 * @csspart end-scroll-button - The end scroll button displayed when the tabs overflow.
 * @csspart selected-indicator - The indicator that shows which tab is selected.
 */
export default class IgcTabsComponent extends IgcTabsComponent_base {
    static readonly tagName = "igc-tabs";
    static styles: import("lit").CSSResult[];
    static register(): void;
    private readonly _resizeController;
    /** The tabs container reference holding the tab headers. */
    private readonly _headerRef;
    /** The selected tab indicator reference.  */
    private readonly _indicatorRef;
    private readonly _domHelpers;
    private _tabs;
    protected get _enabledTabs(): IgcTabComponent[];
    private _activeTab?;
    /**
     * Sets the alignment for the tab headers
     * @attr
     */
    alignment: TabsAlignment;
    /**
     * Determines the tab activation. When set to auto,
     * the tab is instantly selected while navigating with the Left/Right Arrows, Home or End keys
     * and the corresponding panel is displayed.
     * When set to manual, the tab is only focused. The selection happens after pressing Space or Enter.
     * @attr
     */
    activation: TabsActivation;
    /** Returns the direct `igc-tab` elements that are children of this element. */
    get tabs(): IgcTabComponent[];
    /** Returns the currently selected tab label or IDREF if no label property is set. */
    get selected(): string;
    protected _alignmentChanged(): void;
    constructor();
    protected firstUpdated(): Promise<void>;
    /** @internal */
    connectedCallback(): void;
    protected updated(): void;
    private _resizeCallback;
    private _mutationCallback;
    private _selectedAttributeChanged;
    private _handleTabsAdded;
    private _handleTabsRemoved;
    private _getClosestActiveTabIndex;
    private _setSelectedTab;
    private _keyboardActivateTab;
    private _skipKeyboard;
    private _isEventFromTabHeader;
    protected _handleArrowKeys(delta: -1 | 1): void;
    protected _handleHomeKey(): void;
    protected _handleEndKey(): void;
    protected _handleActivationKeys(): void;
    protected _handleClick(event: PointerEvent): void;
    protected _handleScroll(): void;
    /** Selects the specified tab and displays the corresponding panel.  */
    select(id: string): void;
    select(ref: IgcTabComponent): void;
    protected _renderScrollButton(direction: 'start' | 'end'): import("lit-html").TemplateResult<1>;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-tabs': IgcTabsComponent;
    }
}
export {};
