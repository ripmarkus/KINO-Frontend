import type { ReactiveController } from 'lit';
import type { ComboHost, ComboValue, Item, Keys } from '../types.js';
import type { DataController } from './data.js';
export declare class SelectionController<T extends object> implements ReactiveController {
    protected host: ComboHost<T>;
    protected state: DataController<T>;
    private _selected;
    /** Whether the current selection is empty */
    get isEmpty(): boolean;
    /** Returns the current selection as an array */
    get asArray(): T[];
    /** Whether the current selection has the given item */
    has(item?: T): boolean;
    /** Clears the current selection */
    clear(): void;
    getSelectedValuesByKey(key?: Keys<T>): (T | NonNullable<T[keyof T]>)[];
    getValue(items: T[], key: Keys<T>): ComboValue<T>[];
    private handleChange;
    private getItemsByValueKey;
    private selectValueKeys;
    private deselectValueKeys;
    private selectObjects;
    private deselectObjects;
    private selectAll;
    private deselectAll;
    select(items?: Item<T> | Item<T>[], emit?: boolean): Promise<void>;
    deselect(items?: Item<T> | Item<T>[], emit?: boolean): Promise<void>;
    changeSelection(index: number): void;
    selectByIndex(index: number): void;
    constructor(host: ComboHost<T>, state: DataController<T>);
    hostConnected(): void;
    hostDisconnected(): void;
}
