// https://github.com/stijnherfst/HiveWE/wiki/war3map(skin).w3*-Modifications

import {CDataView} from '../../utils/c-data-view.mjs';
import {CDataViewFake} from '../../utils/c-data-view-fake.mjs';
import fromBuffer from '../../utils/bufffer-to-buffer.mjs';
import {W3ABDHQTUItem} from './W3ABDHQTUItem.mjs';
import {Dec2RawBE, Raw2Dec} from '../../rawcode/convert.mjs';
import {W3ABDHQTUItemData} from './W3ABDHQTUItemData.mjs';
import {W3ABDHQTUItemDataValue} from './W3ABDHQTUItemDataValue.mjs';
import * as TOML from '@ltd/j-toml';

/**
 * @typedef W3ABDHQTUTOMLMapProperty
 * @type {object}
 * @property {string} name
 * @property {number} type
 * @property {boolean?} level
 * @property {boolean?} multiline
 */

export class W3ABDHQTU {
    /**
     * @param {Buffer|ArrayBuffer} buffer
     * @param {boolean} adq
     */
    constructor(buffer, adq) {
        this.#buffer = fromBuffer(buffer);
        this.#adq = adq;
    }

    /** @type {ArrayBuffer} */ #buffer;
    /** @type {boolean} */ #adq;
    /** @type {Error[]} */ errors = [];
    /** @type {W3ABDHQTUItem[]} */ list = [];
    /** @type {W3ABDHQTUItem[]} */ #original = [];
    /** @type {W3ABDHQTUItem[]} */ #mofified = [];

