class FullscreenController {
    get fullscreen() {
        return this._fullscreen;
    }
    constructor(host, options) {
        this._options = {};
        this._fullscreen = false;
        this._host = host;
        Object.assign(this._options, options);
        host.addController(this);
    }
    setState(fullscreen) {
        const callback = fullscreen ? this._options.enter : this._options.exit;
        if (callback && !callback.call(this._host, fullscreen)) {
            return;
        }
        this._fullscreen = fullscreen;
        if (this._fullscreen) {
            this._host.requestFullscreen();
        }
        else if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    handleEvent() {
        if (!document.fullscreenElement && this._fullscreen) {
            this.setState(false);
        }
    }
    hostConnected() {
        this._host.addEventListener('fullscreenchange', this);
    }
    hostDisconnected() {
        this._host.removeEventListener('fullscreenchange', this);
    }
}
export function addFullscreenController(host, options) {
    return new FullscreenController(host, options);
}
//# sourceMappingURL=fullscreen.js.map