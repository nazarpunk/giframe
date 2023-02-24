/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {Parser} from "../parser/Parser.mjs";
import {Float32} from "../parser/Float.mjs";
import {Char} from "../parser/Char.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";

export class ParticleEmitter {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.node = this.parser.add(NodeData);
		this.emissionRate = this.parser.add(Float32);
		this.gravity = this.parser.add(Float32);
		this.longitude = this.parser.add(Float32);
		this.latitude = this.parser.add(Float32);
		this.spawnModelFileName = this.parser.add(new Char(260));
		this.lifeSpan = this.parser.add(Float32);
		this.initialVelocity = this.parser.add(Float32);
		this.visibilityTrack = this.parser.add(new Interpolation(0x5645504b/*KPEV*/, Float32));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			node: this.node,
			emissionRate: this.emissionRate,
			gravity: this.gravity,
			longitude: this.longitude,
			latitude: this.latitude,
			spawnModelFileName: this.spawnModelFileName,
			lifeSpan: this.lifeSpan,
			initialVelocity: this.initialVelocity,
			visibilityTrack: this.visibilityTrack,
		}
	}
}
