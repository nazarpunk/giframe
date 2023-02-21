/** @module MDX */

export class Char {
	/** @param {number} length */
	constructor(length = 1) {
		this.length = length;
	}

	copy() {
		return new Char(this.length);
	}

	/** @type {Reader} */ reader;

	value = '';

	read() {
		const s = [];
		for (let i = 0; i < this.length; i++) {
			s.push(String.fromCharCode(this.reader.view.getUint8(this.reader.byteOffset)));
			this.reader.byteOffset++;
		}
		for (let i = s.length - 1; i >= 0; i--) {
			if (s[i] !== '\x00') {
				break;
			}
			s.length -= 1;
		}
		this.value = s.join('');
	}

	write() {
		let str = this.value.padEnd(this.length, '\x00');
		const view = this.reader.outputView(this.length);
		for (let i = 0; i < this.length; i++) {
			view.setInt8(i, str.charCodeAt(i));
		}
	}

	toJSON() {
		return this.value;
	}
}