import { equal } from '../common/util.js';
import { iconReferences } from './icon-references.js';
import { IconsStateBroadcast } from './icon-state.broadcast.js';
import { internalIcons } from './internal-icons-lib.js';
import { createIconDefaultMap } from './registry/default-map.js';
import { SvgIconParser } from './registry/parser.js';
import { ActionType } from './registry/types.js';
class IconsRegistry {
    constructor() {
        this.collections = createIconDefaultMap();
        this.references = createIconDefaultMap();
        this.listeners = new Set();
        this.parser = new SvgIconParser();
        this.broadcast = new IconsStateBroadcast(this.collections, this.references);
        this.collections.set('internal', internalIcons);
    }
    register(name, iconText, collection = 'default') {
        const svgIcon = this.parser.parse(iconText);
        this.collections.getOrCreate(collection).set(name, svgIcon);
        const icons = createIconDefaultMap();
        icons.getOrCreate(collection).set(name, svgIcon);
        this.broadcast.send({
            actionType: ActionType.RegisterIcon,
            collections: icons.toMap(),
        });
        this.notifyAll(name, collection);
    }
    subscribe(callback) {
        this.listeners.add(callback);
    }
    unsubscribe(callback) {
        this.listeners.delete(callback);
    }
    setRefsByTheme(theme) {
        if (this.theme !== theme) {
            this.theme = theme;
            for (const { alias, target } of iconReferences) {
                const external = this.references
                    .get(alias.collection)
                    ?.get(alias.name)?.external;
                const _ref = this.references.get('default')?.get(alias.name) ?? {};
                const _target = target.get(this.theme) ?? target.get('default');
                this.setIconRef({
                    alias,
                    target: _target,
                    overwrite: !(external || equal(_ref, _target)),
                });
            }
        }
    }
    setIconRef(options) {
        const { alias, target, overwrite } = options;
        const reference = this.references.getOrCreate(alias.collection);
        if (overwrite) {
            reference.set(alias.name, {
                name: target.name,
                collection: target.collection,
                external: target.external,
            });
            this.notifyAll(alias.name, alias.collection);
        }
        if (target.external) {
            const refs = createIconDefaultMap();
            refs.getOrCreate(alias.collection).set(alias.name, {
                name: target.name,
                collection: target.collection,
            });
            this.broadcast.send({
                actionType: ActionType.UpdateIconReference,
                references: refs.toMap(),
            });
        }
    }
    getIconRef(name, collection) {
        const icon = this.references.get(collection)?.get(name);
        return {
            name: icon?.name ?? name,
            collection: icon?.collection ?? collection,
        };
    }
    get(name, collection = 'default') {
        return this.collections.get(collection)?.get(name);
    }
    notifyAll(name, collection) {
        for (const listener of this.listeners) {
            listener(name, collection);
        }
    }
}
const registry = Symbol.for('igc.icons-registry.instance');
export function getIconRegistry() {
    const _global = globalThis;
    if (!_global[registry]) {
        _global[registry] = new IconsRegistry();
    }
    return _global[registry];
}
export async function registerIcon(name, url, collection = 'default') {
    const response = await fetch(url);
    if (response.ok) {
        const value = await response.text();
        getIconRegistry().register(name, value, collection);
    }
    else {
        throw new Error(`Icon request failed. Status: ${response.status}.`);
    }
}
export function registerIconFromText(name, iconText, collection = 'default') {
    getIconRegistry().register(name, iconText, collection);
}
export function setIconRef(name, collection, icon) {
    getIconRegistry().setIconRef({
        alias: { name, collection },
        target: {
            name: icon.name,
            collection: icon.collection,
            external: true,
        },
        overwrite: true,
    });
}
//# sourceMappingURL=icon.registry.js.map