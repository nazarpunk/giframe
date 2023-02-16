export class StructSize {
	/** @param {Reader} reader
	 * @param {boolean} inclusive
	 * @param {boolean} chunk
	 */
	constructor(reader, {inclusive = false, chunk = false}) {
		this.reader = reader;
		this.value = this.reader.view.getUint32(reader.byteOffset, true);
		if (inclusive) {
			this.end = this.reader.byteOffset + this.value;
			this._add = 0;
		}
		this.reader.byteOffset += 4;
		if (chunk) {
			this.end = this.reader.byteOffset + this.value;
			this._add = -4;
		}
	}

	check() {
		if (this.reader.byteOffset !== this.end) {
			console.error(`StructSize not check`)
		}
	}

	save() {
		this.start = this.reader.output.byteLength;
		this.reader.outputView(4);
	}

	write() {
		if (!this.start) {
			console.error('StructSize not save');
			return;
		}
		this.value = this.reader.output.byteLength - this.start + this._add;
		new DataView(this.reader.output, this.start, 4).setUint32(0, this.value, true);
	}
}