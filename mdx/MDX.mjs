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
import {CountedList} from "./parser/CountedList.js";
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
import {Parser} from "./parser/Parser.mjs";
import {ChunkedList} from "./parser/ChunkedList.mjs";

export class MDX {
	/**
	 * @param {ArrayBuffer} buffer
	 */
	constructor(buffer) {
		this.reader = new Reader(buffer);
		this.view = new DataView(buffer);

		this.parser = new Parser(this.reader);
		this.version = this.parser.add(Version);
		this.format = this.parser.add(Format);
		this.sequences = this.parser.add(new ChunkedList(0x53514553/*SEQS*/, Sequence));
		this.model = this.parser.add(Model);

		this.parser.read();

		if (0) {
			this.globalSequences = CountedList.fromKey(this.reader, 'GLBS', DWORD, {chunk: true});
			this.lights = CountedList.fromKey(this.reader, 'LITE', Light, {chunk: true});
			this.materials = CountedList.fromKey(this.reader, 'MTLS', Material, {chunk: true});
			this.textures = CountedList.fromKey(this.reader, 'TEXS', Texture, {chunk: true});
			this.textureAnimations = CountedList.fromKey(this.reader, 'TXAN', TextureAnimation, {chunk: true});
			this.geosets = CountedList.fromKey(this.reader, 'GEOS', Geoset, {chunk: true});
			this.geosetAnimations = CountedList.fromKey(this.reader, 'GEOA', GeosetAnimation, {chunk: true});
			this.bones = CountedList.fromKey(this.reader, 'BONE', Bone, {chunk: true});
			this.helper = CountedList.fromKey(this.reader, 'HELP', NodeData, {chunk: true});
			this.attachments = CountedList.fromKey(this.reader, 'ATCH', Attachment, {chunk: true});
			this.pivotPoints = CountedList.fromKey(this.reader, 'PIVT', PivotPoint, {chunk: true});
			this.particleEmitters = CountedList.fromKey(this.reader, 'PREM', ParticleEmitter, {chunk: true});
			this.particleEmitters2 = CountedList.fromKey(this.reader, 'PRE2', ParticleEmitter2, {chunk: true});
			this.cameras = CountedList.fromKey(this.reader, 'CAMS', Camera, {chunk: true});
			this.ribbinEmitters = CountedList.fromKey(this.reader, 'RIBB', RibbonEmitter, {chunk: true});
			this.eventObjects = CountedList.fromKey(this.reader, 'EVTS', EventObject, {chunk: true});
			this.collisionShapes = CountedList.fromKey(this.reader, 'CLID', CollisionShape, {chunk: true});
		}

		if (this.reader.byteOffset !== this.view.byteLength) {
			//console.error('end offset error');
			//throw new Error(`MDX end offset ${this.reader.byteOffset} not equal length ${this.dataView.byteLength}`);
		}
	}

	/** @return {ArrayBuffer} */
	write() {
		this.parser.write();

		//console.log(JSON.stringify(this, null, 4));

		return this.reader.output;
	}

	toJSON() {
		return {
			format: this.format,
			version: this.version,
			model: this.model,
			sequences: this.sequences,
		}
	}
}
