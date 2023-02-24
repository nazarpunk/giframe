/** @module MDX */
import {Parser} from "../parser/Parser.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {Float32, Float32List} from "../parser/Float.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Char} from "../parser/Char.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";

export class CornEmmiter {
	/** @type {Reader} reader */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.node = this.parser.add(NodeData);
		this.lifeSpan = this.parser.add(Float32);
		this.emissionRate = this.parser.add(Float32);
		this.speed = this.parser.add(Float32);
		this.color = this.parser.add(new Float32List(4));
		this.replaceableId = this.parser.add(Uint32);
		this.path = this.parser.add(new Char(260));
		this.flags = this.parser.add(new Char(260));
		this.alphaTrack = this.parser.add(new Interpolation(0x4150504b/*KPPA*/, Float32));
		this.colorTrack = this.parser.add(new Interpolation(0x4350504b/*KPPC*/, Float32List, 3));
		this.emissionRateTrack = this.parser.add(new Interpolation(0x4550504b/*KPPE*/, Float32));
		this.lifespanTrack = this.parser.add(new Interpolation(0x4c50504b/*KPPL*/, Float32));
		this.speedTrack = this.parser.add(new Interpolation(0x5350504b/*KPPS*/, Float32));
		this.visibilityTrack = this.parser.add(new Interpolation(0x5650504b/*KPPV*/, Float32));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			node: this.node,
			lifeSpan: this.lifeSpan,
			emissionRate: this.emissionRate,
			speed: this.speed,
			color: this.color,
			replaceableId: this.replaceableId,
			path: this.path,
			flags: this.flags,
			alphaTrack: this.alphaTrack,
			colorTrack: this.colorTrack,
			emissionRateTrack: this.emissionRateTrack,
			lifespanTrack: this.lifespanTrack,
			speedTrack: this.speedTrack,
			visibilityTrack: this.visibilityTrack,
		}
	}
}
