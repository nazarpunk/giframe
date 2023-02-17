/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {Interpolation} from "../model/Interpolation.mjs";
import {BYTE} from "../type/BYTE.mjs";

export class ParticleEmitter2 {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.Speed = new FLOAT(reader);
		this.Variation = new FLOAT(reader);
		this.Latitude = new FLOAT(reader);
		this.Gravity = new FLOAT(reader);
		this.Lifespan = new FLOAT(reader);
		this.EmissionRate = new FLOAT(reader);
		this.Length = new FLOAT(reader);
		this.Width = new FLOAT(reader);
		this.FilterMode = new DWORD(reader);
		this.Rows = new DWORD(reader);
		this.Columns = new DWORD(reader);
		this.HeadOrTail = new DWORD(reader);
		this.TailLength = new FLOAT(reader);
		this.Time = new FLOAT(reader);
		this.SegmentColor = new FLOAT(reader, 9);
		this.SegmentAlpha = new BYTE(reader, 3);
		this.SegmentScaling = new FLOAT(reader, 3);
		this.HeadIntervalStart = new DWORD(reader);
		this.HeadIntervalEnd = new DWORD(reader);
		this.HeadIntervalRepeat = new DWORD(reader);
		this.HeadDecayIntervalStart = new DWORD(reader);
		this.HeadDecayIntervalEnd = new DWORD(reader);
		this.HeadDecayIntervalRepeat = new DWORD(reader);
		this.TailIntervalStart = new DWORD(reader);
		this.TailIntervalEnd = new DWORD(reader);
		this.TailIntervalRepeat = new DWORD(reader);
		this.TailDecayIntervalStart = new DWORD(reader);
		this.TailDecayIntervalEnd = new DWORD(reader);
		this.TailDecayIntervalRepeat = new DWORD(reader);
		this.TextureId = new DWORD(reader);
		this.Squirt = new DWORD(reader);
		this.PriorityPlane = new DWORD(reader);
		this.ReplaceableId = new DWORD(reader);
		this.visibility = Interpolation.fromKey(reader, 'KP2V', FLOAT);
		this.EmissionRateStruct = Interpolation.fromKey(reader, 'KP2E', FLOAT);
		this.width = Interpolation.fromKey(reader, 'KP2W', FLOAT);
		this.LengthStruct = Interpolation.fromKey(reader, 'KP2N', FLOAT);
		this.SpeedStruct = Interpolation.fromKey(reader, 'KP2S', FLOAT);
		this.inclusiveSize.check();
	}

	/**
	 * 0 - Blend
	 * 1 - Additive
	 * 2 - Modulate
	 * 3 - Modulate2x
	 * 4 - AlphaKey
	 * @type {DWORD}
	 */
	FilterMode;

	/**
	 * 0 - Head
	 * 1 - Tail
	 * 2 - Both
	 * @type {DWORD}
	 */
	HeadOrTail;

	/**
	 * 0 - No Squirt
	 * 1 - Squirt
	 */
	Squirt;

	write() {
		this.inclusiveSize.save();
		this.node.write();
		this.Speed.write();
		this.Variation.write();
		this.Latitude.write();
		this.Gravity.write();
		this.Lifespan.write();
		this.EmissionRate.write();
		this.Length.write();
		this.Width.write();
		this.FilterMode.write();
		this.Rows.write();
		this.Columns.write();
		this.HeadOrTail.write();
		this.TailLength.write();
		this.Time.write();
		this.SegmentColor.write();
		this.SegmentAlpha.write();
		this.SegmentScaling.write();
		this.HeadIntervalStart.write();
		this.HeadIntervalEnd.write();
		this.HeadIntervalRepeat.write();
		this.HeadDecayIntervalStart.write();
		this.HeadDecayIntervalEnd.write();
		this.HeadDecayIntervalRepeat.write();
		this.TailIntervalStart.write();
		this.TailIntervalEnd.write();
		this.TailIntervalRepeat.write();
		this.TailDecayIntervalStart.write();
		this.TailDecayIntervalEnd.write();
		this.TailDecayIntervalRepeat.write();
		this.TextureId.write();
		this.Squirt.write();
		this.PriorityPlane.write();
		this.ReplaceableId.write();
		this.visibility?.write();
		this.EmissionRateStruct?.write();
		this.width?.write();
		this.LengthStruct?.write();
		this.SpeedStruct?.write();
		this.inclusiveSize.write();
	}
}
