import {Format} from "./data/Format.mjs";
import {Version} from "./data/Version.mjs";
import {ModelInfo} from "./data/ModelInfo.mjs";
import {Sequences} from "./data/Sequences.mjs";
import {Textures} from "./data/Textures.mjs";
import {TextureAnimations} from "./data/TextureAnimations.mjs";
import {Materials} from "./data/Materials.mjs";
import {Geosets} from "./data/Geosets.mjs";
import {Bones} from "./data/Bones.mjs";
import {PivotPoints} from "./data/PivotPoints.mjs";

export class Model {

	/**
	 * @param {ArrayBuffer} buffer
	 */
	constructor(buffer) {
		this.dataView = new DataView(buffer);
		this.dataView.byteOffset;

		parse: while (this.byteOffset < this.dataView.byteLength) {
			const [key, keyName] = this.keys();
			switch (keyName) {
				case 'MDLX':
					this.datas.push(new Format(key, this));
					break;
				case 'VERS':
					this.datas.push(new Version(key, this));
					break;
				case 'MODL':
					this.datas.push(new ModelInfo(key, this));
					break;
				case 'SEQS':
					this.datas.push(new Sequences(key, this));
					break;
				case 'MTLS':
					this.datas.push(new Materials(key, this));
					break;
				case 'TEXS':
					this.datas.push(new Textures(key, this));
					break;
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

	output = new ArrayBuffer(0);

	/**  @type {DataView} */ dataView;

	byteOffset = 0;

	/** @return {[number, string]} */
	keys() {
		return [this.dataView.getUint32(this.byteOffset, true), this.char(4)];
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

	/** @param {number} dword */
	writeDWORD(dword) {
		const ol = this.output.byteLength;
		const nb = new ArrayBuffer(ol + 4);
		new DataView(nb).setUint32(ol, dword, true);
		(new Uint8Array(nb, 0, ol)).set(new Uint8Array(this.output, 0, ol));
		this.output = nb;
	}

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
	float() {
		const d = this.dataView.getFloat32(this.byteOffset, true);
		this.byteOffset += 4;
		return d;
	};

	/**
	 * @param {number} length
	 * @return {string}
	 */
	char(length) {
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
		for (const d of this.datas) {
			if (d.save) {
				d.save();
			}
		}
		return this.output;
	}
}


