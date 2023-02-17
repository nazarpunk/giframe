import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";

export class Helper {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.chunkSize.end) {
			this.nodes.push(new NodeData(r));
		}
		this.chunkSize.check();
	}

	/** @type {NodeData[]} */ nodes = [];

	write() {
		this.key.write();
		this.chunkSize.save();
		for (const n of this.nodes) {
			n.write();
		}
		this.chunkSize.write();
	}
}