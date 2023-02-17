/** @module MDX */
import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {KEY} from "../type/KEY.mjs";
import {Interpolation} from "../model/Interpolation.mjs";

export class Light {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.Type = new DWORD(reader);
		this.AttenuationStart = new DWORD(reader);
		this.AttenuationEnd = new DWORD(reader);
		this.color = new FLOAT(reader, 3);
		this.Intensity = new FLOAT(reader);
		this.AmbientColor = new FLOAT(reader, 3);
		this.AmbientIntensity = new FLOAT(reader);
		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KLAV':
					this.Visibility = new Interpolation(key, FLOAT);
					break;
				case 'KLAC':
					this.colorStruct = new Interpolation(key, FLOAT, 3);
					break;
				case 'KLAI':
					this.IntensityStruct = new Interpolation(key, FLOAT);
					break;
				case 'KLBC':
					this.AmbientColorStruct = new Interpolation(key, FLOAT, 3);
					break;
				case 'KLBI':
					this.AmbientIntensityStruct = new Interpolation(key, FLOAT);
					break;
				default:
					throw new Error(`Camera wrong key: ${key.name}`);
			}
		}
		this.inclusiveSize.check();
	}

	/**
	 * 0 - Omnidirectional
	 * 1 - Directional
	 * 2 - Ambient
	 * @type {DWORD}
	 */
	Type;

	write() {
		this.inclusiveSize.save();
		this.node.write();
		this.Type.write();
		this.AttenuationStart.write();
		this.AttenuationEnd.write();
		this.color.write();
		this.Intensity.write();
		this.AmbientColor.write();
		this.AmbientIntensity.write();
		this.Visibility?.write();
		this.colorStruct?.write();
		this.IntensityStruct?.write();
		this.AmbientColorStruct?.write();
		this.AmbientIntensityStruct?.write();
		this.inclusiveSize.write();
	}
}