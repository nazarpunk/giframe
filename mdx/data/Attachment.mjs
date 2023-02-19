/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class Attachment {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.Path = new CHAR(reader, 260);
		this.AttachmentId = new DWORD(reader);

		if (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader, {name: 'KATV'});
			this.AttachmentVisibility = new Interpolation(key, FLOAT);
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
