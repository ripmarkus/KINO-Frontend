var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from 'lit';
import { property, queryAssignedNodes } from 'lit/decorators.js';
import { addInternalsController } from '../controllers/internals.js';
export class IgcBaseOptionLikeComponent extends LitElement {
    constructor() {
        super(...arguments);
        this._internals = addInternalsController(this, {
            initialARIA: { role: 'option' },
        });
        this._active = false;
        this._disabled = false;
        this._selected = false;
    }
    get _contentSlotText() {
        return this._content.map((node) => node.textContent).join('');
    }
    set active(value) {
        this._active = Boolean(value);
    }
    get active() {
        return this._active;
    }
    set disabled(value) {
        this._disabled = Boolean(value);
        this._internals.setARIA({ ariaDisabled: `${this.disabled}` });
    }
    get disabled() {
        return this._disabled;
    }
    set selected(value) {
        this._selected = Boolean(value);
        this._internals.setARIA({ ariaSelected: `${this._selected}` });
        this.active = this.selected;
    }
    get selected() {
        return this._selected;
    }
    set value(value) {
        this._value = value;
    }
    get value() {
        return this._value ? this._value : this._contentSlotText;
    }
    connectedCallback() {
        super.connectedCallback();
        this.role = 'option';
    }
    render() {
        return html `
      <section part="prefix">
        <slot name="prefix"></slot>
      </section>
      <section part="content">
        <slot></slot>
      </section>
      <section part="suffix">
        <slot name="suffix"></slot>
      </section>
    `;
    }
}
__decorate([
    queryAssignedNodes({ flatten: true })
], IgcBaseOptionLikeComponent.prototype, "_content", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], IgcBaseOptionLikeComponent.prototype, "active", null);
__decorate([
    property({ type: Boolean, reflect: true })
], IgcBaseOptionLikeComponent.prototype, "disabled", null);
__decorate([
    property({ type: Boolean, reflect: true })
], IgcBaseOptionLikeComponent.prototype, "selected", null);
__decorate([
    property()
], IgcBaseOptionLikeComponent.prototype, "value", null);
//# sourceMappingURL=option.js.map