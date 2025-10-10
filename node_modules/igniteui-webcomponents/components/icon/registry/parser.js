export class SvgIconParser {
    constructor() {
        this._parser = new DOMParser();
    }
    parse(svgString) {
        const root = this._parser.parseFromString(svgString, 'image/svg+xml');
        const svg = root.querySelector('svg');
        const error = root.querySelector('parsererror');
        if (error || !svg) {
            throw new Error('SVG element not found or malformed SVG string.');
        }
        const title = svg.querySelector('title')?.textContent ?? '';
        svg.setAttribute('fit', '');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        return {
            svg: svg.outerHTML,
            title,
        };
    }
}
//# sourceMappingURL=parser.js.map