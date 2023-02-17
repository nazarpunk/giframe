/** @module MDX */
export class DWORD {
	/**
	 * @param {Reader} reader
	 * @param {number} length
	 */
	constructor(reader, length = 1) {
		this.reader = reader;
		this.length = length;
		for (let i = 0; i < length; i++) {
			this.list.push(this.reader.view.getUint32(reader.byteOffset, true));
			this.reader.byteOffset += 4;
		}
		this.value = this.list[0];
	}

	/** @type {number[]} */ list = [];

	write() {
		const view = this.reader.outputView(this.length * 4);
		for (let i = 0; i < this.length; i++) {
			view.setUint32(i * 4, this.list[i], true);
		}
	}

	/** @param {number} value */
	writeValue(value) {
		this.value = value;
		this.write();
	}
}