/** @module MDX */

export class Reader {

	/** @param {ArrayBuffer} buffer */
	constructor(buffer) {
		this.view = new DataView(buffer);
		this.byteOffset = 0;
		this.output = new ArrayBuffer(0);
		this.version = 800;
	}

	/**
	 * @return number
	 */
	getUint32() {
		return this.view.getUint32(this.byteOffset, true);
	}

	/** @param {number} value */
	setUint32(value) {
		this.outputView(4).setUint32(0, value, true);
	}

	updateUint32(value, offset) {
		new DataView(this.output, offset, 4).setUint32(0, value, true);
	}

	moveUint32() {
		this.byteOffset += 4;
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