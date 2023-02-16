import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";

export class Scalings {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.NrOfTracks = new DWORD(r);
		this.InterpolationType = new DWORD(r);
		this.GlobalSequenceId = new DWORD(r);
		for (let i = 0; i < this.NrOfTracks.value; i++) {
			this.scalings.push(new Scaling(this));
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

	/** @type Scaling[] */ scalings = [];

	write() {
		this.key.write();
		this.NrOfTracks.writeValue(this.scalings.length);
		this.InterpolationType.write();
		this.GlobalSequenceId.write();
		for (const s of this.scalings) {
			s.write();
		}
	}
}

class Scaling {
	/**
	 * @param {Scalings} parent
	 */
	constructor(parent) {
		const r = parent.key.reader;
		this.time = new DWORD(r);
		this.scaling = new VECTOR(r, 3);
		if (parent.InterpolationType.value > 1) {
			this.InTan = new VECTOR(r, 3);
			this.OutTan = new VECTOR(r, 3);
		}
	}

	write() {
		this.time.write();
		this.scaling.write();
		this.InTan?.write();
		this.OutTan?.write();
	}
}
