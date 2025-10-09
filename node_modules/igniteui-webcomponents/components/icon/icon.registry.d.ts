import type { Theme } from '../../theming/types.js';
import type { IconCallback, IconMeta, IconReferencePair, SvgIcon } from './registry/types.js';
declare class IconsRegistry {
    private parser;
    private collections;
    private references;
    private listeners;
    private theme;
    private broadcast;
    constructor();
    register(name: string, iconText: string, collection?: string): void;
    subscribe(callback: IconCallback): void;
    unsubscribe(callback: IconCallback): void;
    setRefsByTheme(theme: Theme): void;
    setIconRef(options: IconReferencePair): void;
    getIconRef(name: string, collection: string): IconMeta;
    get(name: string, collection?: string): SvgIcon | undefined;
    private notifyAll;
}
export declare function getIconRegistry(): IconsRegistry;
export declare function registerIcon(name: string, url: string, collection?: string): Promise<void>;
export declare function registerIconFromText(name: string, iconText: string, collection?: string): void;
export declare function setIconRef(name: string, collection: string, icon: IconMeta): void;
export {};
