/** @module MDX */

import {Uint32} from "../parser/Uint.mjs";
import {Char} from "../parser/Char.mjs";
import {Parser} from "../parser/Parser.mjs";

export class Material {

	/** @type {MDX} */ mdx;

	/** @param {DataView} view */
	read(view) {
		this.parser = new Parser();

		this.priorityPlane = this.parser.add(Uint32);
		this.flags = this.parser.add(Uint32);

		if (this.mdx.vers > 800) {
			this.shader = this.parser.add(new Char(80));
		}

		//this.layers = this.parser.add(new CountList(0x5359414c/*LAYS*/, Layer));

		this.parser.read(view);

		console.log(this.shader);
	}

	toJSON() {
		return {
			priorityPlane: this.priorityPlane,
			flags: this.flags,
			shader: this.shader,
			layers: this.layers,
		}
	}
}