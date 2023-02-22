/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {Float32} from "../parser/Float32.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Float32List} from "../parser/Float32List.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";

export class GeosetAnimation {
	/** @type {Reader} reader */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.alpha = this.parser.add(Float32);
		this.flags = this.parser.add(Uint32);
		this.color = this.parser.add(new Float32List(3));
		this.geosetId = this.parser.add(Uint32);
		this.alphaTrack = this.parser.add(new Interpolation(0x4f41474b/*KGAO*/, Float32));
		this.colorTrack = this.parser.add(new Interpolation(0x4341474b/*KGAC*/, Float32List, 3));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			alpha: this.alpha,
			flags: this.flags,
			color: this.color,
			geosetId: this.geosetId,
			alphaTrack: this.alphaTrack,
			colorTrack: this.colorTrack,
		}
	}
}
