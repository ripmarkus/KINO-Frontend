import { css } from 'lit';
export const styles = css `[part~=base]{--dot-shadow-color: transparent}[part="base focused"]{--dot-shadow-color: var(--indicator-focus-color)}[part="base focused"] ::slotted(div)::after{border:none;box-shadow:0 0 0 .1875rem var(--indicator-focus-color)}`;
//# sourceMappingURL=indicator-container.indigo.css.js.map