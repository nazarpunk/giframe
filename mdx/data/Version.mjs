/** @module MDX */
import {Parser} from "../parser/Parser.mjs";
import {Key} from "../type/KEY.mjs";
import {ChunkSize} from "../parser/ChunkSize.mjs";
import {Uint32} from "../parser/Uint32.mjs";

export class Version {
	static id = 0x53524556; // VERS

	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);
		this.key = this.parser.add(new Key(Version.id));
		this.chunkSize = this.parser.add(ChunkSize);
		this.version = this.parser.add(Uint32);
		this.parser.read();
	}

	toJSON() {
		return {
			key: this.key,
			chunkSize: this.chunkSize,
			version: this.version,
		}
	}
}
