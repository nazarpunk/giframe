/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {Interpolation} from "../model/Interpolation.mjs";

export class Layer {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.FilterMode = new DWORD(reader);
		this.ShadingFlags = new DWORD(reader);
		this.TextureId = new DWORD(reader);
		this.TextureAnimationId = new DWORD(reader);
		this.CoordId = new DWORD(reader);
		this.alpha = new FLOAT(reader);
		if (reader.version > 800) {
			this.emissiveGain = new FLOAT(reader);
			this.fresnelColor = new FLOAT(reader, 3);
			this.fresnelOpacity = new FLOAT(reader);
			this.fresnelTeamColor = new FLOAT(reader);
		}
		this.materialAlpha = Interpolation.fromKey(reader, 'KMTA', FLOAT);
		/*
	(KMTF)
    (KMTA)
    if (version > 800) {
        (KMTE)
    }
    if (version > 900) {
        (KFC3)
        (KFCA)
        (KFTC)
    }
		 */
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
		this.emissiveGain?.write();
		this.fresnelColor?.write();
		this.fresnelOpacity?.write();
		this.fresnelTeamColor?.write();
		this.materialAlpha?.write();
		this.inclusiveSize.write();
	}
}