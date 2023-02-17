import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class Alpha {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.NrOfTracks = new DWORD(r);
		this.InterpolationType = new DWORD(r);
		this.GlobalSequenceId = new DWORD(r);
		for (let i = 0; i < this.NrOfTracks.value; i++) {
			this.traks.push(new AlphaTrack(this));
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

	/** @type AlphaTrack[] */ traks = [];

	write() {
		this.key.write();
		this.NrOfTracks.writeValue(this.traks.length);
		this.InterpolationType.write();
		this.GlobalSequenceId.write();
		for (const s of this.traks) {
			s.write();
		}
	}
}

class AlphaTrack {
	/** @param {Alpha} parent */
	constructor(parent) {
		const r = parent.key.reader;
		this.time = new DWORD(r);
		this.scaling = new FLOAT(r);
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
