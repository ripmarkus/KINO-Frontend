/**
 * TypeScript decorator that allows customizing the Shadow DOM options for a LitElement component.
 *
 * This decorator merges the provided `options` with LitElement's default `shadowRootOptions`,
 * providing a convenient way to configure the Shadow DOM, such as its `mode` (e.g., 'open' or 'closed')
 * or `delegatesFocus` property.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#options
 */
export declare function shadowOptions(options: Partial<ShadowRootInit>): (proto: unknown) => void;
