/** @module MDX */

import {StructSizeOld} from "../type/StructSizeOld.mjs";
import {NodeData} from "./NodeData.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {InterpolationOld} from "../parser/InterpolationOld.mjs";
import {BYTE} from "../type/BYTE.mjs";

export class ParticleEmitter2 {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSizeOld(reader, {inclusive: true});
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

		while (reader.byteOffset < this.inclusiveSize.end) {
			this.speedTrack ??= InterpolationOld.fromKey(reader, 'KP2S', FLOAT);
			this.variationTrack ??= InterpolationOld.fromKey(reader, 'KP2R', FLOAT);
			this.latitudeTrack ??= InterpolationOld.fromKey(reader, 'KP2L', FLOAT);
			this.gravityTrack ??= InterpolationOld.fromKey(reader, 'KP2G', FLOAT);
			this.emissionRateTrack ??= InterpolationOld.fromKey(reader, 'KP2E', FLOAT);
			this.lengthTrack ??= InterpolationOld.fromKey(reader, 'KP2N', FLOAT);
			this.widthTrack ??= InterpolationOld.fromKey(reader, 'KP2W', FLOAT);
			this.visibilityTrack ??= InterpolationOld.fromKey(reader, 'KP2V', FLOAT);
		}
		this.inclusiveSize.check();
	}

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
		this.speedTrack?.write();
		this.variationTrack?.write();
		this.latitudeTrack?.write();
		this.gravityTrack?.write();
		this.emissionRateTrack?.write();
		this.lengthTrack?.write();
		this.widthTrack?.write();
		this.visibilityTrack?.write();
		this.inclusiveSize.write();
	}
}
