import { isServer } from 'lit';
import { escapeKey } from '../common/controllers/key-bindings.js';
import { isEmpty, last } from '../common/util.js';
class TooltipEscapeCallbacks {
    constructor() {
        this._collection = new Map();
    }
    _setListener(state = true) {
        if (isServer) {
            return;
        }
        if (isEmpty(this._collection)) {
            state
                ? globalThis.addEventListener('keydown', this)
                : globalThis.removeEventListener('keydown', this);
        }
    }
    add(instance, hideCallback) {
        if (this._collection.has(instance)) {
            return;
        }
        this._setListener();
        this._collection.set(instance, hideCallback);
    }
    remove(instance) {
        if (!this._collection.has(instance)) {
            return;
        }
        this._collection.delete(instance);
        this._setListener(false);
    }
    async handleEvent(event) {
        if (event.key !== escapeKey) {
            return;
        }
        const [tooltip, callback] = last(Array.from(this._collection.entries()));
        await callback?.call(tooltip);
    }
}
const service = new TooltipEscapeCallbacks();
export default service;
//# sourceMappingURL=service.js.map