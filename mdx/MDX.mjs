/** @module MDX */

import {Format} from "./data/Format.mjs";
import {Version} from "./data/Version.mjs";
import {Model} from "./data/Model.mjs";
import {Sequence} from "./data/Sequence.mjs";
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
import {Material} from "./data/Material.mjs";
import {Texture} from "./data/Texture.mjs";
import {TextureAnimation} from "./data/TextureAnimation.mjs";
import {ParticleEmitter2} from "./data/ParticleEmitter2.mjs";
import {ParticleEmitter} from "./data/ParticleEmitter.mjs";
import {Camera} from "./data/Camera.mjs";
import {Light} from "./data/Light.mjs";
import {Parser} from "./parser/Parser.mjs";
import {ChunkList} from "./parser/ChunkList.mjs";
import {GlobalSequence} from "./data/GlobalSequence.mjs";
import {hex, hex2s} from "./type/hex.mjs";

export class MDX {
	/**
	 * @param {ArrayBuffer} buffer
	 */
	constructor(buffer) {
		this.reader = new Reader(buffer);
		this.view = new DataView(buffer);

		this.parser = new Parser(this.reader);

		this.format = this.parser.add(Format);
		this.version = this.parser.add(Version);
		this.model = this.parser.add(Model);
		this.sequences = this.parser.add(new ChunkList(0x53514553/*SEQS*/, Sequence));
		this.globalSequences = this.parser.add(new ChunkList(0x53424c47/*GLBS*/, GlobalSequence));
		this.materials = this.parser.add(new ChunkList(0x534c544d/*MTLS*/, Material));

		if (0) {
			this.lights = CountedListOld.fromKey(this.reader, 'LITE', Light, {chunk: true});
			this.textures = CountedListOld.fromKey(this.reader, 'TEXS', Texture, {chunk: true});
			this.textureAnimations = CountedListOld.fromKey(this.reader, 'TXAN', TextureAnimation, {chunk: true});
			this.geosets = CountedListOld.fromKey(this.reader, 'GEOS', Geoset, {chunk: true});
			this.geosetAnimations = CountedListOld.fromKey(this.reader, 'GEOA', GeosetAnimation, {chunk: true});
			this.bones = CountedListOld.fromKey(this.reader, 'BONE', Bone, {chunk: true});
			this.helper = CountedListOld.fromKey(this.reader, 'HELP', NodeData, {chunk: true});
			this.attachments = CountedListOld.fromKey(this.reader, 'ATCH', Attachment, {chunk: true});
			this.pivotPoints = CountedListOld.fromKey(this.reader, 'PIVT', PivotPoint, {chunk: true});
			this.particleEmitters = CountedListOld.fromKey(this.reader, 'PREM', ParticleEmitter, {chunk: true});
			this.particleEmitters2 = CountedListOld.fromKey(this.reader, 'PRE2', ParticleEmitter2, {chunk: true});
			this.cameras = CountedListOld.fromKey(this.reader, 'CAMS', Camera, {chunk: true});
			this.ribbinEmitters = CountedListOld.fromKey(this.reader, 'RIBB', RibbonEmitter, {chunk: true});
			this.eventObjects = CountedListOld.fromKey(this.reader, 'EVTS', EventObject, {chunk: true});
			this.collisionShapes = CountedListOld.fromKey(this.reader, 'CLID', CollisionShape, {chunk: true});
		}

		this.parser.read();

		if (this.reader.byteOffset !== this.view.byteLength) {
			let key = ``;
			if (this.view.byteLength - this.reader.byteOffset >= 4) {
				key = hex2s(this.reader.getUint32());
			}
			console.error(`MDX end offset error, key: ${key}, ${hex(key)}`);
			//throw new Error(`MDX end offset ${this.reader.byteOffset} not equal length ${this.dataView.byteLength}`);
		}
	}

	/** @return {ArrayBuffer} */
	write() {
		this.parser.write();

		//console.log(JSON.stringify(this.materials, null, 4));
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
		}
	}
}
