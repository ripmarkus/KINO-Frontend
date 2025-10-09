class AbortHandle {
    constructor() {
        this._controller = new AbortController();
    }
    get signal() {
        return this._controller.signal;
    }
    abort(reason) {
        this._controller.abort(reason);
        this._controller = new AbortController();
    }
    reset() {
        this._controller = new AbortController();
    }
}
export function createAbortHandle() {
    return new AbortHandle();
}
//# sourceMappingURL=abort-handler.js.map