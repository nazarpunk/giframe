/** @module MDX */

import {StructSizeOld} from "../type/StructSizeOld.mjs";
import {NodeData} from "./NodeData.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";
import {InterpolationOld} from "../parser/InterpolationOld.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class Attachment {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSizeOld(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.Path = new CHAR(reader, 260);
		this.AttachmentId = new DWORD(reader);

		if (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader, {name: 'KATV'});
			this.AttachmentVisibility = new InterpolationOld(key, FLOAT);
		}

		this.inclusiveSize.check();
	}

	write() {
		this.inclusiveSize.save();
		this.node.write();
		this.Path.write();
		this.AttachmentId.write();
		this.AttachmentVisibility?.write();
		this.inclusiveSize.write();
	}
}
