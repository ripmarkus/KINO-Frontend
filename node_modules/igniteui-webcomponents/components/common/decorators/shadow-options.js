import { LitElement } from 'lit';
export function shadowOptions(options) {
    return (proto) => {
        proto.shadowRootOptions = {
            ...LitElement.shadowRootOptions,
            ...options,
        };
    };
}
//# sourceMappingURL=shadow-options.js.map