/** @module MDX */
import {NodeData} from "./NodeData.mjs";
import {Parser} from "../parser/Parser.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Float32} from "../parser/Float32.mjs";
import {Float32List} from "../parser/Float32List.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";

export class Light {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.node = this.parser.add(NodeData);
		this.type = this.parser.add(Uint32);
		this.attenuationStart = this.parser.add(Uint32);
		this.attenuationEnd = this.parser.add(Uint32);
		this.color = this.parser.add(new Float32List(3));
		this.intensity = this.parser.add(Float32);
		this.ambientColor = this.parser.add(new Float32List(3));
		this.ambientIntensity = this.parser.add(Float32);
		this.visibilityTrack = this.parser.add(new Interpolation(0x56414c4b/*KLAV*/, Float32));
		this.colorTrack = this.parser.add(new Interpolation(0x43414c4b/*KLAC*/, Float32List, 3));
		this.intensityTrack = this.parser.add(new Interpolation(0x49414c4b/*KLAI*/, Float32));
		this.ambientColorTrack = this.parser.add(new Interpolation(0x43424c4b/*KLBC*/, Float32List, 3));
		this.ambientIntensityTrack = this.parser.add(new Interpolation(0x49424c4b/*KLBI*/, Float32));

		this.parser.read();
	}


	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			node: this.node,
			type: this.type,
			attenuationStart: this.attenuationStart,
			attenuationEnd: this.attenuationEnd,
			color: this.color,
			intensity: this.intensity,
			ambientColor: this.ambientColor,
			ambientIntensity: this.ambientIntensity,
			visibilityTrack: this.visibilityTrack,
			colorTrack: this.colorTrack,
			intensityTrack: this.intensityTrack,
			ambientColorTrack: this.ambientColorTrack,
			ambientIntensityTrack: this.ambientIntensityTrack,
		}
	}
}