import { IgcBaseAlertLikeComponent } from '../common/mixins/alert.js';
/**
 * A toast component is used to show a notification
 *
 * @element igc-toast
 *
 * @csspart base - The base wrapper of the toast.
 */
export default class IgcToastComponent extends IgcBaseAlertLikeComponent {
    static readonly tagName = "igc-toast";
    static styles: import("lit").CSSResult[];
    protected readonly _player: import("../../animations/player.js").AnimationController;
    static register(): void;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-toast': IgcToastComponent;
    }
}
