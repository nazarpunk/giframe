/** @module MDX */

export class Uint8 {
	/** @type {Reader} */ reader;

	read() {
		this.value = this.reader.getUint8();
		this.reader.readOffsetAdd(1);
	}

	write() {
		this.reader.setUint8(this.value);
	}

	toJSON() {
		return this.value;
	}
}

export class Uint16 {
	/** @type {Reader} */ reader;

	read() {
		this.value = this.reader.getUint16();
		this.reader.readOffsetAdd(2);
	}

	write() {
		this.reader.setUint16(this.value);
	}

	toJSON() {
		return this.value;
	}
}

export class Uint32 {
	/** @type {Reader} */ reader;

	read() {
		this.value = this.reader.getUint32();
		this.reader.readOffsetAdd(4);
	}

	write() {
		this.reader.setUint32(this.value);
	}

	toJSON() {
		return this.value;
	}
}

export class Uint8List {
	/** @param {number} length */
	constructor(length = 1) {
		this.length = length;
	}

	/** @type {Reader} */ reader;
	/** @type {number[]} */ list = [];

	read() {
		for (let i = 0; i < this.length; i++) {
			this.list.push(this.reader.getUint8());
			this.reader.readOffsetAdd(1);
		}
		this.value = this.list[0];
	}

	write() {
		const view = this.reader.outputView(this.length);
		for (let i = 0; i < this.length; i++) {
			view.setUint8(i, this.list[i]);
		}
	}

	toJSON() {
		return this.list;
	}
}