    #read() {
        const view = new CDataView(this.#buffer);
        this.formatVersion = view.uint32;
        if ([1, 2, 3].indexOf(this.formatVersion) < 0) {
            throw new Error(`This format is unsupported: ${this.formatVersion}`);
        }

        for (let i = 0; i < 2; i++) {
            for (let i = view.uint32; i > 0; i--) {
                const data = new W3ABDHQTUItem(this.#adq, this.formatVersion);
                data.read(view);
                this.list.push(data);
            }
        }

        if (view.cursor !== view.byteLength) {
            throw new Error(`Read not complete: ${view.cursor} !== ${view.byteLength}`);
        }
    }

    read() {
        try {
            this.#read();
        } catch (e) {
            this.errors.push(e);
        }
    }

    /** @param {CDataView} view */
    #write(view) {
        view.uint32 = this.formatVersion;
        view.uint32 = this.#original.length;
        for (const i of this.#original) i.write(view);
        view.uint32 = this.#mofified.length;
        for (const i of this.#mofified) i.write(view);
    }

    write() {
        this.#original = [];
        this.#mofified = [];

        for (const i of this.list) {
            if (i.customId > 0) this.#mofified.push(i);
            else this.#original.push(i);
        }

        /** @type {CDataView} */
        const dvf = new CDataViewFake();
        this.#write(dvf);

        const ab = new ArrayBuffer(dvf.cursor);
        const dv = new CDataView(ab);
        this.#write(dv);

        return ab;
    }

    toJSON() {
        return {
            formatVersion: this.formatVersion,
            list: this.list,
        };
    }

    /**
     * @template T
     * @param {T} self
     * @param {string} json
     * @param {boolean} adq
     * @return {T}
     */
    static _fromJSON(self, json, adq) {
        const o = JSON.parse(json);
        self.formatVersion = o.formatVersion;
        for (const i of o.list) {
            const item = new W3ABDHQTUItem(adq, self.formatVersion);
            self.list.push(item);
            item.defaultId = Raw2Dec(String(i.defaultId));
            item.customId = i.customId === undefined ? 0 : Raw2Dec(String(i.customId));
            for (const id of i.list) {
                const itemData = new W3ABDHQTUItemData(adq, self.formatVersion);
                item.list.push(itemData);
                itemData.flag = id.flag === undefined ? 0 : Number(id.flag);
                for (const idv of id.list) {
                    const itemDataValue = new W3ABDHQTUItemDataValue(adq);
                    itemData.list.push(itemDataValue);
                    itemDataValue.id = Raw2Dec(String(idv.id));
                    if (adq) {
                        itemDataValue.level = idv.level;
                        itemDataValue.data = idv.data;
                    }
                    itemDataValue.typeString = idv.type;
                    itemDataValue.value = idv.value;
                    itemDataValue.end = idv.end === undefined ? 0 : Raw2Dec(String(idv.end));
                }
            }
        }
        return self;
    }

    /**
     * @param {Object.<string, W3ABDHQTUTOMLMapProperty>} map
     * @return {string}
     */
    _toTOML(map) {
        let out = `[Settings]\nversion = ${this.formatVersion} # binary format version\n`;

        /**
         * @param {string} str
         * @return {string}
         */
        const _string = (str) => `"""${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"""`;

        /**
         * @param {W3ABDHQTUItemDataValue} idv
         * @param value
         * @param data
         */
        const _write = (idv, value, data) => {
            const name = `${Dec2RawBE(idv.id)}`;
            if (!(value instanceof Array)) value = [value];
            if (!(data instanceof Array)) data = [data];

            if (map[name] === undefined) {
                switch (idv.type) {
                    case 0:
                        out += `${name}Type = "integer"\n`;
                        break;
                    case 1:
                        out += `${name}Type = "real"\n`;
                        break;
                    case 2:
                        out += `${name}Type = "unreal"\n`;
                        break;
                    case 3:
                        out += `${name}Type = "string"\n`;
                        break;
                    default:
                        throw new Error(`Unknown variable type: ${idv.type}`);
                }
            } else {
                out += `# ${map[name].name}\n`;
            }

            out += `${name} = `;
            switch (idv.type) {
                case 0:
                case 1:
                case 2:
                    out += value.length > 1 ? `[\n${value.join(',\n')}\n]\n` : `${idv.value}\n`;
                    break;
                case 3:
                    out += value.length > 1 ? `[\n${value.map((v) => `${_string(v)}`).join(',\n')}\n]\n` : `${_string(idv.value)}\n`;
                    break;
                default:
                    throw new Error(`Unknown variable type: ${idv.type}`);
            }

            if (value.length === 1 && idv.level > 0) out += `${name}Level = ${idv.level}\n`;

            if (data.filter((e) => e > 0).length === data.length) {
                out += `${name}Data = `;
                out += data.length > 1 ? `[\n${data.join(',\n')}\n]\n` : `${idv.data}\n`;
            }
        };

        for (const i of this.list) {
            /**
             * @param {number} id
             * @return {string}
             * @private
             */
            const _raw = (id) => {
                return `# ${id} 0x${id.toString(16)}`;
            };
            const pId = i.customId > 0 ? i.customId : i.defaultId;
            out += `\n[${Dec2RawBE(pId)}] ${_raw(pId)}\n`;
            if (i.customId > 0) out += `parent = "${Dec2RawBE(i.defaultId)}" ${_raw(i.defaultId)}\n`;

            if (this.#adq) {
                for (const id of i.list) {
                    if (this.formatVersion >= 3 && id.flag > 0) out += `flags = ${id.flag}\n`;

                    /** @type {Map<number, W3ABDHQTUItemDataValue[]>} */
                    const map = new Map();

                    for (const idv of id.list) {
                        if (!map.has(idv.id)) map.set(idv.id, []);
                        map.get(idv.id).push(idv);
                    }

                    map.forEach((list) => {
                        const idv = list[0];
                        const value = [];
                        const data = [];
                        for (const idv of list.sort((a, b) => a.level - b.level)) {
                            value.push(idv.value);
                            data.push(idv.data);
                        }
                        _write(idv, value, data);
                    });
                }
            } else {
                for (const id of i.list) {
                    if (this.formatVersion >= 3 && id.flag > 0) out += `flags = ${id.flag}\n`;
                    for (const idv of id.list) {
                        _write(idv, idv.value, idv.data);
                    }
                }
            }
        }
        return out;
    }

    /**
     * @template T
     * @param {T} self
     * @param {string} toml
     * @param {boolean} adq
     * @param {Object.<string, W3ABDHQTUTOMLMapProperty>} map
     * @return {T}
     */
    static _fromTOML(self, toml, adq, map) {
        /** @type {Object.<string, any>} */
        const o = TOML.parse(toml, {
            joiner: '\n',
            bigint: false,
        });
        self.formatVersion = Number(o.Settings.version);
        delete o.Settings;

        for (const [itemRawId, attrMap] of Object.entries(o)) {
            const item = new W3ABDHQTUItem(adq, self.formatVersion);
            self.list.push(item);
            if (attrMap.parent === undefined) {
                item.defaultId = Raw2Dec(itemRawId);
            } else {
                item.defaultId = Raw2Dec(attrMap.parent);
                item.customId = Raw2Dec(itemRawId);
            }
            delete attrMap.parent;

            if (attrMap.length === 0) continue;

            const itemData = new W3ABDHQTUItemData(adq, self.formatVersion);
            item.list.push(itemData);
            if (self.formatVersion >= 3) itemData.flag = 0;

            for (const [attrRawId, attrValue] of Object.entries(attrMap)) {
                if (attrRawId.length !== 4) continue;
                if (map[attrRawId]?.level ?? false) {
                    if (attrValue.length !== attrMap['alev']) throw new Error(`⚠️${itemRawId} : missilng level data for '${attrRawId}'`);
                }
                if (attrValue instanceof Array) {
                    for (let i = 0; i < attrValue.length; i++) {
                        const itemDataValue = new W3ABDHQTUItemDataValue(adq);
                        itemData.list.push(itemDataValue);
                        itemDataValue.fromMap(attrRawId, attrMap, map);
                        itemDataValue.value = attrValue[i];
                        if (adq) {
                            itemDataValue.level = i + 1;
                            const data = attrMap[`${attrRawId}Data`];
                            if (data === undefined) itemDataValue.data = 0;
                            if (data instanceof Array) itemDataValue.data = data[i];
                        }
                    }
                    continue;
                }

                const itemDataValue = new W3ABDHQTUItemDataValue(adq);
                itemData.list.push(itemDataValue);
                itemDataValue.fromMap(attrRawId, attrMap, map);

                itemDataValue.value = attrValue;
                if (adq) {
                    itemDataValue.level = attrMap[`${attrRawId}Level`] ?? 0;
                    itemDataValue.data = attrMap[`${attrRawId}Data`] ?? 0;
                }
            }
        }

        return self;
    }
}