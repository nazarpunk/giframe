/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {KEY} from "../type/KEY.mjs";

export class Model {
	/**
	 * @param {Reader} reader
	 * @param {string} keyName
	 * @return {?Model}
	 */
	static fromKey(reader, keyName) {
		const key = new KEY(reader, {offset: 0});
		return key.name === keyName ? new Model(new KEY(reader)) : null;
	}

	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		this.Name = new CHAR(r, 80);
		this.AnimationFileName = new CHAR(r, 260);
		this.BoundsRadius = new FLOAT(r);
		this.MinimumExtent = new FLOAT(r, 3);
		this.MaximumExtent = new FLOAT(r, 3);
		this.BlendTime = new DWORD(r);
	}

	write() {
		this.key.write();
		this.chunkSize.save();
		this.Name.write();
		this.AnimationFileName.write();
		this.BoundsRadius.write();
		this.MinimumExtent.write();
		this.MaximumExtent.write();
		this.BlendTime.write();
		this.chunkSize.write();
	}
}
