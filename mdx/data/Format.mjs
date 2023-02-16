export class Format {
	/**
	 * @param {DWORD} key
	 */
	constructor(key) {
		this.key = key;
	}
	write() {
		this.key.write();
	}
}