import {CDataView} from '../utils/c-data-view.mjs';
import {Dec2RawBE} from '../rawcode/convert.mjs';
import {CDataViewFake} from '../utils/c-data-view-fake.mjs';
import fromBuffer from '../utils/bufffer-to-buffer.mjs';

export class W3ABDHQTU {

    /**
     * @param {Buffer|ArrayBuffer} buffer
     * @param {boolean} adq
     */
    constructor(buffer, adq) {
        this.#buffer = fromBuffer(buffer);
        this.#adq = adq;
        this.defaultObjects = new DataTable(this.#adq);
        this.customObjects = new DataTable(this.#adq);
    }

    /** @type {ArrayBuffer} */ #buffer;
    /** @type {boolean} */ #adq;

    #read() {
        const view = new CDataView(this.#buffer);
        this.formatVersion = view.Uint32;
        if (this.formatVersion < 1 || this.formatVersion > 2) {
            throw new Error(`This format is unsupported: ${this.formatVersion}`);
        }

        this.defaultObjects.read(view);
        this.customObjects.read(view);

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
        view.Uint32 = this.formatVersion;
        this.defaultObjects.write(view);
        this.customObjects.write(view);
    }

    write() {
        // noinspection JSValidateTypes
        /** @type {CDataView} */
        const dvf = new CDataViewFake();
        this.#write(dvf);

        const ab = new ArrayBuffer(dvf.cursor);
        const dv = new CDataView(ab);
        this.#write(dv);

        return ab;
    }

    errors = [];

    toJSON() {
        return {
            'formatVersion': this.formatVersion,
            'defaultObjects': this.defaultObjects,
            'customObjects': this.customObjects,
        };
    }
}

class DataTable {

    /** @param {boolean} adq */
    constructor(adq) {
        this.#adq = adq;
    }

    /** @type {boolean} */ #adq;

    /** @param {CDataView} view */
    read(view) {
        this.count = view.Uint32;
        for (let i = 0; i < this.count; i++) {
            const obj = new DataObject(this.#adq);
            obj.read(view);
            this.items.push(obj);
        }
    }

    /** @type {DataObject[]} */ items = [];

    /** @param {CDataView} view */
    write(view) {
        view.Uint32 = this.count;
        for (const item of this.items) {
            item.write(view);
        }
    }

    toJSON() {
        return this.items;
    }
}

class DataObject {
    /** @param {boolean} adq */
    constructor(adq) {
        this.#adq = adq;
    }

    /** @type {boolean} */ #adq;

    /** @type {DataObjectField[]} */ fields = [];

    /** @param {CDataView} view */
    read(view) {
        this.rawcode = view.Uint32BE;
        this.rawcodeName = Dec2RawBE(this.rawcode);
        this.parent = view.Uint32BE;
        if (this.parent === 0) {
            this.parent = undefined;
        } else {
            this.parentName = Dec2RawBE(this.parent);
        }

        this.fieldCount = view.Uint32;
        for (let i = 0; i < this.fieldCount; i++) {
            const f = new DataObjectField(this.#adq);
            f.read(view);
            this.fields.push(f);
        }
    }

    /** @param {CDataView} view */
    write(view) {
        view.Uint32BE = this.rawcode;
        view.Uint32BE = this.parent;
        view.Uint32 = this.fields.length;
        for (const f of this.fields) {
            f.write(view);
        }
    }

    toJSON() {
        return {
            'rawcode': this.rawcodeName,
            'parent': this.parentName,
            'fields': this.fields,
        };
    }
}

class DataObjectField {
    /** @param {boolean} adq */
    constructor(adq) {
        this.#adq = adq;
    }

    /** @type {boolean} */ #adq;

    /** @param {CDataView} view */
    read(view) {
        this.rawcode = view.Uint32BE;
        this.rawcodeName = Dec2RawBE(this.rawcode);

        this.dataType = view.Uint32;

        if (this.#adq) {
            this.level = view.Uint32;
            this.field = view.Uint32;
        }

        switch (this.dataType) {
            case 0:
                this.value = view.Uint32;
                this.dataTypeName = 'integer';
                break;
            case 1:
            case 2:
                this.value = view.Float32;
                this.dataTypeName = 'real';
                break;
            case 3:
                this.value = view.String;
                this.dataTypeName = 'string';
                break;
            default:
                throw new Error(`Unknown DataObjectField type: ${this.dataType}`);
        }

        view.cursor += 4;
    }

    /** @param {CDataView} view */
    write(view) {
        view.Uint32BE = this.rawcode;
        view.Uint32 = this.dataType;
        view.Uint32BE = this.level;
        view.Uint32 = this.field;

        switch (this.dataType) {
            case 0:
                view.Uint32 = this.value;
                break;
            case 1:
            case 2:
                view.Float32 = this.value;
                break;
            case 3:
                view.String = this.value;
        }

        view.Uint32 = 0;
    }

    toJSON() {
        return {
            'rawcode': this.rawcodeName,
            'dataType': this.dataTypeName,
            'level': this.level,
            'field': this.field,
            'value': this.value,
        };
    }
}