import { isServer } from 'lit';
class ThemeChangedEmitter extends EventTarget {
    constructor() {
        super();
        if (!isServer) {
            globalThis.addEventListener(CHANGE_THEME_EVENT, this);
        }
    }
    handleEvent() {
        this.dispatchEvent(new CustomEvent(CHANGED_THEME_EVENT));
    }
}
export const CHANGE_THEME_EVENT = 'igc-change-theme';
export const CHANGED_THEME_EVENT = 'igc-changed-theme';
export const _themeChangedEmitter = new ThemeChangedEmitter();
//# sourceMappingURL=theming-event.js.map