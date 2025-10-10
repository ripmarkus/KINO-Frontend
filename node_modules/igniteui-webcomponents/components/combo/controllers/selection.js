import { asArray, isEmpty } from '../../common/util.js';
export class SelectionController {
    get isEmpty() {
        return isEmpty(this._selected);
    }
    get asArray() {
        return Array.from(this._selected);
    }
    has(item) {
        return this._selected.has(item);
    }
    clear() {
        this._selected.clear();
    }
    getSelectedValuesByKey(key) {
        return this.asArray.map((item) => item[key] ?? item);
    }
    getValue(items, key) {
        return items.map((item) => item[key] ?? item);
    }
    handleChange(detail) {
        return this.host.emitEvent('igcChange', { cancelable: true, detail });
    }
    getItemsByValueKey(keys) {
        const _keys = new Set(keys);
        return this.host.data.filter((item) => _keys.has(item[this.host.valueKey]));
    }
    selectValueKeys(keys) {
        if (isEmpty(keys)) {
            return;
        }
        for (const item of this.getItemsByValueKey(keys)) {
            this._selected.add(item);
        }
    }
    deselectValueKeys(keys) {
        if (isEmpty(keys)) {
            return;
        }
        for (const item of this.getItemsByValueKey(keys)) {
            this._selected.delete(item);
        }
    }
    selectObjects(items) {
        if (isEmpty(items)) {
            return;
        }
        const dataSet = new Set(this.host.data);
        for (const item of items) {
            if (dataSet.has(item)) {
                this._selected.add(item);
            }
        }
    }
    deselectObjects(items) {
        if (isEmpty(items)) {
            return;
        }
        const dataSet = new Set(this.host.data);
        for (const item of items) {
            if (dataSet.has(item)) {
                this._selected.delete(item);
            }
        }
    }
    selectAll() {
        this._selected = new Set(this.host.data);
        this.host.requestUpdate();
    }
    deselectAll() {
        this.clear();
        this.host.requestUpdate();
    }
    async select(items, emit = false) {
        let _items = asArray(items);
        const singleSelect = this.host.singleSelect;
        if (singleSelect) {
            this.clear();
            this.state.searchTerm = '';
        }
        if (isEmpty(_items)) {
            if (!singleSelect) {
                this.selectAll();
            }
            return;
        }
        if (singleSelect) {
            _items = _items.slice(0, 1);
        }
        const values = this.host.valueKey
            ? this.getItemsByValueKey(_items)
            : _items;
        const selected = Array.from(this._selected.values());
        const payload = [...values, ...selected];
        if (emit &&
            !this.handleChange({
                newValue: this.getValue(payload, this.host.valueKey),
                items: values,
                type: 'selection',
            })) {
            return;
        }
        if (this.host.valueKey) {
            this.selectValueKeys(_items);
        }
        else {
            this.selectObjects(_items);
        }
        this.host.requestUpdate();
    }
    async deselect(items, emit = false) {
        let _items = asArray(items);
        if (isEmpty(_items)) {
            if (emit &&
                !this.handleChange({
                    newValue: [],
                    items: this.asArray,
                    type: 'deselection',
                })) {
                return;
            }
            this.deselectAll();
            return;
        }
        if (this.host.singleSelect) {
            _items = _items.slice(0, 1);
        }
        const values = this.host.valueKey
            ? this.getItemsByValueKey(_items)
            : _items;
        const selected = Array.from(this._selected.values());
        const payload = selected.filter((item) => item !== values[0]);
        if (emit &&
            !this.handleChange({
                newValue: this.getValue(payload, this.host.valueKey),
                items: values,
                type: 'deselection',
            })) {
            return;
        }
        if (this.host.valueKey) {
            this.deselectValueKeys(_items);
        }
        else {
            this.deselectObjects(_items);
        }
        this.host.requestUpdate();
    }
    changeSelection(index) {
        const valueKey = this.host.valueKey;
        const record = this.host.data[index];
        const item = valueKey ? record[valueKey] : record;
        this.has(record) ? this.deselect(item, true) : this.select(item, true);
    }
    selectByIndex(index) {
        const valueKey = this.host.valueKey;
        const item = this.host.data[index];
        this.select(valueKey ? item[valueKey] : item, true);
    }
    constructor(host, state) {
        this.host = host;
        this.state = state;
        this._selected = new Set();
        this.host.addController(this);
    }
    hostConnected() { }
    hostDisconnected() { }
}
//# sourceMappingURL=selection.js.map