/** @module MDX */
import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {KEY} from "../type/KEY.mjs";
import {Alpha} from "./Alpha.mjs";
import {Translations} from "./Translations.mjs";

export class Light {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.Type = new DWORD(reader);
		this.AttenuationStart = new DWORD(reader);
		this.AttenuationEnd = new DWORD(reader);
		this.color = new VECTOR(reader, 3);
		this.Intensity = new FLOAT(reader);
		this.AmbientColor = new VECTOR(reader, 3);
		this.AmbientIntensity = new FLOAT(reader);
		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KLAV':
					this.Visibility = new Alpha(key);
					break;
				case 'KLAC':
					this.colorStruct = new Translations(key);
					break;
				case 'KLAI':
					this.IntensityStruct = new Alpha(key);
					break;
				case 'KLBC':
					this.AmbientColorStruct = new Translations(key);
					break;
				case 'KLBI':
					this.AmbientIntensityStruct = new Alpha(key);
					break;
				default:
					throw `Camera wrong key: ${key.name}`;
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