class TileManagerSerializer {
    constructor(tileManager) {
        this.tileManager = tileManager;
    }
    save() {
        return this.tileManager.tiles.map((tile) => {
            return {
                colSpan: tile.colSpan,
                colStart: tile.colStart,
                disableFullscreen: tile.disableFullscreen,
                disableMaximize: tile.disableMaximize,
                disableResize: tile.disableResize,
                maximized: tile.maximized,
                position: tile.position,
                rowSpan: tile.rowSpan,
                rowStart: tile.rowStart,
                id: tile.id,
            };
        });
    }
    saveAsJSON() {
        return JSON.stringify(this.save());
    }
    load(tiles) {
        const mapped = new Map(tiles.map((tile) => [tile.id, tile]));
        for (const tile of this.tileManager.tiles) {
            if (!mapped.has(tile.id)) {
                continue;
            }
            const serialized = mapped.get(tile.id);
            Object.assign(tile, serialized);
        }
    }
    loadFromJSON(data) {
        if (!data)
            return;
        this.load(JSON.parse(data));
    }
}
export function createSerializer(host) {
    return new TileManagerSerializer(host);
}
//# sourceMappingURL=serializer.js.map