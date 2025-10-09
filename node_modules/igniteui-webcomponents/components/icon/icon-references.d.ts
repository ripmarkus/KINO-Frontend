/** READ BEFORE YOU MODIFY THIS FILE!
 *
 * Before you add/modify an icon reference, please think about the semantics of the icon you are adding/modifying.
 *
 * Icon aliases have sematic meaning depending on the context in which they are used.
 * For instance, if your component handles toggling between expanded and collapsed states,
 * you may want to use the already existing `expand` and `collapse` aliases that point to
 * the `expand_more` and `expand_less` icons in the material font set.
 *
 * It may so happen, however, that the design of your component requires you to use the `chevron_right` for the
 * expand icon and the `expand_more` for the collapse icon. In this case the `tree_expand` and `tree_collapse` aliases
 * would be appropriate.
 * This distinction is important when choosing which icon to use for your component as it will have an impact
 * when a user decides to rewire the `expand`/`collapse` icons to some other icons.
 *
 * Likewise, modifying existing references should be handled with caution as many component in the framework already
 * share icons that have equivalent semantic meaning. For example, the `Paginator`, `Grid Filtering Row`,
 * and `Tabs` components in Ignite UI for Angular all use the `prev` and `next` icons for navigating between pages
 * or lists of items. Changing the underlying target for those icons should be done in a way that suits all components.
 *
 * Keep in mind that icon aliases and their underlying names are shared between Ignite UI component frameworks
 * and changing an alias name here should be reflected in the other frameworks as well.
 *
 * To get acquainted with which component uses what icon, please make sure to read the
 * [docs](https://infragistics.com/products/ignite-ui-angular/Angular/components/icon-service#internal-usage).
 */
import type { IconReference } from './registry/types.js';
export declare const iconReferences: IconReference[];
