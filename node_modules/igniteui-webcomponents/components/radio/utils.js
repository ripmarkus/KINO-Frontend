import { getRoot, iterNodes } from '../common/util.js';
export function getGroup(member) {
    const result = {
        active: [],
        checked: [],
        radios: [],
        siblings: [],
    };
    if (!member.name) {
        result.radios.push(member);
        if (member.checked) {
            result.checked.push(member);
        }
        if (!member.disabled) {
            result.active.push(member);
        }
        return result;
    }
    const options = {
        show: 'SHOW_ELEMENT',
        filter: (radio) => radio.matches(member.tagName) && radio.name === member.name,
    };
    for (const each of iterNodes(getRoot(member), options)) {
        result.radios.push(each);
        if (!each.disabled) {
            result.active.push(each);
        }
        if (each.checked) {
            result.checked.push(each);
        }
        if (each !== member) {
            result.siblings.push(each);
        }
    }
    return result;
}
//# sourceMappingURL=utils.js.map