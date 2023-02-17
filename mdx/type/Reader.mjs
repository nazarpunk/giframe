/** @module MDX */

export class Reader {

	/** @param {ArrayBuffer} buffer */
	constructor(buffer) {
		this.input = buffer;
		this.view = new DataView(this.input);
		this.output = new ArrayBuffer(0);
		this.byteOffset = 0;
	}

	/**
	 * @param {number} length
	 * @return {DataView}
	 */
	outputView(length) {
		const l = this.output.byteLength;
		const b = new ArrayBuffer(l + length);
		(new Uint8Array(b, 0, l)).set(new Uint8Array(this.output, 0, l));
		this.output = b;
		return new DataView(this.output, l);
	}
}