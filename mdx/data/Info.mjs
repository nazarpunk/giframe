/** @module MDX */
import {Parser} from "../parser/Parser.mjs";
import {Key} from "../parser/Key.mjs";
import {Char} from "../parser/Char.mjs";
import {Uint32} from "../parser/Uint.mjs";

export class Info {
	/** @type {Reader} */ reader;

	/**
	 * @constant
	 * @type {number}
	 */
	static id = 0x4f464e49; // INFO

	read() {
		this.parser = new Parser(this.reader);
		this.key = this.parser.add(new Key(Info.id));
		this.size = this.parser.add(Uint32);
		this.parser.read();

		this.info = new Char(this.size.value);
		this.info.reader = this.reader;
		this.info.read();
	}

	write() {
		this.parser.write();
		this.info.write();
	}

	toJSON() {
		return {
			key: this.key,
			chunkSize: this.size,
			info: this.info,
		}
	}
}