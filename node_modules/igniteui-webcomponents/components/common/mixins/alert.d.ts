import { LitElement, type PropertyValues } from 'lit';
import type { AnimationController } from '../../../animations/player.js';
import type { AbsolutePosition } from '../../types.js';
export declare abstract class IgcBaseAlertLikeComponent extends LitElement {
    protected abstract readonly _player: AnimationController;
    protected _autoHideTimeout?: ReturnType<typeof setTimeout>;
    /**
     * Whether the component is in shown state.
     * @attr
     */
    open: boolean;
    /**
     * Determines the duration in ms in which the component will be visible.
     * @attr display-time
     */
    displayTime: number;
    /**
     * Determines whether the component should close after the `displayTime` is over.
     * @attr keep-open
     */
    keepOpen: boolean;
    /**
     * Sets the position of the component in the viewport.
     * @attr
     */
    position: AbsolutePosition;
    constructor();
    protected updated(props: PropertyValues<this>): void;
    private _setOpenState;
    private _setAutoHideTimer;
    /** Opens the component. */
    show(): Promise<boolean>;
    /** Closes the component. */
    hide(): Promise<boolean>;
    /** Toggles the open state of the component. */
    toggle(): Promise<boolean>;
}
