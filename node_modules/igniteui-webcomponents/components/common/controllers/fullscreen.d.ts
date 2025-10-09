import type { ReactiveController, ReactiveControllerHost } from 'lit';
/**
 * Callback invoked when the host element is about to enter/leave fullscreen mode.
 *
 * The callback is passed the current fullscreen `state`.
 * Returning a falsy value from the callback will stop the current fullscreen state change.
 */
type FullscreenControllerCallback = (state: boolean) => boolean;
/** Configuration object for the fullscreen controller. */
type FullscreenControllerConfiguration = {
    /**
     * Invoked when the host element is entering fullscreen mode.
     * See the {@link FullscreenControllerCallback} for details.
     */
    enter?: FullscreenControllerCallback;
    /**
     * Invoked when the host element is leaving fullscreen mode.
     * See the {@link FullscreenControllerCallback} for details.
     */
    exit?: FullscreenControllerCallback;
};
declare class FullscreenController implements ReactiveController {
    private _host;
    private _options;
    private _fullscreen;
    get fullscreen(): boolean;
    constructor(host: ReactiveControllerHost & HTMLElement, options?: FullscreenControllerConfiguration);
    /**
     * Transitions the host element to/from fullscreen mode.
     * This method **will invoke** enter/exit callbacks if present.
     */
    setState(fullscreen: boolean): void;
    /** @internal */
    handleEvent(): void;
    /** @internal */
    hostConnected(): void;
    /** @internal */
    hostDisconnected(): void;
}
export declare function addFullscreenController(host: ReactiveControllerHost & HTMLElement, options?: FullscreenControllerConfiguration): FullscreenController;
export {};
