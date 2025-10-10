import type { ResizeProps, ResizeSpanProps, SnappedDimension } from './types.js';
export declare class ResizeUtil {
    private gap;
    constructor(gap: number);
    calculateSnappedDimension(resizeProps: ResizeProps): SnappedDimension;
    calculateResizedSpan(props: ResizeSpanProps): number;
    calculatePosition(targetPosition: number, sizes: number[]): number;
}
