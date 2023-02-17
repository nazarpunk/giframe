/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class Sequence {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.Name = new CHAR(reader, 80);
		this.IntervalStart = new DWORD(reader);
		this.IntervalEnd = new DWORD(reader);
		this.MoveSpeed = new FLOAT(reader);
		this.Flags = new DWORD(reader);
		this.Rarity = new FLOAT(reader);
		this.SyncPoint = new DWORD(reader);
		this.BoundsRadius = new FLOAT(reader);
		this.MinimumExtent = new FLOAT(reader, 3);
		this.MaximumExtent = new FLOAT(reader, 3);
	}

	/**
	 * 0 - Looping
	 * 1 - NonLooping
	 * @type {DWORD}
	 */
	Flags;

	write() {
		this.Name.write();
		this.IntervalStart.write();
		this.IntervalEnd.write();
		this.MoveSpeed.write();
		this.Flags.write();
		this.Rarity.write();
		this.SyncPoint.write();
		this.BoundsRadius.write();
		this.MinimumExtent.write();
		this.MaximumExtent.write();
	}
}