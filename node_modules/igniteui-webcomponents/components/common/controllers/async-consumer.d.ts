import { type Context, ContextConsumer, type ContextType } from '@lit/context';
import type { LitElement, ReactiveController, ReactiveControllerHost } from 'lit';
type AsyncContextOptions<T extends Context<unknown, unknown>> = {
    context: T;
    callback?: (value: ContextType<T>, dispose?: () => void) => void;
    subscribe?: boolean;
};
export declare class AsyncContextConsumer<T extends Context<unknown, unknown>, Host extends ReactiveControllerHost & HTMLElement> implements ReactiveController {
    protected _host: Host;
    protected _options: AsyncContextOptions<T>;
    protected _consumer?: ContextConsumer<T, Host>;
    constructor(host: Host, options: AsyncContextOptions<T>);
    get value(): ContextType<T> | undefined;
    hostConnected(): Promise<void>;
}
export declare function createAsyncContext<T extends Context<unknown, unknown>, Host extends ReactiveControllerHost & LitElement>(host: Host, context: T, callback?: (value: ContextType<T>, dispose?: () => void) => void): AsyncContextConsumer<T, Host>;
export {};
