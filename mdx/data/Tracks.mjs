import {KEY} from "../type/KEY.mjs";
import {DWORD} from "../type/DWORD.mjs";

export class Tracks {
	/** @param {Reader} reader */
	constructor(reader) {
		this.key = new KEY(reader, {name: 'KEVT'});
		this.NrOfTracks = new DWORD(reader);
		this.GlobalSequenceId = new DWORD(reader);
		for (let i = 0; i < this.NrOfTracks.value; i++) {
			this.times.push(new DWORD(reader));
		}
	}

	/** @type {DWORD[]} */
	times = [];

	write() {
		this.key.write();
		this.NrOfTracks.writeValue(this.times.length);
		this.GlobalSequenceId.write();
		for (const t of this.times) {
			t.write();
		}
	}
}