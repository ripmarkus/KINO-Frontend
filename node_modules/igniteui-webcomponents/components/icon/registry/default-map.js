export class DefaultMap {
    constructor(defaultValue) {
        this._map = new Map();
        this._defaultValue = defaultValue;
    }
    getOrCreate(key) {
        if (!this._map.has(key)) {
            this._map.set(key, this._defaultValue());
        }
        return this._map.get(key);
    }
    get(key) {
        return this._map.get(key);
    }
    set(key, value) {
        this._map.set(key, value);
    }
    has(key) {
        return this._map.has(key);
    }
    toMap() {
        return this._map;
    }
    entries() {
        return this._map.entries();
    }
}
export function createIconDefaultMap() {
    return new DefaultMap(() => new Map());
}
//# sourceMappingURL=default-map.js.map