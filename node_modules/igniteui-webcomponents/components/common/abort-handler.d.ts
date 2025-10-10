/**
 * A utility class that wraps AbortController, allowing its signal to be
 * used for event listeners and providing a mechanism to reset it,
 * effectively generating a fresh AbortController instance on subsequent access
 * after an abort call.
 */
declare class AbortHandle {
    private _controller;
    constructor();
    /**
     * Returns the AbortSignal associated with the current AbortController instance.
     * This signal can be passed to functions like `addEventListener` or `fetch`.
     */
    get signal(): AbortSignal;
    /**
     * Aborts the current AbortController instance and immediately creates a new,
     * fresh AbortController.
     *
     * Any operations or event listeners associated with the previous signal
     * will be aborted. Subsequent accesses to `signal` will return the
     * signal from the new controller.
     */
    abort(reason?: unknown): void;
    /**
     * Resets the controller without triggering an abort.
     * This is useful if you want to explicitly get a fresh signal without
     * aborting any ongoing operations from the previous signal.
     */
    reset(): void;
}
/**
 * Creates and returns an `AbortHandle` object that wraps an AbortController,
 * providing a resettable AbortSignal. This allows you to use the signal for event
 * listeners, fetch requests, or other cancellable operations, and then
 * reset the underlying AbortController to get a fresh signal without
 * needing to create a new wrapper object.
 */
export declare function createAbortHandle(): AbortHandle;
export {};
