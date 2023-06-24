// https://github.com/stijnherfst/HiveWE/wiki/war3map(skin).w3*-Modifications

import {CDataView} from '../../utils/c-data-view.mjs';
import {CDataViewFake} from '../../utils/c-data-view-fake.mjs';
import fromBuffer from '../../utils/bufffer-to-buffer.mjs';
import {W3ABDHQTUItem} from './W3ABDHQTUItem.mjs';
import {Dec2RawBE, Raw2Dec} from '../../rawcode/convert.mjs';
import {W3ABDHQTUItemData} from './W3ABDHQTUItemData.mjs';
import {W3ABDHQTUItemDataValue} from './W3ABDHQTUItemDataValue.mjs';
import * as tomlParser from 'toml';

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

    toTOML() {
        /**
         * @param {string} str
         * @return {string}
         */
        const _string = (str) => `"""${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"""`;
        const _type = (id, type, value) => {
            const name = `${Dec2RawBE(id)}`;
            switch (type) {
                case 0:
                    return `${name} = ${value}\n${name}Type = "integer"\n`;
                case 1:
                    return `${name} = ${value}\n${name}Type = "real"\n`;
                case 2:
                    return `${name} = ${value}\n${name}Type = "unreal"\n`;
                case 3:
                    return `${name} = ${_string(value)}\n${name}Type = "string"\n`;
                default:
                    throw new Error(`Unknown variable type: ${type}`);
            }
        };

        let out = `[Settings]\n# Binary format version\nversion = ${this.formatVersion}\n`;
        for (const i of this.list) {
            out += i.customId > 0 ? `\n[${Dec2RawBE(i.customId)}]\nparent = "${Dec2RawBE(i.defaultId)}"\n` : `\n[${Dec2RawBE(i.defaultId)}]\n`;

            if (this.#adq) {
                for (const id of i.list) {
                    if (this.formatVersion >= 3 && id.flag > 0) out += `flags = ${id.flag}\n`;

                    /** @type {Map<number, W3ABDHQTUItemDataValue[]>} */
                    const map = new Map();

                    for (const idv of id.list) {
                        if (idv.level === 0) {
                            out += `# ${Dec2RawBE(idv.id)}\n`;
                            out += _type(idv.id, idv.type, idv.value);
                            continue;
                        }
                        if (!map.has(idv.id)) map.set(idv.id, []);
                        map.get(idv.id).push(idv);
                    }

                    map.forEach((list) => {
                        const idv = list[0];
                        const name = `${Dec2RawBE(idv.id)}`;
                        out += `# ${name}\n`;
                        const value = [];
                        const data = [];
                        for (const idv of list.sort((a, b) => a.level - b.level)) {
                            value.push(idv.value);
                            data.push(idv.data);
                        }

                        switch (idv.type) {
                            case 0:
                                out += `${name}Type = "integer"\n${name} = `;
                                out += value.length > 1 ? `[\n${value.join(',\n')}\n]\n` : `${idv.value}\n`;
                                break;
                            case 1:
                                out += `${name}Type = "real"\n${name} = `;
                                out += value.length > 1 ? `[\n${value.join(',\n')}\n]\n` : `${idv.value}\n`;
                                break;
                            case 2:
                                out += `${name}Type = "unreal"\n${name} = `;
                                out += value.length > 1 ? `[\n${value.join(',\n')}\n]\n` : `${idv.value}\n`;
                                break;
                            case 3:
                                out += `${name}Type = "string"\n${name} = `;
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

                        if (idv.end > 0) out += `${name}End = "${Dec2RawBE(idv.end)}"\n`;
                    });

                }
            } else {
                for (const id of i.list) {
                    if (this.formatVersion >= 3 && id.flag > 0) out += `flags = ${id.flag}\n`;
                    for (const idv of id.list) {
                        out += _type(idv.id, idv.type, idv.value);
                        if (idv.end > 0) out += `${Dec2RawBE(idv.id)}End = "${Dec2RawBE(idv.end)}"\n`;
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
     * @return {T}
     */
    static _fromTOML(self, toml, adq) {
        /** @type {Object.<string, any>} */
        const o = tomlParser.parse(toml);
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

            if (attrMap.length === 0) {
                console.log('catch!!');
                continue;
            }

            const itemData = new W3ABDHQTUItemData(adq, self.formatVersion);
            item.list.push(itemData);
            if (self.formatVersion >= 3) itemData.flag = 0;

            for (const [attrRawId, attrValue] of Object.entries(attrMap)) {
                if (attrRawId.length !== 4) continue;
                if (attrValue instanceof Array) {
                    for (let i = 0; i < attrValue.length; i++) {

                        const itemDataValue = new W3ABDHQTUItemDataValue(adq);
                        itemData.list.push(itemDataValue);
                        itemDataValue.fromMap(attrRawId, attrMap);
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
                itemDataValue.fromMap(attrRawId, attrMap);

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