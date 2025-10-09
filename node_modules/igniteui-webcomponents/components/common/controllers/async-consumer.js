import { ContextConsumer } from '@lit/context';
export class AsyncContextConsumer {
    constructor(host, options) {
        this._host = host;
        this._options = options;
        this._host.addController(this);
    }
    get value() {
        return this._consumer?.value;
    }
    async hostConnected() {
        await this._host.updateComplete;
        if (!this._consumer) {
            this._consumer = new ContextConsumer(this._host, {
                context: this._options.context,
                callback: this._options.callback,
                subscribe: this._options.subscribe,
            });
        }
    }
}
export function createAsyncContext(host, context, callback) {
    return new AsyncContextConsumer(host, {
        context,
        callback,
        subscribe: true,
    });
}
//# sourceMappingURL=async-consumer.js.map