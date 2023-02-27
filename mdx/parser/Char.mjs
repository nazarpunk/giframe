/** @module MDX */

export class Char {
	/** @param {number} length */
	constructor(length = 1) {
		this.length = length;
	}

	copy() {
		return new this.constructor(this.length);
	}

	/** @type {string} */ value;

	/** @param {DataView} view */
	read(view) {
		const s = [];

		for (let i = 0; i < this.length; i++) {
			s.push(String.fromCharCode(view.getUint8(view.cursor + i)));
		}
		for (let i = s.length - 1; i >= 0; i--) {
			if (s[i] !== '\x00') {
				break;
			}
			s.length -= 1;
		}
		view.cursor += this.length;
		this.value = s.join('');
	}

	/** @param {DataView} view */
	write(view) {
		const str = this.value.padEnd(this.length, '\x00');
		for (let i = 0; i < this.length; i++) {
			view.setUint8(view.cursor + i, str.charCodeAt(i));
		}
		view.cursor += this.length;
	}

	toJSON() {
		return this.value;
	}
}