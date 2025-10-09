import { isServer } from 'lit';
import { CHANGE_THEME_EVENT, } from './theming-event.js';
import { getAllCssVariables } from './utils.js';
let theme;
let themeVariant;
function dispatchThemingEvent(detail) {
    if (!isServer) {
        globalThis.dispatchEvent(new CustomEvent(CHANGE_THEME_EVENT, { detail }));
    }
}
function isOfTypeTheme(theme) {
    return ['bootstrap', 'material', 'indigo', 'fluent'].includes(theme);
}
function isOfTypeThemeVariant(variant) {
    return ['light', 'dark'].includes(variant);
}
export function getTheme() {
    if (!(theme && themeVariant)) {
        const cssVars = getAllCssVariables();
        const foundTheme = cssVars.igTheme;
        const foundVariant = cssVars.igThemeVariant;
        theme = isOfTypeTheme(foundTheme) ? foundTheme : 'bootstrap';
        themeVariant = isOfTypeThemeVariant(foundVariant) ? foundVariant : 'light';
    }
    return { theme, themeVariant };
}
export function setTheme(value, variant) {
    theme = value;
    themeVariant = variant;
}
export function configureTheme(t, v = 'light') {
    if (isOfTypeTheme(t) && isOfTypeThemeVariant(v)) {
        setTheme(t, v);
        dispatchThemingEvent({ theme, themeVariant });
    }
}
//# sourceMappingURL=config.js.map