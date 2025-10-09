var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from 'lit/decorators.js';
import { FormAssociatedCheckboxMixin, FormAssociatedMixin, } from './associated.js';
export function FormAssociatedRequiredMixin(base) {
    class FormAssociatedRequiredElement extends FormAssociatedMixin(base) {
        constructor() {
            super(...arguments);
            this._required = false;
        }
        set required(value) {
            this._required = Boolean(value);
            this._validate();
        }
        get required() {
            return this._required;
        }
    }
    __decorate([
        property({ type: Boolean, reflect: true })
    ], FormAssociatedRequiredElement.prototype, "required", null);
    return FormAssociatedRequiredElement;
}
export function FormAssociatedCheckboxRequiredMixin(base) {
    class FormAssociatedRequiredElement extends FormAssociatedCheckboxMixin(base) {
        constructor() {
            super(...arguments);
            this._required = false;
        }
        set required(value) {
            this._required = Boolean(value);
            this._validate();
        }
        get required() {
            return this._required;
        }
    }
    __decorate([
        property({ type: Boolean, reflect: true })
    ], FormAssociatedRequiredElement.prototype, "required", null);
    return FormAssociatedRequiredElement;
}
//# sourceMappingURL=associated-required.js.map