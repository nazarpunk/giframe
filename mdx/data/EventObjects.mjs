import {StructSize} from "../type/StructSize.mjs";
import {KEY} from "../type/KEY.mjs";
import {Tracks} from "./Tracks.mjs";
import {NodeData} from "./NodeData.mjs";

//TODO chunk container
export class EventObjects {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.chunkSize.end) {
			this.events.push(new EventObject(r));
		}
		this.chunkSize.check();
	}

	/** @type {EventObject[]} */ events = [];

	write() {
		this.key.write();
		this.chunkSize.save();
		for (const e of this.events) {
			e.write();
		}
		this.chunkSize.write();
	}
}

class EventObject {
	/** @param {Reader} reader */
	constructor(reader) {
		this.node = new NodeData(reader);
		const key = new KEY(reader, {offset: 0});
		if (key.name === 'KEVT') {
			this.traks = new Tracks(reader);
		}
	}

	write() {
		this.node.write();
		this.traks.write();
	}
}
