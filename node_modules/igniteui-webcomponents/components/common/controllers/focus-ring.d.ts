import type { ReactiveController, ReactiveControllerHost } from 'lit';
/**
 * A controller class which determines whether a focus ring should be shown to indicate keyboard focus.
 * Focus rings are visible only when the user is interacting with a keyboard, not with a mouse, touch, or other input methods.
 *
 * By default the class attaches a keyup event handler on the component host and will update its keyboard focus
 * state based on it.
 *
 * **Important Note:** This controller is designed for use with **atomic web components** that represent single,
 * interactive elements (e.g., buttons, form fields, interactive icons). It helps these components correctly
 * display a focus indicator *only* when keyboard navigation is occurring, improving accessibility without
 * visual clutter during mouse or touch interactions.
 *
 * **Do not use this controller as a general-purpose shortcut for managing focus state in complex components or layouts.**
 * Misusing it in this way can lead to incorrect focus ring behavior, accessibility issues, and make your
 * application harder to maintain. For managing focus within larger, composite components, consider alternative
 * strategies like ARIA attributes, managing `tabindex`, or a bespoke implementation if needed.
 */
declare class KeyboardFocusRingController implements ReactiveController {
    private static readonly _events;
    private readonly _host;
    private readonly _abortHandle;
    private _isKeyboardFocused;
    /**
     * Gets whether the current focus state is activated through a keyboard interaction.
     */
    get focused(): boolean;
    constructor(host: ReactiveControllerHost & HTMLElement);
    /** @internal */
    hostConnected(): void;
    /** @internal */
    hostDisconnected(): void;
    /** @internal */
    handleEvent(event: Event): void;
}
export type { KeyboardFocusRingController };
/**
 * Adds a {@link KeyboardFocusRingController} responsible for managing keyboard focus state.
 *
 * This utility function is intended for use with **atomic web components** that require
 * dynamic focus ring visibility based on keyboard interaction.
 */
export declare function addKeyboardFocusRing(host: ReactiveControllerHost & HTMLElement): KeyboardFocusRingController;
