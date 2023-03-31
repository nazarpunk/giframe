/** @module MDX */

export class Float32 {
    /** @param {DataView} view */
    read(view) {
        this.value = view.getFloat32(view.cursor, true);
        view.cursor += 4;
    }

    /** @param {DataView} view */
    write(view) {
        view.setFloat32(view.cursor, this.value, true);
        view.cursor += 4;
    }

    toJSON() {
        return this.value;
    }
}

/** @module MDX */
export class Float32List {
    /** @param {number} length */
    constructor(length = 1) {
        this.length = length;
    }

    copy() {
        return new this.constructor(this.length);
    }

    /** @type {number[]} */ list = [];

    /** @param {DataView} view */
    read(view) {
        for (let i = 0; i < this.length; i++) {
            this.list.push(view.getFloat32(view.cursor, true));
            view.cursor += 4;
        }
    }

    /** @param {DataView} view */
    write(view) {
        for (let i = 0; i < this.list.length; i++) {
            view.setFloat32(view.cursor + i * 4, this.list[i], true);
        }
        view.cursor += this.list.length * 4;
    }

    toJSON() {
        return this.list;
    }
}
