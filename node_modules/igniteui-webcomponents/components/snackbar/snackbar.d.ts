import { IgcBaseAlertLikeComponent } from '../common/mixins/alert.js';
import type { AbstractConstructor } from '../common/mixins/constructor.js';
export interface IgcSnackbarComponentEventMap {
    igcAction: CustomEvent<void>;
}
declare const IgcSnackbarComponent_base: import("../common/mixins/constructor.js").Constructor<import("../common/mixins/event-emitter.js").EventEmitterInterface<IgcSnackbarComponentEventMap>> & AbstractConstructor<IgcBaseAlertLikeComponent>;
/**
 * A snackbar component is used to provide feedback about an operation
 * by showing a brief message at the bottom of the screen.
 *
 * @element igc-snackbar
 *
 * @slot - Default slot to render the snackbar content.
 * @slot action - Renders the action part of the snackbar. Usually an interactive element (button)
 *
 * @fires igcAction - Emitted when the snackbar action button is clicked.
 *
 * @csspart base - The base wrapper of the snackbar component.
 * @csspart message - The snackbar message.
 * @csspart action - The default snackbar action button.
 * @csspart action-container - The area holding the actions.
 */
export default class IgcSnackbarComponent extends IgcSnackbarComponent_base {
    static readonly tagName = "igc-snackbar";
    static styles: import("lit").CSSResult[];
    static register(): void;
    protected readonly _contentRef: import("lit-html/directives/ref.js").Ref<HTMLElement>;
    protected readonly _player: import("../../animations/player.js").AnimationController;
    /**
     * The snackbar action button.
     * @attr action-text
     */
    actionText: string;
    constructor();
    private _handleClick;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-snackbar': IgcSnackbarComponent;
    }
}
export {};
