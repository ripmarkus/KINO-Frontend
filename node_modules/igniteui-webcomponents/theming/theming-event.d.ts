import type { Theme, ThemeVariant } from './types.js';
declare class ThemeChangedEmitter extends EventTarget {
    constructor();
    /** @internal */
    handleEvent(): void;
}
export declare const CHANGE_THEME_EVENT = "igc-change-theme";
export declare const CHANGED_THEME_EVENT = "igc-changed-theme";
export declare const _themeChangedEmitter: ThemeChangedEmitter;
declare global {
    interface WindowEventMap {
        [CHANGE_THEME_EVENT]: CustomEvent<ChangeThemeEventDetail>;
    }
}
/**
 * The possible details of the "igc-change-theme" event.
 */
export type ChangeThemeEventDetail = {
    theme: Theme;
    themeVariant: ThemeVariant;
};
export {};
