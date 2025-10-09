import type { LitElement, ReactiveController, ReactiveControllerHost } from 'lit';
import type { Ref } from 'lit/directives/ref.js';
type DragCallback = (parameters: DragCallbackParameters) => unknown;
type DragCancelCallback = (state: DragState) => unknown;
export type DragCallbackParameters = {
    event: PointerEvent;
    state: DragState;
};
type State = {
    initial: DOMRect;
    current: DOMRect;
    position: {
        x: number;
        y: number;
    };
    offset: {
        x: number;
        y: number;
    };
    pointerState: {
        previous: {
            x: number;
            y: number;
        };
        current: {
            x: number;
            y: number;
        };
        direction: Direction;
    };
};
type DragState = State & {
    ghost: HTMLElement | null;
    element: Element | null;
};
type Direction = 'start' | 'end' | 'bottom' | 'top';
type DragControllerConfiguration = {
    /** Whether the drag feature is enabled for the current host. */
    enabled?: boolean;
    /**
     * The mode of the drag operation.
     *
     * Deferred will create a ghost element and keep the original element
     * at its place until the operation completes successfully.
     */
    mode?: 'immediate' | 'deferred';
    /**
     * Whether starting a drag operation should snap the dragged item's top left corner
     * to the cursor position.
     */
    snapToCursor?: boolean;
    /**
     * Guard function invoked during the `start` callback.
     * Returning a truthy value will stop the current drag operation.
     */
    skip?: (event: PointerEvent) => boolean;
    matchTarget?: (target: Element) => boolean;
    /**
     *
     */
    trigger?: () => HTMLElement;
    /**
     * Contain drag operations to the scope of the passed DOM element.
     */
    container?: Ref<HTMLElement>;
    /**
     * The DOM element that will "host" the ghost drag element when the controller
     * is set to **deferred**.
     *
     * @remarks
     * In **immediate** mode, this property is ignored.
     */
    layer?: () => HTMLElement;
    ghost?: () => HTMLElement;
    /** Callback invoked at the beginning of a drag operation. */
    start?: DragCallback;
    /** Callback invoked while dragging the target element.  */
    move?: DragCallback;
    enter?: DragCallback;
    leave?: DragCallback;
    over?: DragCallback;
    /** Callback invoked during a drop operation. */
    end?: DragCallback;
    /** Callback invoked when a drag is cancelled */
    cancel?: DragCancelCallback;
};
declare class DragController implements ReactiveController {
    private readonly _host;
    private readonly _options;
    private readonly _abortHandle;
    private _state;
    private _matchedElement;
    private _id;
    private _hasPointerCapture;
    private _ghost;
    /** Whether `snapToCursor` is enabled for the controller. */
    private get _hasSnapping();
    /** Whether the current drag mode is deferred. */
    private get _isDeferred();
    /**
     * The source element which will capture pointer events and initiate drag mode.
     *
     * @remarks
     * By default that will be the host element itself, unless `trigger` is passed in.
     */
    private get _element();
    /**
     * The element being dragged.
     *
     * @remarks
     * When in **deferred** mode this returns a reference to the drag ghost element,
     * otherwise it is the host element.
     */
    private get _dragItem();
    /**
     * The DOM element that will "host" the ghost drag element when the controller
     * is set to **deferred**.
     *
     * @remarks
     * In **immediate** mode, this property is ignored.
     */
    private get _layer();
    private get _stateParameters();
    constructor(host: ReactiveControllerHost & LitElement, options?: DragControllerConfiguration);
    /** Whether the drag controller is enabled. */
    get enabled(): boolean;
    /** Updates the drag controller configuration. */
    set(options?: DragControllerConfiguration): void;
    /** Stops any drag operation and cleans up state, additional event listeners and elements. */
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
    private _setDragCancelListener;
    private _setInitialState;
    private _setDragState;
    private _updateMatcher;
    private _updatePosition;
    private _updatePointerState;
    private _assignPosition;
    private _createDragGhost;
    private _removeGhost;
    private _shouldSkip;
}
/**
 * Adds a drag and drop controller to the given host
 */
export declare function addDragController(host: ReactiveControllerHost & LitElement, options?: DragControllerConfiguration): DragController;
export {};
