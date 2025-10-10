import { LitElement } from 'lit';
import type { TileManagerDragMode, TileManagerResizeMode } from '../types.js';
import IgcTileComponent from './tile.js';
/**
 * The tile manager component enables the dynamic arrangement, resizing, and interaction of tiles.
 *
 * @element igc-tile-manager
 *
 * @slot - Default slot for the tile manager. Only `igc-tile` elements will be projected inside the CSS grid container.
 *
 * @csspart base - The tile manager CSS Grid container.
 *
 * @cssproperty --column-count - The number of columns for the tile manager. The `column-count` attribute sets this variable.
 * @cssproperty --min-col-width - The minimum size of the columns in the tile-manager. The `min-column-width` attribute sets this variable.
 * @cssproperty --min-row-height - The minimum size of the rows in the tile-manager. The `min-row-height` attribute sets this variable.
 * @cssproperty --grid-gap - The gap size of the underlying CSS grid container. The `gap` attributes sts this variable.
 *
 */
export default class IgcTileManagerComponent extends LitElement {
    static readonly tagName = "igc-tile-manager";
    static styles: import("lit").CSSResult[];
    static register(): void;
    private _internalStyles;
    private _dragMode;
    private _resizeMode;
    private _columnCount;
    private _gap?;
    private _minColWidth?;
    private _minRowHeight?;
    private _serializer;
    private _tilesState;
    private _grid;
    private _context;
    private _createContext;
    private _setManagerContext;
    /**
     * Whether resize operations are enabled.
     *
     * @attr resize-mode
     * @default none
     */
    set resizeMode(value: TileManagerResizeMode);
    get resizeMode(): TileManagerResizeMode;
    /**
     * Whether drag and drop operations are enabled.
     *
     * @attr drag-mode
     * @default none
     */
    set dragMode(value: TileManagerDragMode);
    get dragMode(): TileManagerDragMode;
    /**
     * Sets the number of columns for the tile manager.
     * Setting value <= than zero will trigger a responsive layout.
     *
     * @attr column-count
     * @default 0
     */
    set columnCount(value: number);
    get columnCount(): number;
    /**
     * Sets the minimum width for a column unit in the tile manager.
     * @attr min-column-width
     */
    set minColumnWidth(value: string | undefined);
    get minColumnWidth(): string | undefined;
    /**
     * Sets the minimum height for a row unit in the tile manager.
     * @attr min-row-height
     */
    set minRowHeight(value: string | undefined);
    get minRowHeight(): string | undefined;
    /**
     * Sets the gap size between tiles in the tile manager.
     *
     * @attr gap
     */
    set gap(value: string | undefined);
    get gap(): string | undefined;
    /**
     * Gets the tiles sorted by their position in the layout.
     * @property
     */
    get tiles(): IgcTileComponent[];
    constructor();
    protected updated(): void;
    protected firstUpdated(): void;
    private _observerCallback;
    /**
     * Returns the properties of the current tile collections as a JSON payload.
     *
     * @remarks
     * The content of the tiles is not serialized or saved. Only tile properties
     * are serialized.
     */
    saveLayout(): string;
    /**
     * Restores a previously serialized state produced by `saveLayout`.
     */
    loadLayout(data: string): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-tile-manager': IgcTileManagerComponent;
    }
}
