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
import {DWORD} from "./type/DWORD.mjs";
import {Reader} from "./type/Reader.mjs";

export class MDX {

	/**
	 * @param {ArrayBuffer} buffer
	 */
	constructor(buffer) {
		this.reader = new Reader(buffer);

		this.dataView = new DataView(buffer);
		this.dataView.byteOffset;

		parse: while (this.byteOffset < this.dataView.byteLength) {
			const key = new DWORD(this.reader);
			switch (key.valueName) {
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
				case 'MTLS':
					this.materials = new Materials(key);
					break;
				case 'TEXS':
					this.textures = new Textures(key);
					break;
				default:
					console.error('MDX:', key.valueName);
					break parse;
			}
		}

		return;

		parse: while (this.byteOffset < this.dataView.byteLength) {
			const [key, keyName] = this.keys();
			switch (keyName) {
				case 'TXAN':
					this.datas.push(new TextureAnimations(key, this));
					break;
				case 'GEOS':
					this.datas.push(new Geosets(key, this));
					break;
				case 'BONE':
					this.datas.push(new Bones(key, this));
					break;
				case 'PIVT':
					this.datas.push(new PivotPoints(key, this));
					break;

				default:
					console.error('Parse Error:', key, keyName);
					break parse;
			}
		}

		if (this.byteOffset !== this.dataView.byteLength) {
			console.error('Model Parse Unctomplete:', this.byteOffset, this.dataView.byteLength)
		}
	}

	/** @type ModelData[] **/
	datas = [];

	/**  @type {DataView} */ dataView;

	byteOffset = 0;

	/** @return {[number, string]} */
	keys() {
		return [this.dataView.getUint32(this.byteOffset, true), this.readCHAR(4)];
	}

	keyName() {
		const s = [];
		for (let i = 0; i < 4; i++) {
			s.push(String.fromCharCode(this.dataView.getUint8(this.byteOffset + i)));
		}
		return s.join('');
	}

	/** @return {number} */
	readDWORD() {
		const d = this.dataView.getUint32(this.byteOffset, true);
		this.byteOffset += 4;
		return d;
	};

	/** @return {number} */
	word() {
		const d = this.dataView.getUint16(this.byteOffset, true);
		this.byteOffset += 2;
		return d;
	};

	/** @return {number} */
	byte() {
		const d = this.dataView.getUint8(this.byteOffset);
		this.byteOffset += 1;
		return d;
	};

	/** @return {number} */
	readFLOAT() {
		const d = this.dataView.getFloat32(this.byteOffset, true);
		this.byteOffset += 4;
		return d;
	};

	/**
	 * @param {number} length
	 * @return {string}
	 */
	readCHAR(length) {
		const s = [];
		for (let i = 0; i < length; i++) {
			s.push(String.fromCharCode(this.dataView.getUint8(this.byteOffset)));
			this.byteOffset++;
		}
		for (let i = s.length - 1; i >= 0; i--) {
			if (s[i] === '\x00') {
				s.length -= 1;
			} else {
				break;
			}
		}
		return s.join('');
	};

	/** @return {ArrayBuffer} */
	toArrayBuffer() {
		this.format?.write();
		this.version?.write();
		this.model?.write();
		this.sequences?.write();
		this.materials?.write();
		this.textures?.write();

		return this.reader.output;
	}
}
