/** @module MDX */

import {KEY} from "../type/KEY.mjs";
import {Tracks} from "./Tracks.mjs";
import {NodeData} from "./NodeData.mjs";

export class EventObject {
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
