import { isElement } from '../util.js';
function applyNodeFilter(nodes, predicate) {
    if (!predicate) {
        return nodes;
    }
    return Array.isArray(predicate)
        ? nodes.filter((node) => isElement(node) &&
            predicate.some((selector) => node.matches(selector)))
        : nodes.filter(predicate);
}
class MutationController {
    constructor(host, options) {
        this._host = host;
        this._callback = options.callback;
        this._config = options.config;
        this._target = options.target ?? this._host;
        this._filter = options.filter;
        this._observer = new MutationObserver((records) => {
            this.disconnect();
            this._callback.call(this._host, this._process(records));
            this.observe();
        });
        host.addController(this);
    }
    hostConnected() {
        this.observe();
    }
    hostDisconnected() {
        this.disconnect();
    }
    _process(records) {
        const predicate = this._filter;
        const changes = {
            attributes: [],
            added: [],
            removed: [],
        };
        for (const record of records) {
            const { type, target, attributeName, addedNodes, removedNodes } = record;
            if (type === 'attributes') {
                changes.attributes.push(...applyNodeFilter([target], predicate).map((node) => ({
                    node,
                    attributeName,
                })));
            }
            else if (type === 'childList') {
                changes.added.push(...applyNodeFilter([...addedNodes], predicate).map((node) => ({
                    target: target,
                    node,
                })));
                changes.removed.push(...applyNodeFilter([...removedNodes], predicate).map((node) => ({
                    target: target,
                    node,
                })));
            }
        }
        return { records, changes, observer: this };
    }
    observe() {
        this._observer.observe(this._target, this._config);
    }
    disconnect() {
        this._observer.disconnect();
    }
}
export function createMutationController(host, config) {
    return new MutationController(host, config);
}
//# sourceMappingURL=mutation-observer.js.map