/** @module MDX */

import {Uint32} from '../parser/Uint.mjs';
import {Char} from '../parser/Char.mjs';
import {Parser} from '../parser/Parser.mjs';

export class Texture {

    #filenameSize = 260;

    /** @param {CDataView} view */
    read(view) {
        this.replaceableId = view.Uint32;
        this.filename = view.getStringFixed(this.#filenameSize);
        this.flags = view.Uint32;
    }

    /** @param {CDataView} view */
    write(view) {
        view.Uint32 = this.replaceableId;
        view.setStringFixed(this.filename, this.#filenameSize);
        view.Uint32 = this.flags;
    }

    toJSON() {
        return {
            replaceableId: this.replaceableId,
            filename: this.filename,
            flags: this.flags,
        };
    }
}