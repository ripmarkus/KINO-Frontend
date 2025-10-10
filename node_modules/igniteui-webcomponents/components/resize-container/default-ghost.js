export function createDefaultGhostElement({ x, y, width, height, }) {
    const element = document.createElement('div');
    const { scrollX, scrollY } = window;
    Object.assign(element.style, {
        position: 'absolute',
        top: `${y + scrollY}px`,
        left: `${x + scrollX}px`,
        zIndex: 1000,
        background: 'pink',
        opacity: 0.85,
        width: `${width}px`,
        height: `${height}px`,
    });
    return element;
}
export function getDefaultLayer() {
    return document.body;
}
//# sourceMappingURL=default-ghost.js.map