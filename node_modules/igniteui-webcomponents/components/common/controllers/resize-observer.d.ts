import { type ReactiveController, type ReactiveControllerHost } from 'lit';
type ResizeObserverControllerCallback = (...args: Parameters<ResizeObserverCallback>) => unknown;
/**
 * Configuration for initializing a resize controller.
 * @ignore
 */
export interface ResizeObserverControllerConfig {
    /** The callback function to run when a resize mutation is triggered. */
    callback: ResizeObserverControllerCallback;
    /** Configuration options passed to the underlying ResizeObserver. */
    options?: ResizeObserverOptions;
    /**
     * The initial target element to observe for resize mutations.
     *
     * If not provided, the host element will be set as initial target.
     * Pass in `null` to skip setting an initial target.
     */
    target?: Element | null;
}
declare class ResizeObserverController implements ReactiveController {
    private readonly _host;
    private readonly _targets;
    private readonly _observer;
    private readonly _config;
    constructor(host: ReactiveControllerHost & Element, config: ResizeObserverControllerConfig);
    /** Starts observing the `targe` element. */
    observe(target: Element): void;
    /** Stops observing the `target` element. */
    unobserve(target: Element): void;
    /** @internal */
    hostConnected(): void;
    /** @internal */
    hostDisconnected(): void;
}
/**
 * Creates a new resize controller bound to the given `host`
 * with {@link ResizeObserverControllerConfig | `config`}.
 */
export declare function createResizeObserverController(host: ReactiveControllerHost & Element, config: ResizeObserverControllerConfig): ResizeObserverController;
export {};
