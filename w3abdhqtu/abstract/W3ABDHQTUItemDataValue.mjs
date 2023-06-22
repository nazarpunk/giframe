import {Dec2RawBE} from '../../rawcode/convert.mjs';

export class W3ABDHQTUItemDataValue {

    /** @param {boolean} adq */
    constructor(adq) {
        this.#adq = adq;
    }

    /** @type {boolean} */ #adq;
    list = [];

    /** @type {('integer'|'real'|'unreal'|'string')}*/
    #type;

    /** @param {CDataView} view */
    read(view) {
        this.id = view.uint32BE;
        this.type = view.uint32;

        if (this.#adq) {
            this.level = view.uint32;
            this.data = view.uint32;
        }

        switch (this.type) {
            case 0:
                this.value = view.uint32;
                this.#type = 'integer';
                break;
            case 1:
                this.#type = 'real';
                this.value = view.float32;
                break;
            case 2:
                this.#type = 'unreal';
                this.value = view.float32;
                break;
            case 3:
                this.#type = 'string';
                this.value = view.string;
                break;
            default:
                throw new Error(`Unknown variable type: ${this.type}`);
        }
        this.end = view.uint32BE;
    }

    /** @param {CDataView} view */
    write(view) {
        view.uint32BE = this.id;
        view.uint32 = this.type;

        if (this.#adq) {
            view.uint32 = this.level;
            view.uint32 = this.data;
        }

        switch (this.type) {
            case 0:
                view.uint32 = this.value;
                break;
            case 1:
            case 2:
                view.float32 = this.value;
                break;
            case 3:
                view.string = this.value;
                break;
            default:
                throw new Error(`Unknown variable type: ${this.type}`);
        }
        view.uint32BE = this.end;
    }

    toJSON() {
        return {
            id: Dec2RawBE(this.id),
            type: this.#type,
            level: this.level,
            data: this.data,
            value: this.value,
            end: this.end > 0 ? Dec2RawBE(this.end) : undefined,
        };
    }
}