import type { ButtonVariant } from '../types.js';
import { IgcButtonBaseComponent } from './button-base.js';
/**
 * Represents a clickable button, used to submit forms or anywhere in a
 * document for accessible, standard button functionality.
 *
 * @element igc-button
 *
 * @slot - Renders the label of the button.
 * @slot prefix - Renders content before the label of the button.
 * @slot suffix - Renders content after the label of the button.
 *
 * @csspart base - The native button element of the igc-button component.
 * @csspart prefix - The prefix container of the igc-button component.
 * @csspart suffix - The suffix container of the igc-button component.
 */
export default class IgcButtonComponent extends IgcButtonBaseComponent {
    static readonly tagName = "igc-button";
    protected static styles: import("lit").CSSResult[];
    static register(): void;
    /**
     * Sets the variant of the button.
     * @attr
     */
    variant: ButtonVariant;
    constructor();
    protected renderContent(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'igc-button': IgcButtonComponent;
    }
}
