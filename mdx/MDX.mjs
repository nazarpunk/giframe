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
import {ChunkedList} from "./model/ChunkedList.js";
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
					this.sequences = new ChunkedList(key, Sequence);
					break;
				case 'GLBS':
					this.globalSequences = new ChunkedList(key, DWORD);
					break;
				case 'LITE':
					this.lights = new ChunkedList(key, Light);
					break;
				case 'MTLS':
					this.materials = new ChunkedList(key, Material);
					break;
				case 'TEXS':
					this.textures = new ChunkedList(key, Texture);
					break;
				case 'TXAN':
					this.textureAnimations = new ChunkedList(key, TextureAnimation);
					break;
				case 'GEOS':
					this.geosets = new ChunkedList(key, Geoset);
					break;
				case 'GEOA':
					this.geosetAnimations = new ChunkedList(key, GeosetAnimation);
					break;
				case 'BONE':
					this.bones = new ChunkedList(key, Bone);
					break;
				case 'HELP':
					this.helper = new ChunkedList(key, NodeData);
					break;
				case 'ATCH':
					this.attachments = new ChunkedList(key, Attachment);
					break;
				case 'PIVT':
					this.pivotPoints = new ChunkedList(key, PivotPoint);
					break;
				case 'PREM':
					this.particleEmitters = new ChunkedList(key, ParticleEmitter);
					break;
				case 'PRE2':
					this.particleEmitters2 = new ChunkedList(key, ParticleEmitter2);
					break;
				case 'CAMS':
					this.cameras = new ChunkedList(key, Camera);
					break;
				case 'RIBB':
					this.ribbinEmitters = new ChunkedList(key, RibbonEmitter);
					break;
				case 'EVTS':
					this.eventObjects = new ChunkedList(key, EventObject);
					break;
				case 'CLID':
					this.collisionShapes = new ChunkedList(key, CollisionShape);
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
