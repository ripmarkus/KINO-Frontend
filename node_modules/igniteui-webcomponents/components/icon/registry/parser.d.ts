import type { SvgIcon } from './types.js';
export declare class SvgIconParser {
    private _parser;
    constructor();
    parse(svgString: string): SvgIcon;
}
