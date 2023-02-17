/** @module MDX */

export class WORD {
	/**
	 * @param {Reader} reader
	 * @param {number} length
	 */
	constructor(reader, length = 1) {
		this.reader = reader;
		this.length = length;
		for (let i = 0; i < length; i++) {
			this.list.push(this.reader.view.getUint16(reader.byteOffset, true));
			this.reader.byteOffset += 2;
		}
	}

	/** @type {number[]} */ list = [];

	write() {
		const view = this.reader.outputView(this.length * 2);
		for (let i = 0; i < this.length; i++) {
			view.setUint16(i * 2, this.list[i], true);
		}
	}
}
