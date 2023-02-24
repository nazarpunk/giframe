/** @module MDX */

export class Uint {
	/** @type {Reader} */ reader;

	/** @type {number} */ readOffset;

	/** @param {1|2|4} size */
	constructor(size) {
		this.size = size;
	}

	read() {
		this.value = this.reader.readUint(this.size);
		this.reader.readOffsetAdd(this.size);
	}

	write() {
		this.reader.writeUint(this.size, this.value);
	}
}

export class Uint8 extends Uint {
	constructor() {
		super(1);
	}
}

export class Uint16 extends Uint {
	constructor() {
		super(2);
	}
}

export class Uint32 extends Uint {
	constructor() {
		super(4);
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