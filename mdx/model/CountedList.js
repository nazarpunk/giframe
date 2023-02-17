/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";

export class CountedList {
	/**
	 * @param {Reader} reader
	 * @param {string} keyName
	 * @param {ReadWrite.} child
	 * @param {boolean?} chunk
	 * @param {boolean?} count
	 * @return {?CountedList}
	 */
	static fromKey(reader, keyName, child, {chunk, count}) {
		const key = new KEY(reader, {offset: 0});
		return key.name === keyName ? new CountedList(new KEY(reader), child, {chunk: chunk, count: count}) : null;
	}

	/**
	 * @param {KEY} key
	 * @param {ReadWrite.} child
	 * @param {boolean?} chunk
	 * @param {boolean?} count
	 */
	constructor(key, child, {chunk, count}) {
		const r = key.reader;
		this.key = key;

		this.chunk = chunk;
		this.count = count;

		if (this.chunk) {
			this.size = new StructSize(r, {chunk: true});
			while (r.byteOffset < this.size.end) {
				this.list.push(new child(r));
			}
		}
		if (this.count) {
			this.size = new DWORD(r);
			for (let i = 0; i < this.size.value; i++) {
				this.list.push(new child(r));
			}
		}

		this.chunk && this.size.check();
	}

	/** @type {StructSize|DWORD} */ size;

	/** @type {ReadWrite[]} */ list = [];

	write() {
		this.key.write();
		this.chunk && this.size.save();
		this.count && this.size.write();
		for (const n of this.list) {
			n.write();
		}
		this.chunk && this.size.write();
	}
}

/**
 * @interface ReadWrite
 */
/**
 * @function
 * @name ReadWrite#constructor
 * @param {Reader} reader
 */
/**
 * @function
 * @name ReadWrite#write
 */