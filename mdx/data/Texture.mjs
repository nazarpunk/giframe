/** @module MDX */

import {Uint32} from '../parser/Uint.mjs';
import {Char} from '../parser/Char.mjs';
import {Parser} from '../parser/Parser.mjs';

export class Texture {

    #filenameSize = 260;

    #wrapWidthFlag = 0x1;
    #wrapHeightFlag = 0x2;

    /** @param {CDataView} view */
    read(view) {
        this.replaceableId = view.Uint32;
        this.filename = view.getStringFixed(this.#filenameSize);
        let flags = view.Uint32;
        this.wrapWidth = flags & this.#wrapWidthFlag > 0;
        this.wrapHeight = flags & this.#wrapHeightFlag > 0;
    }

    /** @param {CDataView} view */
    write(view) {
        view.Uint32 = this.replaceableId;
        view.setStringFixed(this.filename, this.#filenameSize);
        let flags = 0;
        if (this.wrapWidth) flags |= this.#wrapWidthFlag;
        if (this.wrapHeight) flags |= this.#wrapHeightFlag;
        view.Uint32 = flags;
    }

    toJSON() {
        return {
            replaceableId: this.replaceableId,
            filename: this.filename,
            wrapWidth: this.wrapWidth,
            wrapHeight: this.wrapHeight,
        };
    }
}