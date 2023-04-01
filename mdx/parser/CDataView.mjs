/** @module MDX */

export class CDataView extends DataView {
    /**
     * @param {ArrayBufferLike} buffer
     * @param {number?} byteOffset
     * @param {number?} byteLength
     */
    constructor(buffer, byteOffset, byteLength) {
        super(buffer, byteOffset, byteLength);
        this.cursor = 0;
    }

    /**
     * deprecated
     * @type {number}
     */
    cursor;

    /** @returns {number} */
    get Uint8() {
        this.cursor += 1;
        return super.getUint8(this.cursor - 1);
    }

    /** @param {number} v */
    set Uint8(v) {
        super.setUint8(this.cursor, v);
        this.cursor += 1;
    }

    /** @returns {number} */
    get Uint16() {
        this.cursor += 2;
        return super.getUint32(this.cursor - 2, true);
    }

    /** @param {number} v */
    set Uint16(v) {
        super.setUint16(this.cursor, v, true);
        this.cursor += 2;
    }

    /** @returns {number} */
    get Uint32() {
        this.cursor += 4;
        return super.getUint32(this.cursor - 4, true);
    }

    /** @param {number} v */
    set Uint32(v) {
        super.setUint32(this.cursor, v, true);
        this.cursor += 4;
    }

    /** @returns {number} */
    get Float32() {
        this.cursor += 4;
        return super.getFloat32(this.cursor - 4, true);
    }

    /** @param {number} v */
    set Float32(v) {
        super.setFloat32(this.cursor, v, true);
        this.cursor += 4;
    }

    /**
     * @deprecated
     * @param {number} byteOffset
     * @param {number} value
     */
    setUint8(byteOffset, value) {
        super.setUint8(byteOffset, value);
    }

    /**
     * @deprecated
     * @param byteOffset
     * @returns {number}
     */
    getUint8(byteOffset) {
        return super.getUint8(byteOffset);
    }

    /** @returns {number} */
    get sizeOffset() {
        this.cursor += 4;
        return this.cursor - 4;
    }

    /** @param {number} o */
    set sizeOffsetInclusive(o) {
        super.setUint32(o, this.cursor - o, true);
    }

    /** @param {number} o */
    set sizeOffsetExclusive(o) {
        super.setUint32(o, this.cursor - o - 4, true);
    }
}


/** @extends CDataView */
export class CDataViewWrite {
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

    setFloat32(_, __, ___) {}

    set Float32(_) {
        this.cursor += 4;
    }

    get sizeOffset() {
        this.cursor += 4;
        return this.cursor - 4;
    }

    set sizeOffsetInclusive(_) {}

    set sizeOffsetExclusive(_) {}

}