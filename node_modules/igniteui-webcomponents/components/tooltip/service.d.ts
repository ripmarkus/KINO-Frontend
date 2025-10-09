import type IgcTooltipComponent from './tooltip.js';
type TooltipHideCallback = () => unknown;
declare class TooltipEscapeCallbacks {
    private _collection;
    private _setListener;
    add(instance: IgcTooltipComponent, hideCallback: TooltipHideCallback): void;
    remove(instance: IgcTooltipComponent): void;
    /** @internal */
    handleEvent(event: KeyboardEvent): Promise<void>;
}
declare const service: TooltipEscapeCallbacks;
export default service;
