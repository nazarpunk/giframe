/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";

export class Layer {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.filterMode = new DWORD(reader);
		this.shadingFlags = new DWORD(reader);
		this.textureId = new DWORD(reader);
		this.TextureAnimationId = new DWORD(reader);
		this.CoordId = new DWORD(reader);
		this.alpha = new FLOAT(reader);
		if (reader.version > 800) {
			this.emissiveGain = new FLOAT(reader);
			this.fresnelColor = new FLOAT(reader, 3);
			this.fresnelOpacity = new FLOAT(reader);
			this.fresnelTeamColor = new FLOAT(reader);
		}
		this.MaterialTextureId = Interpolation.fromKey(reader, 'KMTF', DWORD);
		this.materialAlpha = Interpolation.fromKey(reader, 'KMTA', FLOAT);
		if (reader.version > 800) {
			this.emissiveGainTrack = Interpolation.fromKey(reader, 'KMTE', FLOAT);
		}
		if (reader.version > 900) {
			this.fresnelColorTrack = Interpolation.fromKey(reader, 'KFC3', FLOAT, 3);
			this.fresnelAlphaTrack = Interpolation.fromKey(reader, 'KFCA', FLOAT);
			this.fresnelTeamColorTrack = Interpolation.fromKey(reader, 'KFTC', FLOAT);
		}
		this.inclusiveSize.check();
	}

	write() {
		this.inclusiveSize.save();
		this.filterMode.write();
		this.shadingFlags.write();
		this.textureId.write();
		this.TextureAnimationId.write();
		this.CoordId.write();
		this.alpha.write();
		this.emissiveGain?.write();
		this.fresnelColor?.write();
		this.fresnelOpacity?.write();
		this.fresnelTeamColor?.write();
		this.MaterialTextureId?.write();
		this.materialAlpha?.write();
		this.emissiveGainTrack?.write();
		this.fresnelColorTrack?.write();
		this.fresnelAlphaTrack?.write();
		this.fresnelTeamColorTrack?.write();
		this.inclusiveSize.write();
	}
}