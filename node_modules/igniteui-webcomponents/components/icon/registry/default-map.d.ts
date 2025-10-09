export declare class DefaultMap<T, U> {
    private _defaultValue;
    private _map;
    constructor(defaultValue: () => U);
    getOrCreate(key: T): U;
    get(key: T): U | undefined;
    set(key: T, value: U): void;
    has(key: T): boolean;
    toMap(): Map<T, U>;
    entries(): MapIterator<[T, U]>;
}
export declare function createIconDefaultMap<T, U>(): DefaultMap<T, Map<T, U>>;
