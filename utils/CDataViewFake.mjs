/** @extends CDataView */
export class CDataViewFake {
    /** @type {number} */ cursor = 0;

    setUint8(_, __) {}

    set Uint8(_) {
        this.cursor += 1;
    }

    setUint16(_, __, ___) {}

    set Uint16(_) {
        this.cursor += 2;
    }

    setUint32(_, __, ___) {}

    set Uint32(_) {
        this.cursor += 4;
    }

    set Uint32BE(_) {
        this.cursor += 4;
    }

    setFloat32(_, __, ___) {}

    set Float32(_) {
        this.cursor += 4;
    }

    /** @param {string} s */
    set String(s) {
        this.cursor += s.length + 1;
    }

    get sizeOffset() {
        this.cursor += 4;
        return this.cursor - 4;
    }

    set sizeOffsetInclusive(_) {}

    set sizeOffsetExclusive(_) {}

}