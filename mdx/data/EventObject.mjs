/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {Parser} from "../parser/Parser.mjs";
import {Key} from "../parser/Key.mjs";
import {Uint32} from "../parser/Uint.mjs";

export class EventObject {
	/** @type {Reader} */ reader;

	read() {
		const p = new Parser(this.reader);
		this.node = p.add(NodeData);
		this.key = p.add(new Key(0x5456454b/*KEVT*/));
		this.count = p.add(Uint32);
		this.globalSequenceId = p.add(Uint32);
		p.read();
		for (let i = 0; i < this.count.value; i++) {
			let p = new Uint32();
			this.items.push(p);
			p.reader = this.reader;
			p.read();
		}
	}

	items = [];

	write() {
		this.node.parser.write();
		this.key.write();
		const start = this.reader.output.byteLength;
		this.count.write();
		this.globalSequenceId.write();
		for (const p of this.items) {
			p.write();
		}
		this.reader.updateUint32(this.items.length, start);
	}

	toJSON() {
		return {
			node: this.node,
			key: this.key,
			count: this.count,
			globalSequenceId: this.globalSequenceId,
		}
	}
}

/*
EventObject {
  Node node
  char[4] "KEVT"
  uint32 tracksCount
  uint32 globalSequenceId
  uint32[tracksCount] tracks
}
 */
