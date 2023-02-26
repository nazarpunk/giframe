/** @module MDX */

export class Uint8 {

	/** @param {DataView} view */
	read(view) {
		this.value = view.getUint8(view.cursor);
		view.cursor += 1;
	}

	/** @param {DataView} view */
	write(view) {
		view.setUint8(view.cursor, this.value);
		view.cursor += 1;
	}

	toJSON() {
		return this.value;
	}
}

export class Uint16 {

	/** @param {DataView} view */
	read(view) {
		this.value = view.getUint16(view.cursor, true);
		view.cursor += 2;
	}

	/** @param {DataView} view */
	write(view) {
		view.setUint16(view.cursor, this.value, true);
		view.cursor += 2;
	}

	toJSON() {
		return this.value;
	}
}

export class Uint32 {

	/** @param {DataView} view */
	read(view) {
		this.value = view.getUint32(view.cursor, true);
		view.cursor += 4;
	}

	/** @param {DataView} view */
	write(view) {
		view.setUint32(view.cursor, this.value, true);
		view.cursor += 4;
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

	/** @type {number[]} */ list = [];

	/** @param {DataView} view */
	read(view) {
		for (let i = 0; i < this.length; i++) {
			this.list.push(view.getUint8(view.cursor));
			view.cursor += 1;
		}
	}

	/** @param {DataView} view */
	write(view) {
		for (const i of this.list) {
			view.setUint8(view.cursor, i);
			view.cursor += 1;
		}
	}

	toJSON() {
		return this.list;
	}
}