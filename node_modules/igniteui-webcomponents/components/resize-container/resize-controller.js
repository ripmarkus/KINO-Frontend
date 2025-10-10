import { createAbortHandle } from '../common/abort-handler.js';
import { findElementFromEventPath } from '../common/util.js';
import { createDefaultGhostElement, getDefaultLayer } from './default-ghost.js';
const additionalEvents = [
    'pointermove',
    'lostpointercapture',
    'contextmenu',
];
class ResizeController {
    get _element() {
        return this._activeRef ?? this._host;
    }
    get _resizeTarget() {
        return this._options.resizeTarget?.call(this._host) ?? this._host;
    }
    get _layer() {
        if (!this._isDeferred) {
            return this._host;
        }
        return this._options.layer?.() ?? this._host;
    }
    get _isDeferred() {
        return this._options.mode === 'deferred';
    }
    get _stateParameters() {
        const { initial, current } = this._state;
        return {
            initial,
            current,
            deltaX: current.width - initial.width,
            deltaY: current.height - initial.height,
            ghost: this._ghost,
            trigger: this._activeRef,
        };
    }
    constructor(host, options) {
        this._abortHandle = createAbortHandle();
        this._options = {
            enabled: true,
            layer: getDefaultLayer,
        };
        this._id = -1;
        this._hasPointerCapture = false;
        this._activeRef = null;
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
        this._setResizeState(false);
        this._removeGhostElement();
        this._activeRef = null;
    }
    hostConnected() {
        const { signal } = this._abortHandle;
        this._host.addEventListener('pointerdown', this, { signal });
        this._host.addEventListener('touchstart', this, { passive: false, signal });
    }
    hostDisconnected() {
        this._abortHandle.abort();
        this._setResizeCancelListener(false);
        this._removeGhostElement();
    }
    handleEvent(event) {
        if (!this.enabled) {
            return;
        }
        switch (event.type) {
            case 'touchstart':
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
        if (event.button || this._shouldSkip(event)) {
            return;
        }
        this._setInitialState(event);
        this._createGhostElement();
        const parameters = { event, state: this._stateParameters };
        if (this._options.start?.call(this._host, parameters) === false) {
            this.dispose();
            return;
        }
        this._setResizeState();
    }
    _handlePointerMove(event) {
        if (!this._hasPointerCapture) {
            return;
        }
        this._updateState(event);
        const parameters = { event, state: this._stateParameters };
        this._options.resize?.call(this._host, parameters);
        this._state.current = parameters.state.current;
        this._updatePosition(this._isDeferred ? this._ghost : this._resizeTarget);
    }
    _handlePointerEnd(event) {
        const parameters = { event, state: this._stateParameters };
        this._options.end?.call(this._host, parameters);
        this._state.current = parameters.state.current;
        parameters.state.commit?.() ?? this._updatePosition(this._resizeTarget);
        this.dispose();
    }
    _handleCancel(event) {
        const key = event.key.toLowerCase();
        if (this._hasPointerCapture && key === 'escape') {
            this._options.cancel?.call(this._host, this._stateParameters);
        }
    }
    _shouldSkip(event) {
        this._setActiveRef(event);
        return !this._activeRef;
    }
    _setActiveRef(event) {
        const refs = this._options.ref?.map(({ value }) => value) ?? [this._host];
        this._activeRef =
            findElementFromEventPath((e) => refs.includes(e), event) ?? null;
    }
    _setResizeState(enabled = true) {
        this._hasPointerCapture = enabled;
        enabled
            ? this._element.setPointerCapture(this._id)
            : this._element.releasePointerCapture(this._id);
        this._setResizeCancelListener(enabled);
        for (const type of additionalEvents) {
            enabled
                ? this._host.addEventListener(type, this)
                : this._host.removeEventListener(type, this);
        }
    }
    _setResizeCancelListener(enabled = true) {
        enabled
            ? globalThis.addEventListener('keydown', this)
            : globalThis.removeEventListener('keydown', this);
    }
    _setInitialState({ pointerId }) {
        const dimensions = this._resizeTarget.getBoundingClientRect();
        this._id = pointerId;
        this._state = {
            initial: dimensions,
            current: structuredClone(dimensions),
        };
    }
    _updateState({ clientX, clientY }) {
        this._state.current.width = clientX - this._state.initial.x;
        this._state.current.height = clientY - this._state.initial.y;
    }
    _updatePosition(element) {
        if (element) {
            Object.assign(element.style, {
                width: `${this._state.current.width}px`,
                height: `${this._state.current.height}px`,
            });
        }
    }
    _createGhostElement() {
        if (!this._isDeferred) {
            return;
        }
        this._ghost =
            this._options.deferredFactory?.call(this._host) ??
                createDefaultGhostElement(this._resizeTarget.getBoundingClientRect());
        this._ghost.setAttribute('data-resize-ghost', '');
        this._layer.append(this._ghost);
    }
    _removeGhostElement() {
        this._ghost?.remove();
        this._ghost = null;
    }
}
export function addResizeController(host, options) {
    return new ResizeController(host, options);
}
//# sourceMappingURL=resize-controller.js.map