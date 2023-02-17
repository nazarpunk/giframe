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