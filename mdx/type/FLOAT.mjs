/** @module MDX */

export class FLOAT {
	/**
	 * @param {Reader} reader
	 * @param {number} length
	 */
	constructor(reader, length = 1) {
		this.reader = reader;
		this.length = length;
		for (let i = 0; i < length; i++) {
			this.list.push(this.reader.view.getFloat32(reader.byteOffset, true));
			this.reader.byteOffset += 4;
		}
	}

	/** @type {number[]} */ list = [];

	write() {
		const view = this.reader.outputView(this.length * 4);
		for (let i = 0; i < this.length; i++) {
			view.setFloat32(i * 4, this.list[i], true);
		}
	}
}