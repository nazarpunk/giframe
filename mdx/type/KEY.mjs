/** @module MDX */

export class KEY {
	/**
	 * @param {Reader} reader
	 * @param {string?} name
	 * @param {number} offset
	 */
	constructor(reader, {name, offset = 4} = {}) {
		this.reader = reader;
		const view = this.reader.view;
		this.value = view.getUint32(reader.byteOffset, true);
		const s = [];
		for (let i = 0; i < 4; i++) {
			s.push(String.fromCharCode(view.getUint8(reader.byteOffset + i)));
		}
		this.name = s.join('');
		this.reader.byteOffset += offset;

		if (name && this.name !== name) {
			throw new Error(`KEY ${name} not equal ${this.name}`);
		}
	}

	/** @type {number} */ value;
	/** @type {string} */ name;

	write() {
		this.reader.outputView(4).setUint32(0, this.value, true);
	}
}