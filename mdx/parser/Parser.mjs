/** @module MDX */
import {ChunkSize, StructSize} from "./StructSize.mjs";
import {hex2s} from "../type/hex.mjs";
import {Reader} from "./Reader.mjs";
import {Interpolation} from "./Interpolation.mjs";
import {Layer} from "../data/Layer.mjs";

export class Parser {
	/**
	 * @param {Reader} reader
	 */
	constructor(reader) {
		this.reader = reader;
	}

	_input = [];
	_output = [];

	add(parser) {
		const p = typeof parser === 'object' ? parser : new parser();
		p.reader = this.reader;
		this._input.push(p);
		return p;
	}

	_read(p) {
		p.read();
		if (p instanceof Layer){
			throw new Error('Layer');
		}

		this._output.push(p);
	}

	read() {
		const map = new Map();
		for (const p of this._input) {
			// noinspection JSUnresolvedVariable
			const key = p.constructor.id || p.id;
			if (key) {
				map.set(key, p);
			}
		}

		/** @type {ChunkSize} */ let structSize;
		let structSizeOffset = 0, structSizeValue = 0;

		while (this._input.length > 0) {
			const o = this.reader.byteOffset;
			const p = this._input.shift();

			if (p instanceof StructSize) {
				structSize = p;
				structSizeValue = this.reader.getUint32();
				structSizeOffset = this.reader.byteOffset;
			}

			// noinspection JSUnresolvedVariable
			const ckey = p.constructor.id || p.id;

			if (ckey) {
				const key = this.reader.getUint32();

				if (ckey !== key) {
					if (map.has(key)) {
						this._input.push(p);
						this._read(map.get(key));
						continue;
					}
					console.error(`Parser missing key: ${hex2s(key)}`);
					break;
				}
			}

			if (p instanceof Interpolation) {
				console.log('---------', ckey, hex2s(ckey), hex2s(key));
			}

			this._read(p);

			if (o === this.reader.byteOffset) {
				console.error('Parser infinity read!');
				break;
			}
		}

		if (structSize) {
			const value = this.reader.byteOffset - structSizeOffset + structSize.offset;
			if (value !== structSizeValue) {
				console.error(structSize);
				throw new Error(`StructSize is wrong: ${structSize.value} != ${value}`);
				//console.error(`StructSize is wrong: ${structSize.value} != ${value}`);
			}
		}
	}

	write() {
		/** @type {ChunkSize} */ let chunk;
		let chunkOffset = 0;

		for (const p of this._output) {
			if (p instanceof StructSize) {
				chunk = p;
				chunkOffset = this.reader.output.byteLength;
			}

			if (!p.write) {
				p.parser.write();
			} else {
				p.write();
			}
		}

		if (chunk) {
			chunk.value = this.reader.output.byteLength - chunkOffset + chunk.offset;
			this.reader.updateUint32(chunk.value, chunkOffset);
		}
	}
}