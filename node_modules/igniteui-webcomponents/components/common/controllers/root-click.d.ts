import type { ReactiveController, ReactiveControllerHost } from 'lit';
/** Configuration options for the RootClickController */
type RootClickControllerConfig = {
    /**
     * An optional callback function to execute when an outside click occurs.
     * If not provided, the `hide()` method of the host will be called.
     */
    onHide?: () => void;
    /**
     * An optional additional HTMLElement that, if clicked, should not trigger the hide action.
     * This is useful for elements like a toggle button that opens the component.
     */
    target?: HTMLElement;
};
/** Interface for the host element that the RootClickController will be attached to. */
interface RootClickControllerHost extends ReactiveControllerHost, HTMLElement {
    /**
     * Indicates whether the host element is currently open or visible.
     */
    open: boolean;
    /**
     * If true, outside clicks will not trigger the hide action.
     */
    keepOpenOnOutsideClick?: boolean;
    /**
     * A method on the host to hide or close itself.
     * This will be called if `hideCallback` is not provided in the config.
     */
    hide(): void;
}
/**
 * A Lit ReactiveController that manages global click listeners to hide a component
 * when a click occurs outside of the component or its specified target.
 *
 * This controller implements a singleton pattern for the document click listener,
 * meaning only one event listener is attached to `document` regardless of how many
 * instances of `RootClickController` are active. Each controller instance
 * subscribes to this single listener.
 */
declare class RootClickController implements ReactiveController {
    private readonly _host;
    private _config?;
    constructor(host: RootClickControllerHost, config?: RootClickControllerConfig);
    /**
     * Adds the host to the set of active hosts and ensures the global
     * document click listener is active if needed.
     */
    private _addActiveHost;
    /**
     * Removes the host from the set of active hosts and removes the global
     * document click listener if no other hosts are active.
     */
    private _removeActiveHost;
    /**
     * Configures the active state of the controller based on the host's `open` property.
     * If `host.open` is true, the controller becomes active; otherwise, it becomes inactive.
     */
    private _configureListeners;
    /** Updates the controller configuration and active state. */
    update(config?: RootClickControllerConfig): void;
    /** @internal */
    hostConnected(): void;
    /** @internal */
    hostDisconnected(): void;
}
/**
 * Creates and adds a {@link RootClickController} instance with a {@link RootClickControllerConfig | configuration}
 * to the given {@link RootClickControllerHost | host}.
 */
export declare function addRootClickController(host: RootClickControllerHost, config?: RootClickControllerConfig): RootClickController;
export type { RootClickController };
