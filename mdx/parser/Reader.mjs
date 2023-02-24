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
		this.readView = new DataView(buffer);
		this.readOffset = 0;
		this.writeOffset = 0;
		this.version = 800;
		this.onRead = onRead;
		this.onWrite = onWrite;
		this.calc = true;
	}

	/** @type {ArrayBuffer} */ output;
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

	/** @param {number} size */
	readOffsetAdd(size) {
		this.readOffset += size;
		this.onRead?.(this.readOffset, this.readView.byteLength);
	}

	/** @param {number} size */
	writeOffsetAdd(size) {
		this.writeOffset += size;
		this.onWrite?.(this.writeOffset, this.output.byteLength, this.calc);
	}

	/**
	 * @param {1|2|4} size
	 * @return {number}
	 */
	readUint(size) {
		switch (size) {
			case 1:
				return this.readView.getUint8(this.readOffset);
			case 2:
				return this.readView.getUint16(this.readOffset, true);
			case 4:
				return this.readView.getUint32(this.readOffset, true);
			default:
				throw new Error(`Reader.readUint size ${size} not in [1|2|4]`);
		}
	}

	/**
	 * @param {number} size
	 * @param {number} uint
	 * @param {number} offset
	 */
	setUint(size, uint, offset) {
		if (this.calc) {
			return;
		}
		switch (size) {
			case 1:
				return this.writeView.setUint8(offset, uint);
			case 2:
				return this.writeView.setUint16(offset, uint, true);
			case 4:
				return this.writeView.setUint32(offset, uint, true);
			default:
				throw new Error(`Reader.writeUint size ${size} not in [1|2|4]`);
		}
	}

	/**
	 * @param {1|2|4} size
	 * @param {number} uint
	 */
	writeUint(size, uint) {
		if (this.calc) {
			return this._onWrite(size);
		}
		this.setUint(size, uint, this.writeOffset);
		this.writeOffsetAdd(size);
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
		this.writeOffsetAdd(size);
		switch (size) {
			case 4:
				return this.writeView.setFloat32(offset, uint, true);
			case 8:
				return this.writeView.setFloat32(offset, uint, true);
			default:
				throw new Error(`Reader.writeFloat size ${size} not in [4|8]`);
		}
	}

	readString(length) {
		const s = [];
		for (let i = 0; i < length; i++) {
			s.push(String.fromCharCode(this.readView.getUint8(this.readOffset + i)));
		}
		for (let i = s.length - 1; i >= 0; i--) {
			if (s[i] !== '\x00') {
				break;
			}
			s.length -= 1;
		}
		return s.join('');
	}

	writeString(length, str) {
		if (this.calc) {
			return this._onWrite(length);
		}

		str = str.padEnd(length, '\x00');
		for (let i = 0; i < length; i++) {
			this.setUint(1, str.charCodeAt(i), this.writeOffset + i);
		}
		this.writeOffsetAdd(length);
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