import { getDefaultLayer } from '../../resize-container/default-ghost.js';
import { createAbortHandle } from '../abort-handler.js';
import { findElementFromEventPath, getRoot, isLTR, roundByDPR, } from '../util.js';
const additionalEvents = [
    'pointermove',
    'lostpointercapture',
    'contextmenu',
];
class DragController {
    get _hasSnapping() {
        return Boolean(this._options.snapToCursor);
    }
    get _isDeferred() {
        return this._options.mode === 'deferred';
    }
    get _element() {
        return this._options.trigger?.() ?? this._host;
    }
    get _dragItem() {
        return this._isDeferred ? this._ghost : this._host;
    }
    get _layer() {
        if (!this._isDeferred) {
            return this._host;
        }
        return this._options.layer?.() ?? this._host;
    }
    get _stateParameters() {
        return {
            ...this._state,
            ghost: this._ghost,
            element: this._matchedElement,
        };
    }
    constructor(host, options) {
        this._options = {
            enabled: true,
            mode: 'deferred',
            snapToCursor: false,
            layer: getDefaultLayer,
        };
        this._abortHandle = createAbortHandle();
        this._id = -1;
        this._hasPointerCapture = false;
        this._ghost = null;
        this._host = host;
        this._host.addController(this);
        this.set(options);
    }
    get enabled() {
        return Boolean(this._options.enabled);
    }
    set(options) {
        Object.assign(this._options, options);
    }
    dispose() {
        this._matchedElement = null;
        this._removeGhost();
        this._setDragState(false);
    }
    hostConnected() {
        const { signal } = this._abortHandle;
        this._host.addEventListener('dragstart', this, { signal });
        this._host.addEventListener('touchstart', this, { passive: false, signal });
        this._host.addEventListener('pointerdown', this, { signal });
    }
    hostDisconnected() {
        this._abortHandle.abort();
        this._setDragCancelListener(false);
        this._removeGhost();
    }
    handleEvent(event) {
        if (!this.enabled) {
            return;
        }
        switch (event.type) {
            case 'touchstart':
            case 'dragstart':
            case 'contextmenu':
                event.preventDefault();
                break;
            case 'keydown':
                this._handleCancel(event);
                break;
            case 'pointerdown':
                this._handlePointerDown(event);
                break;
            case 'pointermove':
                this._handlePointerMove(event);
                break;
            case 'lostpointercapture':
                this._handlePointerEnd(event);
                break;
        }
    }
    _handlePointerDown(event) {
        if (this._shouldSkip(event)) {
            return;
        }
        this._setInitialState(event);
        this._createDragGhost();
        this._updatePosition(event);
        const parameters = {
            event,
            state: this._stateParameters,
        };
        if (this._options.start?.call(this._host, parameters) === false) {
            this.dispose();
            return;
        }
        this._assignPosition(this._dragItem);
        this._setDragState();
    }
    _handlePointerMove(event) {
        if (!this._hasPointerCapture) {
            return;
        }
        this._updatePosition(event);
        this._updatePointerState(event);
        this._updateMatcher(event);
        const parameters = {
            event,
            state: this._stateParameters,
        };
        this._options.move?.call(this._host, parameters);
        this._assignPosition(this._dragItem);
    }
    _handlePointerEnd(event) {
        this._options.end?.call(this._host, {
            event,
            state: this._stateParameters,
        });
        this.dispose();
    }
    _handleCancel(event) {
        const key = event.key.toLowerCase();
        if (this._hasPointerCapture && key === 'escape') {
            this._options.cancel?.call(this._host, this._stateParameters);
        }
    }
    _setDragCancelListener(enabled = true) {
        enabled
            ? globalThis.addEventListener('keydown', this)
            : globalThis.removeEventListener('keydown', this);
    }
    _setInitialState({ pointerId, clientX, clientY, }) {
        const rect = this._host.getBoundingClientRect();
        const position = { x: rect.x, y: rect.y };
        const offset = { x: rect.x - clientX, y: rect.y - clientY };
        this._id = pointerId;
        this._state = {
            initial: rect,
            current: structuredClone(rect),
            position,
            offset,
            pointerState: {
                previous: { x: clientX, y: clientY },
                current: { x: clientX, y: clientY },
                direction: 'end',
            },
        };
    }
    _setDragState(enabled = true) {
        this._hasPointerCapture = enabled;
        const cssValue = enabled ? 'none' : '';
        Object.assign(this._element.style, {
            touchAction: cssValue,
            userSelect: cssValue,
        });
        enabled
            ? this._element.setPointerCapture(this._id)
            : this._element.releasePointerCapture(this._id);
        this._setDragCancelListener(enabled);
        for (const type of additionalEvents) {
            enabled
                ? this._host.addEventListener(type, this)
                : this._host.removeEventListener(type, this);
        }
    }
    _updateMatcher(event) {
        if (!this._options.matchTarget) {
            return;
        }
        const match = getRoot(this._host)
            .elementsFromPoint(event.clientX, event.clientY)
            .find((element) => this._options.matchTarget.call(this._host, element));
        if (match && !this._matchedElement) {
            this._matchedElement = match;
            this._options.enter?.call(this._host, {
                event,
                state: this._stateParameters,
            });
            return;
        }
        if (!match && this._matchedElement) {
            this._options.leave?.call(this._host, {
                event,
                state: this._stateParameters,
            });
            this._matchedElement = null;
            return;
        }
        if (match && match === this._matchedElement) {
            this._options.over?.call(this._host, {
                event,
                state: this._stateParameters,
            });
        }
    }
    _updatePosition({ clientX, clientY }) {
        const { x, y } = this._state.offset;
        const { x: layerX, y: layerY } = this._isDeferred
            ? this._layer.getBoundingClientRect()
            : this._state.initial;
        const posX = this._hasSnapping ? clientX - layerX : clientX - layerX + x;
        const posY = this._hasSnapping ? clientY - layerY : clientY - layerY + y;
        this._state.position = { x: posX, y: posY };
    }
    _updatePointerState({ clientX, clientY }) {
        const state = this._state.pointerState;
        state.previous = { ...state.current };
        state.current = { x: clientX, y: clientY };
        const dx = state.current.x - state.previous.x;
        const dy = state.current.y - state.previous.y;
        if (Math.abs(dx) >= Math.abs(dy)) {
            const swapHorizontal = isLTR(this._host) ? dx >= 0 : dx <= 0;
            state.direction = swapHorizontal ? 'end' : 'start';
        }
        else {
            state.direction = dy >= 0 ? 'bottom' : 'top';
        }
    }
    _assignPosition(element) {
        element.style.transform = `translate3d(${roundByDPR(this._state.position.x)}px,${roundByDPR(this._state.position.y)}px,0)`;
    }
    _createDragGhost() {
        if (!this._isDeferred) {
            return;
        }
        this._ghost =
            this._options.ghost?.call(this._host) ??
                createDefaultDragGhost(this._host.getBoundingClientRect());
        this._layer.append(this._ghost);
    }
    _removeGhost() {
        this._ghost?.remove();
        this._ghost = null;
    }
    _shouldSkip(event) {
        return (Boolean(event.button) ||
            this._options.skip?.call(this._host, event) ||
            !findElementFromEventPath((e) => e === this._element, event));
    }
}
function createDefaultDragGhost({ x, y, width, height }) {
    const element = document.createElement('div');
    Object.assign(element.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 1000,
        background: 'gold',
    });
    return element;
}
export function addDragController(host, options) {
    return new DragController(host, options);
}
//# sourceMappingURL=drag.js.map