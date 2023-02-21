/** @module MDX */
export class Float32List {
	/** @param {number} length */
	constructor(length = 1) {
		this.length = length;
	}

	copy() {
		return new Float32List(this.length);
	}

	/** @type {Reader} */ reader;
	/** @type {number[]} */ list = [];

	read() {
		for (let i = 0; i < this.length; i++) {
			this.list.push(this.reader.getFloat32());
			this.reader.next32();
		}
		this.value = this.list[0];
	}

	write() {
		const view = this.reader.outputView(this.length * 4);
		for (let i = 0; i < this.length; i++) {
			view.setFloat32(i * 4, this.list[i], true);
		}
	}

	toJSON() {
		return this.list;
	}
}