import {Format} from "./data/Format.mjs";
import {Version} from "./data/Version.mjs";
import {Model} from "./data/Model.mjs";
import {Sequences} from "./data/Sequences.mjs";
import {Textures} from "./data/Textures.mjs";
import {TextureAnimations} from "./data/TextureAnimations.mjs";
import {Materials} from "./data/Materials.mjs";
import {Geosets} from "./data/Geosets.mjs";
import {Bones} from "./data/Bones.mjs";
import {PivotPoints} from "./data/PivotPoints.mjs";
import {Reader} from "./type/Reader.mjs";
import {KEY} from "./type/KEY.mjs";
import {GlobalSequences} from "./data/GlobalSequences.mjs";

export class MDX {

	/**
	 * @param {ArrayBuffer} buffer
	 */
	constructor(buffer) {
		this.reader = new Reader(buffer);

		this.dataView = new DataView(buffer);

		while (this.reader.byteOffset < this.dataView.byteLength) {
			const key = new KEY(this.reader);
			console.log('key', key.name);
			switch (key.name) {
				case 'MDLX':
					this.format = new Format(key);
					break;
				case 'VERS':
					this.version = new Version(key);
					break;
				case 'MODL':
					this.model = new Model(key);
					break;
				case 'SEQS':
					this.sequences = new Sequences(key);
					break;
				case 'GLBS':
					this.globalSequences = new GlobalSequences(key);
					break;
				case 'MTLS':
					this.materials = new Materials(key);
					break;
				case 'TEXS':
					this.textures = new Textures(key);
					break;
				case 'TXAN':
					this.textureAnimations = new TextureAnimations(key);
					break;
				case 'GEOS':
					this.geosets = new Geosets(key);
					break;
				case 'BONE':
					this.bones = new Bones(key);
					break;
				case 'PIVT':
					this.pivotPoints = new PivotPoints(key);
					break;
				default:
					throw `MDX child wrong key : ${key.name}`;
			}
		}

		if (this.reader.byteOffset !== this.dataView.byteLength) {
			throw `MDX end offset ${this.reader.byteOffset} not equal length ${this.dataView.byteLength}`;
		}
	}

	/** @return {ArrayBuffer} */
	write() {
		this.format.write();
		this.version?.write();
		this.model?.write();
		this.sequences?.write();
		this.materials?.write();
		this.textures?.write();
		this.textureAnimations?.write();
		this.geosets?.write();
		this.bones?.write();
		this.pivotPoints?.write();

		return this.reader.output;
	}
}
