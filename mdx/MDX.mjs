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
import {Helper} from "./data/Helper.mjs";
import {Attachments} from "./data/Attachments.mjs";
import {ParticleEmitters2} from "./data/ParticleEmitters2.mjs";
import {RibbonEmitters} from "./data/RibbonEmitters.mjs";
import {EventObjects} from "./data/EventObjects.mjs";
import {CollisionShapes} from "./data/CollisionShapes.mjs";

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
				case 'HELP':
					this.helper = new Helper(key);
					break;
				case 'ATCH':
					this.attachments = new Attachments(key);
					break;
				case 'PIVT':
					this.pivotPoints = new PivotPoints(key);
					break;
				case 'PRE2':
					this.particleEmitters2 = new ParticleEmitters2(key);
					break;
				case 'RIBB':
					this.ribbinEmitters = new RibbonEmitters(key);
					break;
				case 'EVTS':
					this.eventObjects = new EventObjects(key);
					break;
				case 'CLID':
					this.collisionShapes = new CollisionShapes(key);
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
		this.globalSequences?.write();
		this.materials?.write();
		this.textures?.write();
		this.textureAnimations?.write();
		this.geosets?.write();
		this.bones?.write();
		this.helper?.write();
		this.attachments?.write();
		this.pivotPoints?.write();
		this.particleEmitters2?.write();
		this.ribbinEmitters?.write();
		this.eventObjects?.write();
		this.collisionShapes?.write();
		return this.reader.output;
	}
}
