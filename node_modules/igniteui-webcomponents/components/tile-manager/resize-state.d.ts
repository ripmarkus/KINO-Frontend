import type { ResizeState } from '../resize-container/types.js';
import type IgcTileComponent from './tile.js';
import type { TileGridDimension, TileGridPosition, TileResizeDimensions } from './types.js';
declare class TileResizeState {
    private _initialPosition;
    private _resizeUtil;
    protected _gap: number;
    protected _prevDeltaX: number;
    protected _prevDeltaY: number;
    protected _prevSnappedWidth: number;
    protected _prevSnappedHeight: number;
    protected _position: TileGridPosition;
    protected _columns: TileGridDimension;
    protected _rows: TileGridDimension;
    resizedDimensions: TileResizeDimensions;
    get gap(): number;
    get position(): TileGridPosition;
    get columns(): TileGridDimension;
    get rows(): TileGridDimension;
    calculateSnappedWidth(state: ResizeState): number;
    calculateSnappedHeight(state: ResizeState): number;
    updateState(tileRect: DOMRect, tile: IgcTileComponent, grid: HTMLElement): void;
    /**
     * Calculates and returns the CSS column and row properties of a tile after resizing,
     * based on its new dimensions and starting position.
     */
    calculateResizedGridPosition(rect: DOMRect): {
        colSpan: number;
        rowSpan: number;
    };
    private initState;
    private calculateTileStartPosition;
    private getGridOffset;
    private getResizeProps;
    private getResizeSpanProps;
}
export declare function createTileResizeState(): TileResizeState;
export {};
