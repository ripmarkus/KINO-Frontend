import { css } from 'lit';
import { styles as bootstrap } from './shared/item/dropdown-item.bootstrap.css.js';
import { styles as fluent } from './shared/item/dropdown-item.fluent.css.js';
import { styles as indigo } from './shared/item/dropdown-item.indigo.css.js';
const light = {
    bootstrap: css `
    ${bootstrap}
  `,
    indigo: css `
    ${indigo}
  `,
    fluent: css `
    ${fluent}
  `,
};
const dark = {
    bootstrap: css `
    ${bootstrap}
  `,
    indigo: css `
    ${indigo}
  `,
    fluent: css `
    ${fluent}
  `,
};
export const all = { light, dark };
//# sourceMappingURL=item.js.map