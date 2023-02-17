/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";

export class Rotations {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.NrOfTracks = new DWORD(r);
		this.InterpolationType = new DWORD(r);
		this.GlobalSequenceId = new DWORD(r);
		for (let i = 0; i < this.NrOfTracks.value; i++) {
			this.rotations.push(new Rotation(this));
		}
	}

	/**
	 * 0 - None
	 * 1 - Linear
	 * 2 - Hermite
	 * 3 - Bezier
	 * @type {DWORD}
	 */
	InterpolationType;

	/** @type Rotation[] */ rotations = [];

	write() {
		this.key.write();
		this.NrOfTracks.writeValue(this.rotations.length);
		this.InterpolationType.write();
		this.GlobalSequenceId.write();
		for (const r of this.rotations) {
			r.write();
		}
	}
}

class Rotation {
	/** @param {Rotations} parent */
	constructor(parent) {
		const r = parent.key.reader;
		this.time = new DWORD(r);
		this.rotation = new VECTOR(r, 4);
		if (parent.InterpolationType.value > 1) {
			this.InTan = new VECTOR(r, 4);
			this.OutTan = new VECTOR(r, 4);
		}
	}

	write() {
		this.time.write();
		this.rotation.write();
		this.InTan?.write();
		this.OutTan?.write();
	}
}