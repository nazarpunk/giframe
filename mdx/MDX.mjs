/** @module MDX */

import {Geoset} from "./data/Geoset.mjs";
import {PivotPoint} from "./data/PivotPoint.mjs";
import {Attachment} from "./data/Attachment.mjs";
import {RibbonEmitter} from "./data/RibbonEmitter.mjs";
import {EventObject} from "./data/EventObject.mjs";
import {GeosetAnimation} from "./data/GeosetAnimation.mjs";
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
import {s2s} from "./utils/hex.mjs";
import {Format} from "./data/Format.mjs";
import {Version} from "./data/Version.mjs";
import {Model} from "./data/Model.mjs";
import {ChunkList} from "./parser/ChunkList.mjs";
import {Sequence} from "./data/Sequence.mjs";
import {GlobalSequence} from "./data/GlobalSequence.mjs";
import {Material} from "./data/Material.mjs";
import {CornEmmiter} from "./data/CornEmmiter.mjs";
import {FaceEffect} from "./data/FaceEffect.mjs";
import {BindPose} from "./data/BindPose.mjs";
import {Reader} from "./parser/Reader.mjs";
import {Info} from "./data/Info.mjs";

/**
 * @callback MDXOnError
 * @param {Error} error
 */

export class MDX {
	/**
	 * @param {Reader} reader
	 */
	constructor(reader) {
		this.reader = reader;
	}

	/** @type {Error} */ error;

	read() {
		this.error = null;

		this.parser = new Parser(this.reader);

		//0x4f464e49/*INFO*/

		this.format = this.parser.add(Format);
		this.version = this.parser.add(Version);
		this.model = this.parser.add(Model);
		this.info = this.parser.add(Info);
		this.sequences = this.parser.add(new ChunkList(0x53514553/*SEQS*/, Sequence));
		this.materials = this.parser.add(new ChunkList(0x534c544d/*MTLS*/, Material));
		this.globalSequences = this.parser.add(new ChunkList(0x53424c47/*GLBS*/, GlobalSequence));
		this.textures = this.parser.add(new ChunkList(0x53584554/*TEXS*/, Texture));
		this.geosets = this.parser.add(new ChunkList(0x534f4547/*GEOS*/, Geoset));
		this.geosetAnimations = this.parser.add(new ChunkList(0x414f4547/*GEOA*/, GeosetAnimation));
		this.bones = this.parser.add(new ChunkList(0x454e4f42/*BONE*/, Bone));
		this.helpers = this.parser.add(new ChunkList(0x504c4548/*HELP*/, NodeData));
		this.attachments = this.parser.add(new ChunkList(0x48435441/*ATCH*/, Attachment));
		this.pivotPoints = this.parser.add(new ChunkList(0x54564950/*PIVT*/, PivotPoint));
		this.particleEmitters = this.parser.add(new ChunkList(0x4d455250/*PREM*/, ParticleEmitter));
		this.particleEmitters2 = this.parser.add(new ChunkList(0x32455250/*PRE2*/, ParticleEmitter2));
		this.eventObjects = this.parser.add(new ChunkList(0x53545645/*EVTS*/, EventObject));
		this.collisionShapes = this.parser.add(new ChunkList(0x44494c43/*CLID*/, CollisionShape));
		this.cornEmmiter = this.parser.add(new ChunkList(0x4e524f43/*CORN*/, CornEmmiter));
		this.cameras = this.parser.add(new ChunkList(0x534d4143/*CAMS*/, Camera));
		this.faceEffect = this.parser.add(new ChunkList(0x58464146/*FAFX*/, FaceEffect));
		this.lights = this.parser.add(new ChunkList(0x4554494c/*LITE*/, Light));
		this.textureAnimations = this.parser.add(new ChunkList(0x4e415854/*TXAN*/, TextureAnimation));
		this.ribbinEmitters = this.parser.add(new ChunkList(0x42424952/*RIBB*/, RibbonEmitter));
		this.bindPose = this.parser.add(BindPose);


		try {
			this.parser.read();
			if (this.reader.readOffset !== this.reader.readView.byteLength) {
				const key = this.reader.readView.byteLength - this.reader.readOffset >= 4 ? Reader.int2s(this.reader.readUint(4)) : '';
				// noinspection ExceptionCaughtLocallyJS
				throw new Error(`MDX end offset error, key: ${key}, ${s2s(key)}`);
			}
		} catch (e) {
			this.error = e;
		}
	}

	write() {
		this.error = undefined;
		try {
			this.reader.calc = true;
			this.parser.write();
		} catch (e) {
			this.error = e;
		}

		try {
			this.reader.output = new ArrayBuffer(this.reader.writeOffset);
			this.reader.writeView = new DataView(this.reader.output);
			this.reader.writeOffset = 0;
			this.reader.calc = false;
			this.parser.write();
		} catch (e) {
			this.error = e;
		}
	}

	toJSON() {
		return {
			format: this.format,
			version: this.version,
			model: this.model,
			info: this.info,
			sequences: this.sequences,
			globalSequences: this.globalSequences,
			materials: this.materials,
			textures: this.textures,
			geosets: this.geosets,
			bones: this.bones,
			helper: this.helpers,
			attachments: this.attachments,
			pivotPoints: this.pivotPoints,
			particleEmitters: this.particleEmitters,
			particleEmitters2: this.particleEmitters2,
			eventObjects: this.eventObjects,
			collisionShapes: this.collisionShapes,
			geosetAnimations: this.geosetAnimations,
			cornEmmiter: this.cornEmmiter,
			cameras: this.cameras,
			faceEffect: this.faceEffect,
			lights: this.lights,
			textureAnimations: this.textureAnimations,
			ribbinEmitters: this.ribbinEmitters,
			bindPose: this.bindPose,
		}
	}
}
