export class Format {
	/** @param {KEY} key */
	constructor(key) {
		this.key = key;
	}

	write() {
		this.key.write();
	}
}