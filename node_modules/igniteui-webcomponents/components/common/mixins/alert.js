var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { fadeIn, fadeOut } from '../../../animations/presets/fade/index.js';
import { addInternalsController } from '../controllers/internals.js';
export class IgcBaseAlertLikeComponent extends LitElement {
    constructor() {
        super();
        this.open = false;
        this.displayTime = 4000;
        this.keepOpen = false;
        this.position = 'bottom';
        addInternalsController(this, {
            initialARIA: {
                role: 'status',
                ariaLive: 'polite',
            },
        });
    }
    updated(props) {
        if (props.has('displayTime')) {
            this._setAutoHideTimer();
        }
        if (props.has('keepOpen')) {
            clearTimeout(this._autoHideTimeout);
        }
    }
    async _setOpenState(open) {
        let state;
        if (open) {
            this.open = open;
            state = await this._player.playExclusive(fadeIn());
            this._setAutoHideTimer();
        }
        else {
            clearTimeout(this._autoHideTimeout);
            state = await this._player.playExclusive(fadeOut());
            this.open = open;
        }
        return state;
    }
    _setAutoHideTimer() {
        clearTimeout(this._autoHideTimeout);
        if (this.open && this.displayTime > 0 && !this.keepOpen) {
            this._autoHideTimeout = setTimeout(() => this.hide(), this.displayTime);
        }
    }
    async show() {
        return this.open ? false : this._setOpenState(true);
    }
    async hide() {
        return this.open ? this._setOpenState(false) : false;
    }
    async toggle() {
        return this.open ? this.hide() : this.show();
    }
}
__decorate([
    property({ type: Boolean, reflect: true })
], IgcBaseAlertLikeComponent.prototype, "open", void 0);
__decorate([
    property({ type: Number, attribute: 'display-time' })
], IgcBaseAlertLikeComponent.prototype, "displayTime", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'keep-open' })
], IgcBaseAlertLikeComponent.prototype, "keepOpen", void 0);
__decorate([
    property({ reflect: true })
], IgcBaseAlertLikeComponent.prototype, "position", void 0);
//# sourceMappingURL=alert.js.map