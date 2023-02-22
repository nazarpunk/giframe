/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {Parser} from "../parser/Parser.mjs";
import {Float32} from "../parser/Float32.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {Float32List} from "../parser/Float32List.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";

export class RibbonEmitter {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.node = this.parser.add(NodeData);
		this.heightAbove = this.parser.add(Float32);
		this.heightBelow = this.parser.add(Float32);
		this.alpha = this.parser.add(Float32);
		this.color = this.parser.add(new Float32List(3));
		this.lifeSpan = this.parser.add(Float32);
		this.textureSlot = this.parser.add(Uint32);
		this.emissionRate = this.parser.add(Uint32);
		this.rows = this.parser.add(Uint32);
		this.columns = this.parser.add(Uint32);
		this.materialId = this.parser.add(Uint32);
		this.gravity = this.parser.add(Float32);
		this.visibility = this.parser.add(new Interpolation(0x5356524b/*KRVS*/, Float32));
		this.heightAboveStruct = this.parser.add(new Interpolation(0x4148524b/*KRHA*/, Float32));
		this.heightBelowStruct = this.parser.add(new Interpolation(0x4248524b/*KRHB*/, Float32));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			node: this.node,
			heightAbove: this.heightAbove,
			heightBelow: this.heightBelow,
			alpha: this.alpha,
			color: this.color,
			lifeSpan: this.lifeSpan,
			textureSlot: this.textureSlot,
			emissionRate: this.emissionRate,
			rows: this.rows,
			columns: this.columns,
			materialId: this.materialId,
			gravity: this.gravity,
			visibility: this.visibility,
			heightAboveStruct: this.heightAboveStruct,
			heightBelowStruct: this.heightBelowStruct,
		}
	}
}