import type { ReactiveController, ReactiveControllerHost } from 'lit';
/** @ignore */
export interface MutationControllerConfig<T extends Node = Node> {
    /** The callback function to run when a mutation occurs. */
    callback: MutationControllerCallback<T>;
    /** The underlying mutation observer configuration parameters. */
    config: MutationObserverInit;
    /**
     * The element to observe.
     * If left out, the observer will listen on the host component itself.
     */
    target?: Element;
    /**
     * A filter configuration.
     * See {@link MutationControllerFilter|this} for additional information.
     */
    filter?: MutationControllerFilter<T>;
}
type MutationControllerCallback<T extends Node = Node> = (params: MutationControllerParams<T>) => unknown;
/**
 * Filter configuration to return elements that either match
 * an array of selector strings or a predicate function.
 */
type MutationControllerFilter<T extends Node = Node> = string[] | ((node: T) => boolean);
type MutationDOMChange<T extends Node = Node> = {
    /** The parent of the added/removed element. */
    target: Element;
    /** The added/removed element. */
    node: T;
};
type MutationAttributeChange<T extends Node = Node> = {
    /** The host element of the changed attribute. */
    node: T;
    /** The changed attribute name. */
    attributeName: string | null;
};
type MutationChange<T extends Node = Node> = {
    /** Elements that have attribute(s) changes. */
    attributes: MutationAttributeChange<T>[];
    /** Elements that have been added. */
    added: MutationDOMChange<T>[];
    /** Elements that have been removed. */
    removed: MutationDOMChange<T>[];
};
export type MutationControllerParams<T extends Node = Node> = {
    /** The original mutation records from the underlying observer. */
    records: MutationRecord[];
    /** The aggregated changes. */
    changes: MutationChange<T>;
    /** The observer controller instance. */
    observer: MutationController<T>;
};
declare class MutationController<T extends Node = Node> implements ReactiveController {
    private readonly _host;
    private readonly _observer;
    private readonly _target;
    private readonly _config;
    private readonly _callback;
    private readonly _filter?;
    constructor(host: ReactiveControllerHost & Element, options: MutationControllerConfig<T>);
    /** @internal */
    hostConnected(): void;
    /** @internal */
    hostDisconnected(): void;
    private _process;
    /**
     * Begin receiving notifications of changes to the DOM based
     * on the configured {@link MutationControllerConfig.target|target} and observer {@link MutationControllerConfig.config|options}.
     */
    observe(): void;
    /** Stop watching for mutations. */
    disconnect(): void;
}
/**
 * Creates and attaches a mutation controller with `config` to the passed in `host`.
 *
 * Automatically starts/stops observing for mutation changes
 * in the respective component connect/disconnect callbacks.
 *
 * The mutation observer is disconnected before invoking the passed in callback and re-attached
 * after that in order to not loop itself in endless stream of changes.
 */
export declare function createMutationController<T extends Node = Node>(host: ReactiveControllerHost & Element, config: MutationControllerConfig<T>): MutationController<T>;
export {};
