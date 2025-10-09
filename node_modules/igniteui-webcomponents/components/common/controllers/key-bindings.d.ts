import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { Ref } from 'lit/directives/ref.js';
export declare const arrowLeft: "ArrowLeft";
export declare const arrowRight: "ArrowRight";
export declare const arrowUp: "ArrowUp";
export declare const arrowDown: "ArrowDown";
export declare const enterKey: "Enter";
export declare const spaceBar: " ";
export declare const escapeKey: "Escape";
export declare const homeKey: "Home";
export declare const endKey: "End";
export declare const pageUpKey: "PageUp";
export declare const pageDownKey: "PageDown";
export declare const tabKey: "Tab";
export declare const altKey: "Alt";
export declare const ctrlKey: "Ctrl";
export declare const metaKey: "Meta";
export declare const shiftKey: "Shift";
type KeyBindingHandler = (event: KeyboardEvent) => void;
type KeyBindingObserverCleanup = {
    unsubscribe: () => void;
};
/**
 * Whether the current event should be ignored by the controller.
 *
 * @param node - The event target
 * @param event - The event object
 *
 * When `true` is returned, the current event is ignored.
 */
type KeyBindingSkipCallback = (node: Element, event: KeyboardEvent) => boolean;
/**
 * The event type which will trigger the bound handler.
 *
 * @remarks
 * `keydownRepeat` is similar to `keydown` with the exception
 * that after the handler is invoked the pressed state of the key is reset
 * in the controller.
 */
type KeyBindingTrigger = 'keydown' | 'keyup' | 'keydownRepeat';
/**
 * Configuration object for the controller.
 * @ignore
 */
interface KeyBindingControllerOptions {
    /**
     * By default, the controller listens for keypress events in the context of the host element.
     * If you pass a `ref`, you can limit the observation to a certain DOM part of the host scope.
     */
    ref?: Ref;
    /**
     * Option to ignore key press events.
     *
     * If passed an array of CSS selectors, it will ignore key presses originating from elements in the event composed path
     * that match one of the selectors.
     * Otherwise you can pass a {@link KeyBindingSkipCallback} function.
     *
     * Defaults to `['input', 'textarea', 'select']`.
     *
     * @example
     * ```ts
     * {
     *  // Skip events originating from elements with `readonly` attribute
     *  skip: ['[readonly]']
     * }
     * ...
     * {
     * // Same as above but with a callback
     *  skip: (node: Element) => node.hasAttribute('readonly')
     * }
     * ```
     */
    skip?: string[] | KeyBindingSkipCallback;
    /**
     * A set of KeyBindingOptions configuration which is applied to every handler
     * that is added to the controller.
     *
     * Any additional KeyBindingOptions values passed when `set` is called
     * will be merged with `bindingDefaults`.
     */
    bindingDefaults?: KeyBindingOptions;
}
/**
 * Configuration object for customizing the behavior of
 * the registered handler.
 */
interface KeyBindingOptions {
    /**
     * The event type(s) on which the handler will be invoked.
     *
     * Defaults to `keydown` if not set.
     */
    triggers?: KeyBindingTrigger[];
    /**
     * Whether to call `preventDefault` on the target event before the handler is invoked.
     */
    preventDefault?: boolean;
    /**
     * Whether to call `stopPropagation` on the target event before the handler is invoked.
     */
    stopPropagation?: boolean;
}
declare class KeyBindingController implements ReactiveController {
    private static readonly _defaultOptions;
    private readonly _host;
    private readonly _ref?;
    private readonly _abortHandle;
    private readonly _bindings;
    private readonly _allowedKeys;
    private readonly _pressedKeys;
    private readonly _options;
    private readonly _skipSelector;
    private _observedElement?;
    private get _element();
    constructor(host: ReactiveControllerHost & Element, options?: KeyBindingControllerOptions);
    /**
     * Checks and executes any event modifiers that are present in the matched binding.
     */
    private _applyEventModifiers;
    private _bindingMatches;
    private _shouldSkip;
    /** @internal */
    hostConnected(): void;
    /** @internal */
    hostDisconnected(): void;
    /** @internal */
    handleEvent(event: KeyboardEvent): void;
    /**
     * Registers a keybinding handler.
     */
    set(key: string | string[], handler: KeyBindingHandler, bindingOptions?: KeyBindingOptions): this;
    /**
     * Register a handler function which is called when the target receives a key
     * which "activates" it.
     *
     * In the browser context this is usually either an Enter and Space bar keypress.
     */
    setActivateHandler(handler: KeyBindingHandler, options?: KeyBindingOptions): this;
    /**
     * Sets the controller to listen for keyboard events on an arbitrary `element` in the page context.
     * All the configuration and event handlers are applied as well.
     *
     * Returns an object with an `unsubscribe` function which should be called when the observing of keyboard
     * events on the `element` should cease.
     */
    observeElement(element: Element): KeyBindingObserverCleanup;
}
/** @internal */
export declare function parseKeys(keys: string | string[]): {
    keys: string[];
    modifiers: string[];
};
/**
 * Creates a keybinding controller and adds to it to the passed `element`
 * with the provided `options`.
 */
export declare function addKeybindings(element: ReactiveControllerHost & Element, options?: KeyBindingControllerOptions): KeyBindingController;
export type { KeyBindingHandler, KeyBindingObserverCleanup, KeyBindingSkipCallback, KeyBindingTrigger, KeyBindingControllerOptions, KeyBindingOptions, KeyBindingController, };
