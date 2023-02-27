/** @module MDX */
import {Uint32} from "../parser/Uint.mjs";
import {Parser} from "../parser/Parser.mjs";

export class Version {

	/** @type {Vers} */ vers;

	/** @param {DataView} view */
	read(view) {
		this.parser = new Parser();

		this.version = this.parser.add(Uint32);

		this.parser.read(view);

		this.vers.version = this.version.value;
	}

	toJSON() {
		return {
			version: this.version,
		}
	}
}
