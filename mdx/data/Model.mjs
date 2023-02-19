/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {Key} from "../type/KEY.mjs";
import {ChunkSize} from "../parser/ChunkSize.mjs";
import {Char} from "../parser/Char.mjs";

export class Model {
	static key = 0x4c444f4d; // MODL

	/** @param {Reader} reader */
	constructor(reader) {
		this.reader = reader;
	}

	read() {
		this.parser = new Parser(this.reader);
		this.key = this.parser.add(new Key(Model.key));
		this.chunkSize = this.parser.add(ChunkSize);
		this.name = this.parser.add(new Char(80));
		this.animationFileName = this.parser.add(new Char(260));
		//this.BoundsRadius = new FLOAT(r);
		//this.MinimumExtent = new FLOAT(r, 3);
		//this.MaximumExtent = new FLOAT(r, 3);
		//this.BlendTime = new DWORD(r);
		this.parser.read();
	}

	write() {
		this.parser.write();
	}

	toJSON() {
		return {
			key: this.key,
			chunkSize: this.chunkSize,
			name: this.name,
		}
	}
}
