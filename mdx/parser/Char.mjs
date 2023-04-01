/** @module MDX */

export class Char {
    /** @param {number} length */
    constructor(length = 1) {
        this.length = length;
    }

    copy() {
        return new this.constructor(this.length);
    }

    /** @type {string} */ value;

    /** @param {CDataView} view */
    read(view) {
        const s = [];

        for (let i = 0; i < this.length; i++) {
            s.push(String.fromCharCode(view.Uint8));
        }
        for (let i = s.length - 1; i >= 0; i--) {
            if (s[i] !== '\x00') {
                break;
            }
            s.length -= 1;
        }
        this.value = s.join('');
    }

    /** @param {CDataView} view */
    write(view) {
        const str = this.value.padEnd(this.length, '\x00');
        for (let i = 0; i < this.length; i++) {
            view.Uint8 = str.charCodeAt(i);
        }
    }

    toJSON() {
        return this.value;
    }
}