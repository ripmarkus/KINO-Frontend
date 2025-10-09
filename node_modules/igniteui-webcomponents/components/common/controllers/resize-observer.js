import { isServer, } from 'lit';
class ResizeObserverController {
    constructor(host, config) {
        this._targets = new Set();
        this._host = host;
        this._config = config;
        if (this._config.target !== null) {
            this._targets.add(this._config.target ?? host);
        }
        if (isServer) {
            return;
        }
        this._observer = new ResizeObserver((entries) => this._config.callback.call(this._host, entries, this._observer));
        host.addController(this);
    }
    observe(target) {
        this._targets.add(target);
        this._observer.observe(target, this._config.options);
        this._host.requestUpdate();
    }
    unobserve(target) {
        this._targets.delete(target);
        this._observer.unobserve(target);
    }
    hostConnected() {
        for (const target of this._targets) {
            this.observe(target);
        }
    }
    hostDisconnected() {
        this._observer.disconnect();
    }
}
export function createResizeObserverController(host, config) {
    return new ResizeObserverController(host, config);
}
//# sourceMappingURL=resize-observer.js.map