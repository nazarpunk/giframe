/** @module MDX */
import {StructSizeOld} from "../type/StructSizeOld.mjs";
import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {InterpolationOld} from "../parser/InterpolationOld.mjs";

export class Light {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSizeOld(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.Type = new DWORD(reader);
		this.AttenuationStart = new DWORD(reader);
		this.AttenuationEnd = new DWORD(reader);
		this.color = new FLOAT(reader, 3);
		this.Intensity = new FLOAT(reader);
		this.AmbientColor = new FLOAT(reader, 3);
		this.AmbientIntensity = new FLOAT(reader);
		this.Visibility = InterpolationOld.fromKey(reader, 'KLAV', FLOAT);
		this.colorStruct = InterpolationOld.fromKey(reader, 'KLAC', FLOAT, 3);
		this.IntensityStruct = InterpolationOld.fromKey(reader, 'KLAI', FLOAT);
		this.AmbientColorStruct = InterpolationOld.fromKey(reader, 'KLBC', FLOAT, 3);
		this.AmbientIntensityStruct = InterpolationOld.fromKey(reader, 'KLBI', FLOAT);
		this.inclusiveSize.check();
	}

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