import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { PopoverScrollStrategy } from '../../types.js';
type RootScrollControllerConfig = {
    hideCallback?: () => void;
    resetListeners?: boolean;
};
type RootScrollControllerHost = ReactiveControllerHost & {
    open: boolean;
    hide(): void;
    scrollStrategy?: PopoverScrollStrategy;
};
declare class RootScrollController implements ReactiveController {
    private readonly host;
    private config?;
    private _cache;
    constructor(host: RootScrollControllerHost, config?: RootScrollControllerConfig | undefined);
    private configureListeners;
    private hide;
    private addEventListeners;
    private removeEventListeners;
    handleEvent(event: Event): void;
    private _block;
    update(config?: RootScrollControllerConfig): void;
    hostConnected(): void;
    hostDisconnected(): void;
}
export declare function addRootScrollHandler(host: RootScrollControllerHost, config?: RootScrollControllerConfig): RootScrollController;
export {};
