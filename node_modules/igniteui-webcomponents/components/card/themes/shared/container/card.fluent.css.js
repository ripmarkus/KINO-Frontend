import { css } from 'lit';
export const styles = css `:host([elevated]:hover)::after,:host([elevated]:focus-within)::after{position:absolute;content:"";width:100%;height:100%;transition:box-shadow .1s ease-out;box-shadow:inset 0 0 0 .125rem var(--outline-color);pointer-events:none}`;
//# sourceMappingURL=card.fluent.css.js.map