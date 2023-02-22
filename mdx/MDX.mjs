/** @module MDX */

import {Geoset} from "./data/Geoset.mjs";
import {PivotPoint} from "./data/PivotPoint.mjs";
import {Reader} from "./parser/Reader.mjs";
import {Attachment} from "./data/Attachment.mjs";
import {RibbonEmitter} from "./data/RibbonEmitter.mjs";
import {EventObject} from "./data/EventObject.mjs";
import {GeosetAnimation} from "./data/GeosetAnimation.mjs";
import {CountedListOld} from "./parser/CountedListOld.js";
import {NodeData} from "./data/NodeData.mjs";
import {Bone} from "./data/Bone.mjs";
import {CollisionShape} from "./data/CollisionShape.mjs";
import {Texture} from "./data/Texture.mjs";
import {TextureAnimation} from "./data/TextureAnimation.mjs";
import {ParticleEmitter2} from "./data/ParticleEmitter2.mjs";
import {ParticleEmitter} from "./data/ParticleEmitter.mjs";
import {Camera} from "./data/Camera.mjs";
import {Light} from "./data/Light.mjs";
import {Parser} from "./parser/Parser.mjs";
import {int2s, s2s} from "./type/hex.mjs";
import {Format} from "./data/Format.mjs";
import {Version} from "./data/Version.mjs";
import {Model} from "./data/Model.mjs";
import {ChunkList} from "./parser/ChunkList.mjs";
import {Sequence} from "./data/Sequence.mjs";
import {GlobalSequence} from "./data/GlobalSequence.mjs";
import {Material} from "./data/Material.mjs";
import {CornEmmiter} from "./data/CornEmmiter.mjs";
import {FaceEffect} from "./data/FaceEffect.mjs";

export class MDX {
	/**
	 * @param {ArrayBuffer} buffer
	 */
	constructor(buffer) {
		this.view = new DataView(buffer);
		this.reader = new Reader(buffer);
	}

	read() {
		this.parser = new Parser(this.reader);

		this.format = this.parser.add(Format);
		this.version = this.parser.add(Version);
		this.model = this.parser.add(Model);
		this.sequences = this.parser.add(new ChunkList(0x53514553/*SEQS*/, Sequence));
		this.globalSequences = this.parser.add(new ChunkList(0x53424c47/*GLBS*/, GlobalSequence));
		this.materials = this.parser.add(new ChunkList(0x534c544d/*MTLS*/, Material));
		this.textures = this.parser.add(new ChunkList(0x53584554/*TEXS*/, Texture));
		this.geosets = this.parser.add(new ChunkList(0x534f4547/*GEOS*/, Geoset));
		this.geosetAnimations = this.parser.add(new ChunkList(0x414f4547/*GEOA*/, GeosetAnimation));
		this.bones = this.parser.add(new ChunkList(0x454e4f42/*BONE*/, Bone));
		this.helpers = this.parser.add(new ChunkList(0x504c4548/*HELP*/, NodeData));
		this.attachments = this.parser.add(new ChunkList(0x48435441/*ATCH*/, Attachment));
		this.pivotPoints = this.parser.add(new ChunkList(0x54564950/*PIVT*/, PivotPoint));
		this.particleEmitters2 = this.parser.add(new ChunkList(0x32455250/*PRE2*/, ParticleEmitter2));
		this.eventObjects = this.parser.add(new ChunkList(0x53545645/*EVTS*/, EventObject));
		this.collisionShapes = this.parser.add(new ChunkList(0x44494c43/*CLID*/, CollisionShape));
		this.cornEmmiter = this.parser.add(new ChunkList(0x4e524f43/*CORN*/, CornEmmiter));
		this.cameras = this.parser.add(new ChunkList(0x534d4143/*CAMS*/, Camera));
		this.faceEffect = this.parser.add(new ChunkList(0x58464146/*FAFX*/, FaceEffect));

		if (0) {
			this.lights = CountedListOld.fromKey(this.reader, 0x4554494c/*LITE*/, Light, {chunk: true});
			this.textureAnimations = CountedListOld.fromKey(this.reader, 0x4e415854/*TXAN*/, TextureAnimation, {chunk: true});
			this.particleEmitters = CountedListOld.fromKey(this.reader, 0x4d455250/*PREM*/, ParticleEmitter, {chunk: true});
			this.ribbinEmitters = CountedListOld.fromKey(this.reader, 0x42424952/*RIBB*/, RibbonEmitter, {chunk: true});
		}

		this.parser.read();

		if (this.reader.byteOffset !== this.view.byteLength) {
			let key = ``;
			if (this.view.byteLength - this.reader.byteOffset >= 4) {
				key = int2s(this.reader.getUint32());
			}
			console.error(`MDX end offset error, key: ${key}, ${s2s(key)}`);
			//throw new Error(`MDX end offset error, key: ${key}, ${s2s(key)}`);
		}
	}

	/** @return {ArrayBuffer} */
	write() {
		this.parser.write();
		//console.log(JSON.stringify(this.geosets, null, 4));
		//console.log(JSON.stringify(this, null, 4));
		return this.reader.output;
	}

	toJSON() {
		return {
			format: this.format,
			version: this.version,
			model: this.model,
			sequences: this.sequences,
			globalSequences: this.globalSequences,
			materials: this.materials,
			textures: this.textures,
			geosets: this.geosets,
			bones: this.bones,
			helper: this.helpers,
			attachments: this.attachments,
			pivotPoints: this.pivotPoints,
			particleEmitters2: this.particleEmitters2,
			eventObjects: this.eventObjects,
			collisionShapes: this.collisionShapes,
			geosetAnimations: this.geosetAnimations,
			cornEmmiter: this.cornEmmiter,
			cameras: this.cameras,
			faceEffect: this.faceEffect,
		}
	}
}
