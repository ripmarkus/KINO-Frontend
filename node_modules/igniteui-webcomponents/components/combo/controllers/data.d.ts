import type { ReactiveController } from 'lit';
import FilterDataOperation from '../operations/filter.js';
import GroupDataOperation from '../operations/group.js';
import type { ComboHost, ComboRecord, FilteringOptions, GroupingOptions } from '../types.js';
export declare class DataController<T extends object> implements ReactiveController {
    protected host: ComboHost<T>;
    protected grouping: GroupDataOperation<T>;
    protected filtering: FilterDataOperation<T>;
    private _searchTerm;
    private _compareCollator;
    dataState: ComboRecord<T>[];
    constructor(host: ComboHost<T>);
    runPipeline(): void;
    set searchTerm(value: string);
    get searchTerm(): string;
    get filteringOptions(): FilteringOptions<T>;
    get groupingOptions(): GroupingOptions<T>;
    get compareCollator(): Intl.Collator;
    private index;
    hostConnected(): void;
    apply(data: T[]): ComboRecord<T>[];
}
