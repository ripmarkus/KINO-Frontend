import type { Theme, ThemeVariant } from './types.js';
export declare function getTheme(): {
    theme: Theme;
    themeVariant: ThemeVariant;
};
export declare function setTheme(value: Theme, variant: ThemeVariant): void;
/**
 * Allows the global configuration of the active theme.
 *
 * Usage:
 *  ```ts
 *  import { configureTheme } from 'igniteui-webcomponents';
 *
 *  configureTheme('material', 'light');
 *  ```
 */
export declare function configureTheme(t: Theme, v?: ThemeVariant): void;
