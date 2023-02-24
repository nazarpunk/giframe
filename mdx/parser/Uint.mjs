/** @module MDX */

export class Uint {
	/** @type {Reader} */ reader;

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

	toJSON() {
		return this.value;
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
			this.list.push(this.reader.readUint(1));
			this.reader.readOffsetAdd(1);
		}
	}

	write() {
		for (let i = 0; i < this.length; i++) {
			this.reader.writeUint(1, this.list[i]);
		}
	}

	toJSON() {
		return this.list;
	}
}