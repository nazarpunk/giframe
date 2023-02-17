/** @module MDX */

import {Format} from "./data/Format.mjs";
import {Version} from "./data/Version.mjs";
import {Model} from "./data/Model.mjs";
import {Sequence} from "./data/Sequence.mjs";
import {Geoset} from "./data/Geoset.mjs";
import {PivotPoint} from "./data/PivotPoint.mjs";
import {Reader} from "./type/Reader.mjs";
import {KEY} from "./type/KEY.mjs";
import {Attachment} from "./data/Attachment.mjs";
import {RibbonEmitter} from "./data/RibbonEmitter.mjs";
import {EventObject} from "./data/EventObject.mjs";
import {GeosetAnimation} from "./data/GeosetAnimation.mjs";
import {CountedList} from "./model/CountedList.js";
import {NodeData} from "./data/NodeData.mjs";
import {Bone} from "./data/Bone.mjs";
import {CollisionShape} from "./data/CollisionShape.mjs";
import {DWORD} from "./type/DWORD.mjs";
import {Material} from "./data/Material.mjs";
import {Texture} from "./data/Texture.mjs";
import {TextureAnimation} from "./data/TextureAnimation.mjs";
import {ParticleEmitter2} from "./data/ParticleEmitter2.mjs";
import {ParticleEmitter} from "./data/ParticleEmitter.mjs";
import {Camera} from "./data/Camera.mjs";
import {Light} from "./data/Light.mjs";

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
					this.sequences = new CountedList(key, Sequence, {chunk: true});
					break;
				case 'GLBS':
					this.globalSequences = new CountedList(key, DWORD, {chunk: true});
					break;
				case 'LITE':
					this.lights = new CountedList(key, Light, {chunk: true});
					break;
				case 'MTLS':
					this.materials = new CountedList(key, Material, {chunk: true});
					break;
				case 'TEXS':
					this.textures = new CountedList(key, Texture, {chunk: true});
					break;
				case 'TXAN':
					this.textureAnimations = new CountedList(key, TextureAnimation, {chunk: true});
					break;
				case 'GEOS':
					this.geosets = new CountedList(key, Geoset, {chunk: true});
					break;
				case 'GEOA':
					this.geosetAnimations = new CountedList(key, GeosetAnimation, {chunk: true});
					break;
				case 'BONE':
					this.bones = new CountedList(key, Bone, {chunk: true});
					break;
				case 'HELP':
					this.helper = new CountedList(key, NodeData, {chunk: true});
					break;
				case 'ATCH':
					this.attachments = new CountedList(key, Attachment, {chunk: true});
					break;
				case 'PIVT':
					this.pivotPoints = new CountedList(key, PivotPoint, {chunk: true});
					break;
				case 'PREM':
					this.particleEmitters = new CountedList(key, ParticleEmitter, {chunk: true});
					break;
				case 'PRE2':
					this.particleEmitters2 = new CountedList(key, ParticleEmitter2, {chunk: true});
					break;
				case 'CAMS':
					this.cameras = new CountedList(key, Camera, {chunk: true});
					break;
				case 'RIBB':
					this.ribbinEmitters = new CountedList(key, RibbonEmitter, {chunk: true});
					break;
				case 'EVTS':
					this.eventObjects = new CountedList(key, EventObject, {chunk: true});
					break;
				case 'CLID':
					this.collisionShapes = new CountedList(key, CollisionShape, {chunk: true});
					break;
				default:
					throw new Error(`MDX child wrong key : ${key.name}`);
			}
		}

		if (this.reader.byteOffset !== this.dataView.byteLength) {
			throw new Error(`MDX end offset ${this.reader.byteOffset} not equal length ${this.dataView.byteLength}`);
		}
	}

	/** @return {ArrayBuffer} */
	write() {
		this.format?.write();
		this.version?.write();
		this.model?.write();
		this.sequences?.write();
		this.globalSequences?.write();
		this.lights?.write();
		this.materials?.write();
		this.textures?.write();
		this.textureAnimations?.write();
		this.geosets?.write();
		this.geosetAnimations?.write();
		this.bones?.write();
		this.helper?.write();
		this.attachments?.write();
		this.pivotPoints?.write();
		this.particleEmitters?.write();
		this.particleEmitters2?.write();
		this.cameras?.write();
		this.ribbinEmitters?.write();
		this.eventObjects?.write();
		this.collisionShapes?.write();
		return this.reader.output;
	}
}
