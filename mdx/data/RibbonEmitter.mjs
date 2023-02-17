/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";
import {Interpolation} from "../model/Interpolation.mjs";

export class RibbonEmitter {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.HeightAbove = new FLOAT(reader);
		this.HeightBelow = new FLOAT(reader);
		this.alpha = new FLOAT(reader);
		this.Color = new FLOAT(reader, 3);
		this.LifeSpan = new FLOAT(reader);
		this.TextureSlot = new DWORD(reader);
		this.EmissionRate = new DWORD(reader);
		this.Rows = new DWORD(reader);
		this.Columns = new DWORD(reader);
		this.MaterialId = new DWORD(reader);
		this.Gravity = new FLOAT(reader);

		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KRVS':
					this.Visibility = new Interpolation(key, FLOAT);
					break;
				case 'KRHA':
					this.HeightAboveStruct = new Interpolation(key, FLOAT);
					break;
				case 'KRHB':
					this.HeightBelowStruct = new Interpolation(key, FLOAT);
					break;
				default:
					throw new Error(`RibbonEmitter wrong key: ${key.name}`);
			}
		}
		this.inclusiveSize.check();
	}

	write() {
		this.inclusiveSize.save();
		this.node.write();
		this.HeightAbove.write();
		this.HeightBelow.write();
		this.alpha.write();
		this.Color.write();
		this.LifeSpan.write();
		this.TextureSlot.write();
		this.EmissionRate.write();
		this.Rows.write();
		this.Columns.write();
		this.MaterialId.write();
		this.Gravity.write();
		this.Visibility?.write();
		this.HeightAboveStruct?.write();
		this.HeightBelowStruct?.write();
		this.inclusiveSize.write();
	}
}