/** @module MDX */
import {StructSize} from "./StructSize.mjs";
import {Reader} from "./Reader.mjs";

export class Parser {
	/** @param {Reader} reader */
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

	static copyChild(child) {
		if (typeof child === 'object') {
			return child.copy();
		} else {
			return new child();
		}
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

		let structSize;

		while (this._input.length > 0) {
			const p = this._input.shift();
			const o = this.reader.readOffset;

			const _read = p => {
				p.readOffset = this.reader.readOffset;
				p.read();
				this._output.push(p);
			};

			if (p instanceof StructSize) {
				structSize = p;
				p.readOffsetEnd = this.reader.readOffset + this.reader.readUint(p.size) + p.offset;
			}

			const pid = p.constructor['id'] || p.id;
			if (pid) {
				const map = new Map();
				map.set(pid, p);
				while (this._input.length > 0) {
					const pn = this._input.shift();
					const pnid = pn.constructor['id'] || pn.id;
					if (!pnid) {
						this._input.unshift(pn);
						break;
					}
					map.set(pnid, pn);
				}

				const end = structSize ? structSize.readOffsetEnd : this.reader.readView.byteLength;
				while (this.reader.readOffset < end) {
					const o = this.reader.readOffset;
					const key = this.reader.getUint32();

					if (map.has(key)) {
						_read(map.get(key));
						if (o === this.reader.readOffset) {
							break;
						}
						map.delete(key);
						if (map.size === 0) {
							break;
						}
						continue;
					}
					break;
				}
				continue;
			}

			_read(p);

			if (o === this.reader.readOffset) {
				throw new Error('Parser infinity read!');
			}
		}

		if (structSize) {
			if (this.reader.readOffset !== structSize.readOffsetEnd) {
				throw new Error(`StructSize error: ${this.reader.readOffset} != ${structSize.readOffsetEnd}`);
			}
		}
	}

	write() {
		let structSize;

		for (const p of this._output) {
			if (p instanceof StructSize) {
				structSize = p;
				p.byteOffset = this.reader.writeOffset;
				this.reader.writeOffsetAdd(p.size);
				continue;
			}

			if (!p.write) {
				p.parser.write();
			} else {
				p.write();
			}
		}

		if (structSize && !this.reader.calc) {
			const value = this.reader.writeOffset - structSize.byteOffset - structSize.offset;
			this.reader.writeView.setUint32(structSize.byteOffset, value, true);
		}
	}
}