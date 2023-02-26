/** @module MDX */

/**
 * @interface DataView
 * @property {number} cursor
 * @property {number} version
 */

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
import {ParserOld} from "./parser/ParserOld.mjs";
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
import {Chunk} from "./parser/Chunk.mjs";
import {DataViewWrite} from "./parser/DataWiewWrite.mjs";

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

	/** @type {number} */ vers = 800;
	/** @type {Error} */ error;
	errors = [];

	/** @type {Chunk[]} */ chunks = [];

	read() {

		this.error = null;

		const view = new DataView(this.reader.buffer);

		const k = view.getUint32(0, true);
		if (k !== Chunk.MDLX) {
			this.errors.push(new Error(`Missing MDLX bytes in start of file!`));
		}

		let byteOffset = 4;
		while (byteOffset < view.byteLength) {
			let key = view.getUint32(byteOffset, true);
			let byteLength = view.getUint32(byteOffset += 4, true);
			byteOffset += 4;

			const add = (parser, inclusive = false) => {
				const p = new Chunk(byteOffset, byteLength, key, this.reader.buffer, parser, this, inclusive);
				this.chunks.push(p);
				return p;
			};

			switch (key) {
				case Chunk.VERS:
					this.version = add(Version);
					break;
				case Chunk.INFO:
					this.info = add(Info);
					break;
				case Chunk.MODL:
					this.model = add(Model);
					break;
				case Chunk.SEQS:
					this.sequences = add(Sequence);
					break;
				case Chunk.MTLS:
					this.materials = add(Material, true);
					break;
				default:
				//this.errors.push(new Error(`Missing chunk parser: ${Reader.int2s(key)}`));
			}

			if (0) {
				this.parser = new ParserOld(this.reader);

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
			}

			byteOffset += byteLength;
		}

		for (const c of this.chunks) {
			try {
				c.read();
			} catch (e) {
				this.errors.push(e);
			}
		}

		console.log(this.errors);
	}

	/**
	 * @param {DataView} view
	 * @private
	 */
	_write(view) {
		view.setUint32(0, Chunk.MDLX, true);
		view.cursor = 4;
		for (const c of this.chunks) {
			try {
				c.write(view);
			} catch (e) {
				console.log(e);
				this.errors.push(e);
			}
		}
	}

	write() {
		const dvw = new DataViewWrite();
		this._write(dvw);

		const ab = new ArrayBuffer(dvw.cursor);
		const dv = new DataView(ab);
		this._write(dv);

		return ab;
	}

	toJSON() {
		return {
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
