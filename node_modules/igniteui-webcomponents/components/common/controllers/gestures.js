import { createAbortHandle } from '../abort-handler.js';
const Events = [
    'pointerdown',
    'pointermove',
    'lostpointercapture',
    'pointercancel',
];
const defaultState = Object.freeze({ x: 0, y: 0, time: 0 });
export class SwipeEvent extends Event {
    constructor(name, data, initOptions) {
        super(name, initOptions);
        this.name = name;
        this.data = data;
    }
}
class GesturesController extends EventTarget {
    get _element() {
        return this._ref ? this._ref.value : this._host;
    }
    get options() {
        return this._options;
    }
    constructor(host, options) {
        super();
        this._abortHandle = createAbortHandle();
        this._options = {
            thresholdDistance: 100,
            thresholdTime: 500,
            touchOnly: false,
        };
        this._pointerState = {
            captured: false,
            start: defaultState,
            current: defaultState,
        };
        Object.assign(this._options, options);
        this._ref = this._options.ref;
        this._host = host;
        this._host.addController(this);
    }
    set(type, callback, options) {
        const bound = callback.bind(this._host);
        this.addEventListener(type, bound, options);
        return this;
    }
    handleEvent(event) {
        if (this._options.touchOnly && event.pointerType === 'mouse') {
            return;
        }
        switch (event.type) {
            case 'pointerdown':
                this._handlePointerDown(event);
                break;
            case 'pointermove':
                this._handlePointerMove(event);
                break;
            case 'lostpointercapture':
            case 'pointercancel':
                this._handleLostPointerCapture(event);
        }
    }
    hostConnected() {
        const { signal } = this._abortHandle;
        this._host.updateComplete.then(() => {
            for (const event of Events) {
                this._element.addEventListener(event, this, { passive: true, signal });
            }
        });
    }
    hostDisconnected() {
        this._abortHandle.abort();
    }
    updateOptions(options) {
        Object.assign(this._options, options);
    }
    _getGestureState({ clientX: x, clientY: y, }) {
        return { x, y, time: Date.now() };
    }
    _setTouchActionState(disabled) {
        Object.assign(this._element.style, {
            touchAction: disabled ? 'none' : undefined,
        });
    }
    _resetState() {
        this._pointerState.start = defaultState;
        this._pointerState.current = defaultState;
    }
    _setPointerCaptureState(event, state) {
        this._pointerState.captured = state;
        state
            ? this._element.setPointerCapture(event.pointerId)
            : this._element.releasePointerCapture(event.pointerId);
    }
    _handlePointerDown(event) {
        this._setTouchActionState(true);
        this._pointerState.start = this._getGestureState(event);
        this._setPointerCaptureState(event, true);
    }
    _handlePointerMove(event) {
        if (this._pointerState.captured) {
            this._pointerState.current = this._getGestureState(event);
        }
    }
    _emit(name, data) {
        return this.dispatchEvent(new SwipeEvent(name, data));
    }
    _createEventArgs() {
        const { start, current } = this._pointerState;
        return {
            xStart: start.x,
            xEnd: current.x,
            yStart: start.y,
            yEnd: current.y,
        };
    }
    _recognize() {
        const { start, current } = this._pointerState;
        const dt = current.time - start.time;
        const dx = current.x - start.x;
        const dy = current.y - start.y;
        const time = this._options.thresholdTime ?? 500;
        const distance = this._options.thresholdDistance ?? 100;
        if (dt > time) {
            return false;
        }
        if (dx > distance && Math.abs(dy) < distance) {
            return 'right';
        }
        if (-dx > distance && Math.abs(dy) < distance) {
            return 'left';
        }
        if (dy > distance && Math.abs(dx) < distance) {
            return 'down';
        }
        if (-dy > distance && Math.abs(dx) < distance) {
            return 'up';
        }
        return false;
    }
    _handleLostPointerCapture(event) {
        this._setPointerCaptureState(event, false);
        const state = this._recognize();
        if (state) {
            const args = Object.assign(this._createEventArgs(), {
                type: event.pointerType,
                direction: state,
            });
            this._emit('swipe', args);
            this._emit(`swipe-${state}`, args);
        }
        this._resetState();
        this._setTouchActionState(false);
    }
}
export function addGesturesController(host, options) {
    return new GesturesController(host, options);
}
//# sourceMappingURL=gestures.js.map