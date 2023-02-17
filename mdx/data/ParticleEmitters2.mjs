import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";
import {KEY} from "../type/KEY.mjs";
import {Alpha} from "./Alpha.mjs";

//TODO chunk container
export class ParticleEmitters2 {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.chunkSize.end) {
			this.emmiters.push(new ParticleEmitter2(r));
		}
		this.chunkSize.check();
	}

	/** @type {ParticleEmitter2[]} */ emmiters = [];

	write() {
		this.key.write();
		this.chunkSize.save();
		for (const e of this.emmiters) {
			e.write();
		}
		this.chunkSize.write();
	}
}

class ParticleEmitter2 {
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
		this.SegmentColor = new VECTOR(reader, 9);
		this.SegmentAlpha = new VECTOR(reader, 3, {byte: true});
		this.SegmentScaling = new VECTOR(reader, 3);
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
			const key = new KEY(reader);
			switch (key.name) {
				case 'KP2V':
					this.visibility = new Alpha(key);
					break;
				case 'KP2E':
					this.EmissionRateStruct = new Alpha(key);
					break;
				case 'KP2W':
					this.width = new Alpha(key);
					break;
				case 'KP2N':
					this.LengthStruct = new Alpha(key);
					break;
				case 'KP2S':
					this.SpeedStruct = new Alpha(key);
					break;
				default:
					throw `ParticleEmitter2 wrong key: ${key.name}`;
			}
		}

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
