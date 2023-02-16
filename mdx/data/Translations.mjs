import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";

export class Translations {
	/** @param {DWORD} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.NrOfTracks = new DWORD(r);
		this.InterpolationType = new DWORD(r);
		this.GlobalSequenceId = new DWORD(r);
		for (let i = 0; i < this.NrOfTracks.value; i++) {
			this.translations.push(new Translation(this));
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

	/** @type Translation[] */
	translations = [];

	write() {
		this.key.write();
		this.NrOfTracks.writeValue(this.translations.length);
		this.InterpolationType.write();
		this.GlobalSequenceId.write();
		for (const t of this.translations) {
			t.write();
		}
	}
}

class Translation {
	/**
	 * @param {Translations} parent
	 */
	constructor(parent) {
		const r = parent.key.reader;
		this.time = new DWORD(r);
		this.translation = new VECTOR(r, 3);
		if (parent.InterpolationType.value > 1) {
			this.InTan = new VECTOR(r, 3);
			this.OutTan = new VECTOR(r, 3);
		}
	}

	write() {
		this.time.write();
		this.translation.write();
		this.InTan?.write();
		this.OutTan?.write();
	}
}
