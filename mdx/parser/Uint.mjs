/** @module MDX */

export class Uint8 {

    /** @param {CDataView} view */
    read(view) {
        this.value = view.Uint8;
    }

    /** @param {CDataView} view */
    write(view) {
        view.Uint8 = this.value;
    }

    toJSON() {
        return this.value;
    }
}

export class Uint16 {

    /** @param {CDataView} view */
    read(view) {
        this.value = view.Uint16;
    }

    /** @param {CDataView} view */
    write(view) {
        view.Uint16 = this.value;
    }

    toJSON() {
        return this.value;
    }
}

export class Uint32 {

    /** @param {CDataView} view */
    read(view) {
        this.value = view.Uint32;
    }

    /** @param {CDataView} view */
    write(view) {
        view.Uint32 = this.value;
    }

    toJSON() {
        return this.value;
    }
}


export class Uint8List {
    /** @param {number} length */
    constructor(length = 1) {
        this.length = length;
    }

    /** @type {number[]} */ list = [];

    /** @param {CDataView} view */
    read(view) {
        for (let i = 0; i < this.length; i++) {
            this.list.push(view.Uint8);
        }
    }

    /** @param {CDataView} view */
    write(view) {
        for (const i of this.list) {
            view.Uint8 = i;
        }
    }

    toJSON() {
        return this.list;
    }
}