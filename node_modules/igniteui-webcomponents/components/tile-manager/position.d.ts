import type IgcTileComponent from './tile.js';
import type IgcTileManagerComponent from './tile-manager.js';
declare class TilesState {
    private _nextEmptyPosition;
    manager: IgcTileManagerComponent;
    private get _tiles();
    /**
     * Returns the current tiles of the tile manager sorted by their position.
     */
    get tiles(): IgcTileComponent[];
    constructor(manager: IgcTileManagerComponent);
    assignPositions(): void;
    /** Updates the default (manual) slot of the tile manager with the current tiles. */
    assignTiles(): void;
    add(tile: IgcTileComponent): void;
    /**
     * Checks and adjusts tile spans based on the column count of the tile manager.
     */
    adjustTileGridPosition(): void;
    remove(tile: IgcTileComponent): void;
}
type TileDragStackEntry = {
    tile: IgcTileComponent;
    position: number;
    column?: number | null;
    row?: number | null;
};
declare class TileDragStack {
    private _stack;
    peek(): IgcTileComponent;
    pop(): TileDragStackEntry | undefined;
    push(tile: IgcTileComponent): void;
    restore(): void;
    reset(): void;
}
export declare function createTilesState(manager: IgcTileManagerComponent): TilesState;
export declare function createTileDragStack(): TileDragStack;
export declare function swapTiles(a: IgcTileComponent, b: IgcTileComponent): void;
export {};
