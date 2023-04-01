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

    getFloat32(byteOffset, littleEndian) {
        return super.getFloat32(byteOffset, littleEndian);
    }

    getUint8(byteOffset) {
        return super.getUint8(byteOffset);
    }

    getUint16(byteOffset, littleEndian) {
        return super.getUint16(byteOffset, littleEndian);
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


    /**
     * @deprecated
     * @param {number} byteOffset
     * @param {number} value
     * @param {boolean} littleEndian
     */
    setUint32(byteOffset, value, littleEndian) {
        super.setUint32(byteOffset, value, littleEndian);
    }

    /**
     * @deprecated
     * @param byteOffset
     * @param littleEndian
     * @returns {number}
     */
    getUint32(byteOffset, littleEndian) {
        return super.getUint32(byteOffset, littleEndian);
    }

}


/** @extends CDataView */
export class CDataViewWrite {
    /** @type {number} */ cursor = 0;

    setFloat32(_, __, ___) {}

    setUint8(_, __) {}

    setUint16(_, __, ___) {}

    setUint32(_, __, ___) {}

    // noinspection JSCheckFunctionSignatures
    /** @returns {number} */
    get sizeOffset() {
        this.cursor += 4;
        return this.cursor - 4;
    }

    set sizeOffset(_) {}

    set Uint32(_) {
        this.cursor += 4;
    }
}