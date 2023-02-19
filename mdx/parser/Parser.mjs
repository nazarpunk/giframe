/** @module MDX */
import {ChunkSize} from "./ChunkSize.mjs";
import {hex2s} from "../type/hex.mjs";

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
		this._output.push(p);
	}

	read() {
		const map = new Map();
		for (const p of this._input) {
			// noinspection JSUnresolvedVariable
			const key = p.constructor.key;
			if (key) {
				map.set(key, p);
			}
		}

		/** @type {ChunkSize} */ let chunk;
		let chunkOffset = 0;

		while (this._input.length > 0) {
			const o = this.reader.byteOffset;
			const p = this._input.shift();

			if (p instanceof ChunkSize) {
				chunk = p;
				chunkOffset = this.reader.byteOffset;
			}

			// noinspection JSUnresolvedVariable
			const ckey = p.constructor.key;
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

			this._read(p);

			if (o === this.reader.byteOffset) {
				console.error('Parser infinity read!');
				break;
			}
		}

		if (chunk) {
			const value = this.reader.byteOffset - chunkOffset - 8;
			if (value !== 0) {
				console.error(`ChunkSize is wrong: ${value}`);
			}
		}
	}

	write() {
		/** @type {ChunkSize} */ let chunk;
		let chunkOffset = 0;

		for (const p of this._output) {
			if (p instanceof ChunkSize) {
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
			chunk.value = this.reader.output.byteLength - chunkOffset - 4;
			this.reader.updateUint32(chunk.value, chunkOffset);
		}
	}
}