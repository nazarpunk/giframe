/** @module MDX */
import {Parser} from "../parser/Parser.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {Char} from "../parser/Char.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";
import {Float32, Float32List} from "../parser/Float.mjs";

export class Camera {
	/** @type {Reader} reader */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.name = this.parser.add(new Char(80));
		this.position = this.parser.add(new Float32List(3));
		this.fieldOfView = this.parser.add(new Uint32());
		this.farClippingPlane = this.parser.add(new Uint32());
		this.nearClippingPlane = this.parser.add(new Uint32());
		this.targetPosition = this.parser.add(new Float32List(3));
		this.translation = this.parser.add(new Interpolation(0x5254434b/*KCTR*/, Float32List, 3));
		this.targetTranslation = this.parser.add(new Interpolation(0x5254544b/*KTTR*/, Float32List, 3));
		this.rotation = this.parser.add(new Interpolation(0x4c52434b/*KCRL*/, Float32));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			name: this.name,
			position: this.position,
			fieldOfView: this.fieldOfView,
			farClippingPlane: this.farClippingPlane,
			nearClippingPlane: this.nearClippingPlane,
			targetPosition: this.targetPosition,
			translation: this.translation,
			targetTranslation: this.targetTranslation,
			rotation: this.rotation,
		}
	}
}