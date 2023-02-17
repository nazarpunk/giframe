import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";
import {Alpha} from "./Alpha.mjs";

export class Attachments {

	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.chunkSize.end) {
			this.attachments.push(new Attachment(r));
		}
		this.chunkSize.check();
	}

	/** @type {Attachment[]} */
	attachments = [];

	write() {
		this.key.write();
		this.chunkSize.save();
		for (const a of this.attachments) {
			a.write();
		}
		this.chunkSize.write();
	}
}

class Attachment {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.Path = new CHAR(reader, 260);
		this.AttachmentId = new DWORD(reader);

		if (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader, {name: 'KATV'});
			this.AttachmentVisibility = new Alpha(key);
		}

		this.inclusiveSize.check();

	}

	/**
	 * First attachment - 0, second - 1 etc...
	 * @type {DWORD}
	 */
	AttachmentId;

	write() {
		this.inclusiveSize.save();
		this.node.write();
		this.Path.write();
		this.AttachmentId.write();
		this.AttachmentVisibility?.write();
		this.inclusiveSize.write();
	}
}
