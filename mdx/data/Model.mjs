/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {Key} from "../type/KEY.mjs";
import {ChunkSize} from "../parser/ChunkSize.mjs";
import {Char} from "../parser/Char.mjs";
import {Float32} from "../parser/Float32.mjs";
import {Float32List} from "../parser/Float32List.mjs";
import {Uint32} from "../parser/Uint32.mjs";

export class Model {
	static id = 0x4c444f4d; // MODL

	/** @type {Reader} reader */ reader;

	read() {
		this.parser = new Parser(this.reader);
		this.key = this.parser.add(new Key(Model.id));
		this.chunkSize = this.parser.add(ChunkSize);
		this.name = this.parser.add(new Char(80));
		this.animationFileName = this.parser.add(new Char(260));
		this.boundsRadius = this.parser.add(Float32);
		this.minimumExtent = this.parser.add(new Float32List(3));
		this.maximumExtent = this.parser.add(new Float32List(3));
		this.blendTime = this.parser.add(Uint32);
		this.parser.read();
	}

	toJSON() {
		return {
			key: this.key,
			chunkSize: this.chunkSize,
			name: this.name,
			animationFileName: this.animationFileName,
			boundsRadius: this.boundsRadius,
			minimumExtent: this.minimumExtent,
			maximumExtent: this.maximumExtent,
			blendTime: this.blendTime,
		}
	}
}
