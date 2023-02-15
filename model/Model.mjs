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
		return [this.dataView.getUint32(this.byteOffset, true), this.readCHAR(4)];
	}

	keyName() {
		const s = [];
		for (let i = 0; i < 4; i++) {
			s.push(String.fromCharCode(this.dataView.getUint8(this.byteOffset + i)));
		}
		return s.join('');
	}

	/**
	 * @param {number} length
	 * @return {DataView}
	 */
	outputData(length) {
		const l = this.output.byteLength;
		const b = new ArrayBuffer(l + length);
		(new Uint8Array(b, 0, l)).set(new Uint8Array(this.output, 0, l));
		this.output = b;
		return new DataView(this.output, l);
	}

	/** @return {number} */
	readDWORD() {
		const d = this.dataView.getUint32(this.byteOffset, true);
		this.byteOffset += 4;
		return d;
	};

	/** @param {number} dword */
	writeDWORD(dword) {
		this.outputData(4).setUint32(0, dword, true);
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
	readFLOAT() {
		const d = this.dataView.getFloat32(this.byteOffset, true);
		this.byteOffset += 4;
		return d;
	};

	/** @param {number} float */
	writeFLOAT(float) {
		this.outputData(4).setFloat32(0, float, true);
	}

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

	/**
	 * @param {string} str
	 * @param {number} length
	 */
	writeCHAR(str, length) {
		str = str.padEnd(length, '\x00');
		const view = this.outputData(length);
		for (let i = 0; i < length; i++) {
			view.setInt8(i, str.charCodeAt(i));
		}
	}

	/** @return {ArrayBuffer} */
	toArrayBuffer() {
		for (const d of this.datas) {
			if (d.write) {
				d.write();
			}
		}
		return this.output;
	}
}


