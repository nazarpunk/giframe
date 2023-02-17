/** @module MDX */

export class BYTE {
	/**
	 * @param {Reader} reader
	 * @param {number} length
	 */
	constructor(reader, length = 1) {
		this.reader = reader;
		this.length = length;
		for (let i = 0; i < length; i++) {
			this.list.push(this.reader.view.getUint8(reader.byteOffset));
			this.reader.byteOffset += 1;
		}
	}

	/** @type {number[]} */ list = [];

	write() {
		const view = this.reader.outputView(this.length);
		for (let i = 0; i < this.length; i++) {
			view.setUint8(i, this.list[i]);
		}
	}
}
