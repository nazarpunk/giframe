/** @module MDX */

/**
 * @callback ReaderOnRead
 * @param {number} byteOffset
 * @param {number} byteLength
 */

/**
 * @callback ReaderOnWrite
 * @param {number} byteOffset
 * @param {number} byteLength
 * @param {boolean} calc
 */

export class Reader {

	/** @param {ArrayBuffer} buffer
	 * @param {ReaderOnRead?} onRead
	 * @param {ReaderOnWrite?} onWrite
	 */
	constructor(buffer, {
		onRead,
		onWrite,
	} = {}) {
		this.buffer = buffer;
		this.readView = new DataView(buffer);
		this.readOffset = 0;
		this.writeOffset = 0;
		this.version = 800;
		this.onWrite = onWrite;
		this.calc = true;
	}

	/** @type {DataView} */ writeView;

	/**
	 * @param {number} number
	 * @return {string}
	 */
	static int2s(number) {
		return String.fromCharCode(
			number & 0xff,
			number >> 8 & 0xff,
			number >> 16 & 0xff,
			number >> 24 & 0xff,
		);
	}

	/**
	 * @param {4|8} size
	 * @return {number}
	 */
	readFloat(size) {
		switch (size) {
			case 4:
				return this.readView.getFloat32(this.readOffset, true);
			case 8:
				return this.readView.getFloat64(this.readOffset, true);
			default:
				throw new Error(`Reader.readFloat size ${size} not in [4|8]`);
		}
	}

	/**
	 * @param {4|8} size
	 * @param {number} uint
	 */
	writeFloat(size, uint) {
		if (this.calc) {
			return this._onWrite(size);
		}
		const offset = this.writeOffset;
		switch (size) {
			case 4:
				return this.writeView.setFloat32(offset, uint, true);
			case 8:
				return this.writeView.setFloat32(offset, uint, true);
			default:
				throw new Error(`Reader.writeFloat size ${size} not in [4|8]`);
		}
	}

	/**
	 * @param {number} size
	 * @private
	 */
	_onWrite(size) {
		const old = this.writeOffset;
		this.writeOffset += size;
		this.onWrite?.(old, this.writeOffset, this.calc);
	}
}