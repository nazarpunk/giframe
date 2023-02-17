/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";

export class Interpolation {

	/**
	 * @param {Reader} reader
	 * @param {string} keyName
	 * @param {ReadWrite.} child
	 * @param {number} length
	 * @return {?Interpolation}
	 */
	static fromKey(reader, keyName, child, length = 1) {
		const key = new KEY(reader, {offset: 0});
		return key.name === keyName ? new Interpolation(new KEY(reader), child, length) : null;
	}

	/**
	 * @param {KEY} key
	 * @param {ReadWrite.} child
	 * @param {number} length
	 */
	constructor(key, child, length = 1) {
		this.child = child;
		this.length = length;
		const r = key.reader;
		this.key = key;
		this.NrOfTracks = new DWORD(r);
		this.type = new DWORD(r);
		this.GlobalSequenceId = new DWORD(r);
		for (let i = 0; i < this.NrOfTracks.value; i++) {
			this.traks.push(new InterpolationTrack(this));
		}
	}

	/**
	 * 0 - None
	 * 1 - Linear
	 * 2 - Hermite
	 * 3 - Bezier
	 * @type {DWORD}
	 */
	type;

	/** @type InterpolationTrack[] */ traks = [];

	write() {
		this.key.write();
		this.NrOfTracks.writeValue(this.traks.length);
		this.type.write();
		this.GlobalSequenceId.write();
		for (const s of this.traks) {
			s.write();
		}
	}
}

class InterpolationTrack {
	/** @param {Interpolation} parent */
	constructor(parent) {
		const r = parent.key.reader;
		this.time = new DWORD(r);
		this.scaling = new parent.child(r, parent.length);
		if (parent.type.value > 1) {
			this.InTan = new parent.child(r, parent.length);
			this.OutTan = new parent.child(r, parent.length);
		}
	}

	write() {
		this.time.write();
		this.scaling.write();
		this.InTan?.write();
		this.OutTan?.write();
	}
}
