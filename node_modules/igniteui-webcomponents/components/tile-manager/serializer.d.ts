import type IgcTileManagerComponent from './tile-manager.js';
export interface SerializedTile {
    colSpan: number;
    colStart: number | null;
    disableFullscreen: boolean;
    disableMaximize: boolean;
    disableResize: boolean;
    maximized: boolean;
    position: number;
    rowSpan: number;
    rowStart: number | null;
    id: string | null;
}
declare class TileManagerSerializer {
    tileManager: IgcTileManagerComponent;
    constructor(tileManager: IgcTileManagerComponent);
    save(): SerializedTile[];
    saveAsJSON(): string;
    load(tiles: SerializedTile[]): void;
    loadFromJSON(data: string): void;
}
export declare function createSerializer(host: IgcTileManagerComponent): TileManagerSerializer;
export {};
