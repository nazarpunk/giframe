/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";

export class Bone {
	/** @param {Reader} reader */
	constructor(reader) {
		this.node = new NodeData(reader);
		this.GeosetId = new DWORD(reader);
		this.GeosetAnimationId = new DWORD(reader);
	}

	write() {
		this.node.write();
		this.GeosetId.write();
		this.GeosetAnimationId.write();
	}
}
