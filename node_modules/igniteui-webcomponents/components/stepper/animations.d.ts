import { type AnimationReferenceMetadata } from '../../animations/types.js';
import type { HorizontalTransitionAnimation, StepperVerticalAnimation } from '../types.js';
export type Animation = StepperVerticalAnimation | HorizontalTransitionAnimation;
export type AnimationOptions = {
    keyframe: KeyframeAnimationOptions;
    step?: object;
};
export declare const bodyAnimations: Map<string, Map<string, ((options: AnimationOptions) => AnimationReferenceMetadata) | ((options: AnimationOptions) => AnimationReferenceMetadata)>>;
export declare const contentAnimations: Map<string, Map<string, ((options: AnimationOptions) => AnimationReferenceMetadata) | ((options: AnimationOptions) => AnimationReferenceMetadata)>>;
