import type { Ref } from 'lit/directives/ref.js';
import type IgcTabComponent from './tab.js';
import type IgcTabsComponent from './tabs.js';
declare class TabsHelpers {
    private static readonly SCROLL_AMOUNT;
    private readonly _host;
    private readonly _container;
    private readonly _indicator;
    private _styleProperties;
    private _hasScrollButtons;
    private _scrollButtonsDisabled;
    private _isLeftToRight;
    /**
     * Returns the DOM container holding the tabs headers.
     */
    get container(): HTMLElement | undefined;
    /**
     * Returns the selected indicator DOM element.
     */
    get indicator(): HTMLElement | undefined;
    /**
     * Returns the internal CSS variables used for the layout of the tabs component.
     */
    get styleProperties(): {
        '--_tabs-count': string;
        '--_ig-tabs-width': string;
    };
    /**
     * Whether the scroll buttons of the tabs header strip should be shown.
     */
    get hasScrollButtons(): boolean;
    /**
     * Returns the disabled state of the tabs header strip scroll buttons.
     */
    get scrollButtonsDisabled(): {
        start: boolean;
        end: boolean;
    };
    get isLeftToRightChanged(): boolean;
    constructor(host: IgcTabsComponent, container: Ref<HTMLElement>, indicator: Ref<HTMLElement>);
    /**
     * Sets the internal CSS variables used for the layout of the tabs component.
     * Triggers an update cycle (rerender) of the `igc-tabs` component.
     */
    setStyleProperties(): void;
    /**
     * Sets the type of the `scroll-snap-align` CSS property for the tabs header strip.
     */
    setScrollSnap(type?: 'start' | 'end'): void;
    /**
     * Scrolls the tabs header strip in the given direction with `scroll-snap-align` set.
     */
    scrollTabs(direction: 'start' | 'end'): void;
    /**
     * Updates the state of the tabs header strip scroll buttons - visibility and active state.
     * Triggers an update cycle (rerender) of the `igc-tabs` component.
     */
    setScrollButtonState(): void;
    /**
     * Updates the indicator DOM element styles based on the current "active" tab.
     */
    setIndicator(active?: IgcTabComponent): Promise<void>;
}
export declare function createTabHelpers(host: IgcTabsComponent, container: Ref<HTMLElement>, indicator: Ref<HTMLElement>): TabsHelpers;
export declare function getTabHeader(tab: IgcTabComponent): HTMLElement;
export {};
