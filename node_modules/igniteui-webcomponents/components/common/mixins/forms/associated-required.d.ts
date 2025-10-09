import type { LitElement } from 'lit';
import type { Constructor } from '../constructor.js';
import type { FormAssociatedCheckboxElementInterface, FormAssociatedElementInterface, FormRequiredInterface } from './types.js';
/**
 * Mixes the passed class into a form associated custom element with an
 * additional `required` attribute.
 */
export declare function FormAssociatedRequiredMixin<T extends Constructor<LitElement>>(base: T): Constructor<FormRequiredInterface & FormAssociatedElementInterface> & T;
/**
 * Mixes the passed class into a form associated custom element with an
 * additional `required` attribute.
 */
export declare function FormAssociatedCheckboxRequiredMixin<T extends Constructor<LitElement>>(base: T): Constructor<FormRequiredInterface & FormAssociatedCheckboxElementInterface> & T;
