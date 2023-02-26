/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {ParserOld} from "../parser/ParserOld.mjs";
import {Key} from "../parser/Key.mjs";
import {Uint32} from "../parser/Uint.mjs";

export class EventObject {
	/** @param {DataView} view */
	read(view) {
		this.parser = new Parser();
		this.node = this.parser.add(NodeData);
		this.key = this.parser.add(new Key(0x5456454b/*KEVT*/));
		this.count = this.parser.add(Uint32);
		this.globalSequenceId = this.parser.add(Uint32);
		this.parser.read(view);
		for (let i = 0; i < this.count.value; i++) {
			let p = new Uint32();
			this.items.push(p);
			p.reader = this.reader;
			p.read();
		}
	}

	items = [];

	write() {
		this.parser.write();
		for (const p of this.items) {
			p.write();
		}
		this.reader.setUint(this.count.size, this.items.length, this.count.writeOffsetCurrent);
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