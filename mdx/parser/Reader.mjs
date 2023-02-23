/** @module MDX */

/**
 * @callback ReaderByteCallback
 * @param {number} byte
 */


export class Reader {

	/** @param {ArrayBuffer} buffer
	 * @param {ReaderByteCallback?} onRead
	 */
	constructor(buffer, {
		onRead,
	} = {}) {
		this.view = new DataView(buffer);
		this.readOffset = 0;
		this.writeOffset = 0;
		this.output = new ArrayBuffer(0);
		this.version = 800;
		this.onRead = onRead;
	}

	readOffsetAdd(byte) {
		this.readOffset += byte;
		this.onRead?.(this.readOffset);
	}

	/** @return number */
	getFloat32() {
		return this.view.getFloat32(this.readOffset, true);
	}

	/** @return number */
	getUint8() {
		return this.view.getUint8(this.readOffset);
	}

	/** @param {number} value */
	setUint8(value) {
		this.outputView(1).setUint8(0, value);
	}

	/** @return number */
	getUint16() {
		return this.view.getUint16(this.readOffset, true);
	}

	/** @param {number} value */
	setUint16(value) {
		this.outputView(2).setUint16(0, value, true);
	}

	/** @return number */
	getUint32() {
		return this.view.getUint32(this.readOffset, true);
	}

	/** @param {number} value */
	setUint32(value) {
		this.outputView(4).setUint32(0, value, true);
	}

	next32() {
		this.readOffset += 4;
	}

	/**
	 * @param {number} value
	 * @param {number} offset
	 */
	updateUint32(value, offset) {
		new DataView(this.output, offset, 4).setUint32(0, value, true);
	}

	/**
	 * @param {number} length
	 * @return {DataView}
	 */
	outputView(length) {
		const l = this.output.byteLength;
		const b = new Uint8Array(l + length);
		b.set(new Uint8Array(this.output));
		return new DataView(this.output = b.buffer, l);
	}
}