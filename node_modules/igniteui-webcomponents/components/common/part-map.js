import { noChange } from 'lit';
import { Directive, directive, PartType, } from 'lit/directive.js';
class PartMapDirective extends Directive {
    constructor(partInfo) {
        super(partInfo);
        if (partInfo.type !== PartType.ATTRIBUTE ||
            partInfo.name !== 'part' ||
            partInfo.strings?.length > 0) {
            throw new Error('`partMap() can only be used in the `part` attribute and must be the only part in the attribute.');
        }
    }
    render(partMapInfo) {
        return Object.keys(partMapInfo)
            .filter((key) => partMapInfo[key])
            .join(' ');
    }
    update(part, [partMapInfo]) {
        const partList = part.element.part;
        if (this._previousParts === undefined) {
            this._previousParts = new Set();
            for (const name in partMapInfo) {
                if (partMapInfo[name]) {
                    partList.add(name);
                    this._previousParts.add(name);
                }
            }
            return this.render(partMapInfo);
        }
        for (const name of this._previousParts) {
            if (!(name in partMapInfo) || !partMapInfo[name]) {
                partList.remove(name);
                this._previousParts.delete(name);
            }
        }
        for (const name in partMapInfo) {
            const value = !!partMapInfo[name];
            if (value && !this._previousParts.has(name)) {
                partList.add(name);
                this._previousParts.add(name);
            }
        }
        return noChange;
    }
}
export const partMap = directive(PartMapDirective);
//# sourceMappingURL=part-map.js.map