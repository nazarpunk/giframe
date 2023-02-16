export class InclusiveSize {
	/** @param {Reader} reader */
	constructor(reader) {
		this.reader = reader;
		this.value = this.reader.view.getUint32(reader.byteOffset, true);
		this.end = reader.byteOffset + this.value;
		this.reader.byteOffset += 4;
	}

	check() {
		if (this.reader.byteOffset !== this.end) {
			console.error('InclusiveSize!')
		}
	}

	save() {
		this.start = this.reader.output.byteLength;
		this.reader.outputView(4);
	}

	write() {
		if (!this.start) {
			console.error('InclusiveSize not saved');
			return;
		}
		this.value = this.reader.output.byteLength - this.start;
		new DataView(this.reader.output, this.start, 4).setUint32(0, this.value, true);
	}
}