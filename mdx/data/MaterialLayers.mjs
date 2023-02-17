import {DWORD} from "../type/DWORD.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {KEY} from "../type/KEY.mjs";
import {Alpha} from "./Alpha.mjs";

export class MaterialLayers {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.NrOfLayers = new DWORD(r);
		for (let i = 0; i < this.NrOfLayers.value; i++) {
			this.layers.push(new MaterialLayer(r));
		}
	}

	/** @type {MaterialLayer[]} */ layers = [];

	write() {
		this.key.write();
		this.NrOfLayers.writeValue(this.layers.length);
		for (const l of this.layers) {
			l.write();
		}
	}
}

class MaterialLayer {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.FilterMode = new DWORD(reader);
		this.ShadingFlags = new DWORD(reader);
		this.TextureId = new DWORD(reader);
		this.TextureAnimationId = new DWORD(reader);
		this.CoordId = new DWORD(reader);
		this.alpha = new FLOAT(reader);
		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KMTA':
					this.materialAlpha = new Alpha(key);
					break;
				default:
					throw `MaterialLayer key error: ${key.name}`;
			}

		}
		this.inclusiveSize.check();
	}

	/**
	 * 0 - None
	 * 1 - Transparent
	 * 2 - Blend
	 * 3 - Additive
	 * 4 - AddAlpha
	 * 5 - Modulate
	 * 6 - Modulate2x
	 * @type {DWORD}
	 */
	FilterMode;

	/**
	 * 1   - Unshaded
	 * 2   - SphereEnvironmentMap
	 * 4   - ???
	 * 8   - ???
	 * 16  - TwoSided
	 * 32  - Unfogged
	 * 64  - NoDepthTest
	 * 128 - NoDepthSet
	 * @type {DWORD}
	 */
	ShadingFlags;

	write() {
		this.inclusiveSize.save();
		this.FilterMode.write();
		this.ShadingFlags.write();
		this.TextureId.write();
		this.TextureAnimationId.write();
		this.CoordId.write();
		this.alpha.write();
		this.materialAlpha?.write();
		this.inclusiveSize.write();
	}
}