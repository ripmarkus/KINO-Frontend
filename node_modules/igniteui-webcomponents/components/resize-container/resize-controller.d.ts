import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { ResizeControllerConfiguration } from './types.js';
declare class ResizeController implements ReactiveController {
    private readonly _host;
    private readonly _abortHandle;
    private readonly _options;
    private _id;
    private _hasPointerCapture;
    private _state;
    private _activeRef;
    private _ghost;
    private get _element();
    private get _resizeTarget();
    private get _layer();
    /** Whether the controller is in deferred mode. */
    private get _isDeferred();
    private get _stateParameters();
    constructor(host: ReactiveControllerHost & HTMLElement, options?: ResizeControllerConfiguration);
    /** Whether the controller is enabled and will listen for events. */
    get enabled(): boolean;
    /** Updates the configuration of the resize controller. */
    set(options?: ResizeControllerConfiguration): void;
    /** Stops any resizing operation, cleaning up any additional elements and event listeners. */
    dispose(): void;
    /** @internal */
    hostConnected(): void;
    /** @internal */
    hostDisconnected(): void;
    /** @internal */
    handleEvent(event: PointerEvent & KeyboardEvent): void;
    private _handlePointerDown;
    private _handlePointerMove;
    private _handlePointerEnd;
    private _handleCancel;
    private _shouldSkip;
    private _setActiveRef;
    private _setResizeState;
    private _setResizeCancelListener;
    private _setInitialState;
    private _updateState;
    private _updatePosition;
    private _createGhostElement;
    private _removeGhostElement;
}
export declare function addResizeController(host: ReactiveControllerHost & HTMLElement, options?: ResizeControllerConfiguration): ResizeController;
export {};
