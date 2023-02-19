/** @module MDX */
export class Uint32 {
	/** @param {number} length */
	constructor(length = 1) {
		this.length = length;
	}

	/** @type {Reader} */ reader;
	/** @type {number[]} */ list = [];

	read() {
		for (let i = 0; i < this.length; i++) {
			this.list.push(this.reader.getUint32());
			this.reader.moveUint32();
		}
		this.value = this.list[0];
	}

	write() {
		const view = this.reader.outputView(this.length * 4);
		for (let i = 0; i < this.length; i++) {
			view.setUint32(i * 4, this.list[i], true);
		}
	}

	toJSON() {
		return this.list.length > 1 ? this.list : this.list[0]
	}
}