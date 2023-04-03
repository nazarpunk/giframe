/** @module W3A */
import {CDataView} from '../utils/CDataView.mjs';
import {HexInt2StringBE} from '../utils/Hex.mjs';
import {CDataViewFake} from '../utils/CDataViewFake.mjs';

export class W3A {

    /** @param {ArrayBuffer} buffer */
    constructor(buffer) {
        this.#buffer = buffer;
    }

    /** @type ArrayBuffer */
    #buffer;

    #read() {
        const view = new CDataView(this.#buffer);
        this.formatVersion = view.Uint32;
        if (this.formatVersion < 1 || this.formatVersion > 2) {
            throw new Error(`This format is unsupported: ${this.formatVersion}`);
        }

        this.countDefaultObject = view.Uint32;
        for (let i = 0; i < this.countDefaultObject; i++) {
            const obj = new DataObject();
            obj.read(view);
            this.defaultObjects.push(obj);
        }
        this.countCustomObject = view.Uint32;
        for (let i = 0; i < this.countCustomObject; i++) {
            const obj = new DataObject();
            obj.read(view);
            this.customObjects.push(obj);
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
        view.Uint32 = this.defaultObjects.length;
        for (const obj of this.defaultObjects) {
            obj.write(view);
        }

        view.Uint32 = this.customObjects.length;
        for (const obj of this.customObjects) {
            obj.write(view);
        }
    }

    write() {
        // noinspection JSValidateTypes
        /** @type {CDataView} */
        const dvw = new CDataViewFake();
        this.#write(dvw);

        const ab = new ArrayBuffer(dvw.cursor);
        const dv = new CDataView(ab);
        this.#write(dv);

        return ab;
    }

    errors = [];

    /** @type {DataObject[]} */ defaultObjects = [];
    /** @type {DataObject[]} */ customObjects = [];

    toJSON() {
        return {
            'formatVersion': this.formatVersion,
            'countDefaultObject': this.countDefaultObject,
            'defaultObjects': this.defaultObjects,
            'countCustomObject': this.countCustomObject,
            'customObjects': this.customObjects,
        };
    }
}

class DataObject {
    /** @type {DataObjectField[]} */ fields = [];

    /** @param {CDataView} view */
    read(view) {
        this.rawcode = view.Uint32BE;
        this.rawcodeName = HexInt2StringBE(this.rawcode);
        this.parent = view.Uint32BE;
        this.parentName = HexInt2StringBE(this.parent);
        this.fieldCount = view.Uint32;
        for (let i = 0; i < this.fieldCount; i++) {
            const f = new DataObjectField();
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
            'rawcode': this.rawcode,
            'rawcodeName': this.rawcodeName,
            'parent': this.parent,
            'parentName': this.parentName,
            'fieldCount': this.fieldCount,
            'fields': this.fields,
        };
    }
}

class DataObjectField {
    /** @param {CDataView} view */
    read(view) {
        this.rawcode = view.Uint32BE;
        this.rawcodeName = HexInt2StringBE(this.rawcode);

        this.dataType = view.Uint32;
        this.level = view.Uint32;
        this.field = view.Uint32;

        switch (this.dataType) {
            case 0:
                this.value = view.Uint32;
                this.dataTypeName = 'Uint32';
                break;
            case 1:
            case 2:
                this.value = view.Float32;
                this.dataTypeName = 'Float32';
                break;
            case 3:
                this.value = view.String;
                this.dataTypeName = 'String';
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
            'rawcode': this.rawcode,
            'rawcodeName': this.rawcodeName,
            'dataType': this.dataType,
            'dataTypeName': this.dataTypeName,
            'level': this.level,
            'field': this.field,
            'value': this.value,
        };
    }
}