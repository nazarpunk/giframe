/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";

export class ChunkedList {
	/**
	 * @param {KEY} key
	 * @param {ReadWrite.} child
	 */
	constructor(key, child) {
		/** @type {Reader}  */
		const r = key.reader;
		this.key = key;
		this.size = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.size.end) {
			this.list.push(new child(r));
		}
		this.size.check();
	}

	/** @type {ReadWrite[]} */ list = [];

	write() {
		this.key.write();
		this.size.save();
		for (const n of this.list) {
			n.write();
		}
		this.size.write();
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