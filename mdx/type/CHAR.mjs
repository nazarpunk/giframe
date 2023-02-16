export class CHAR {
	/**
	 * @param {Reader} reader
	 * @param length
	 */
	constructor(reader, length) {
		this.reader = reader;
		this.length = length;
		const s = [];
		for (let i = 0; i < length; i++) {
			s.push(String.fromCharCode(reader.view.getUint8(reader.byteOffset)));
			reader.byteOffset++;
		}
		for (let i = s.length - 1; i >= 0; i--) {
			if (s[i] !== '\x00') {
				break;
			}
			s.length -= 1;
		}
		this.value = s.join('');
	}

	value = '';

	write() {
		let str = this.value.padEnd(this.length, '\x00');
		const view = this.reader.outputView(this.length);
		for (let i = 0; i < this.length; i++) {
			view.setInt8(i, str.charCodeAt(i));
		}
	}
}