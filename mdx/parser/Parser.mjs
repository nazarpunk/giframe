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
				p.read();
				this._output.push(p);
			};

			if (p instanceof StructSize) {
				structSize = p;
				p.readOffsetCurrentEnd = this.reader.readOffset + this.reader.readUint(p.size) + p.offset;
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

				const end = structSize ? structSize.readOffsetCurrentEnd : this.reader.readView.byteLength;
				while (this.reader.readOffset < end) {
					const o = this.reader.readOffset;
					const key = this.reader.readUint(4);

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
			if (this.reader.readOffset !== structSize.readOffsetCurrentEnd) {
				throw new Error(`StructSize error: ${this.reader.readOffset} != ${structSize.readOffsetCurrentEnd}`);
			}
		}
	}

	static writeCall(parser) {
		if (!parser.write) {
			parser.parser.write();
		} else {
			parser.write();
		}
	}

	write() {
		let ss;

		for (const p of this._output) {
			p.writeOffsetCurrent = this.reader.writeOffset;
			if (p instanceof StructSize) {
				ss = p;
			}
			Parser.writeCall(p);
		}

		if (ss && !this.reader.calc) {
			const value = this.reader.writeOffset - ss.writeOffsetCurrent - ss.offset;
			this.reader.setUint(ss.size, value, ss.writeOffsetCurrent);
		}
	}
}

// noinspection JSUnusedGlobalSymbols
export class Stop {
	/** @type {Reader} */ reader;

	read() {
		if (1) {
			const s = [];
			for (let i = 0; i < 40; i++) {
				s.push(String.fromCharCode(this.reader.readView.getUint8(this.reader.readOffset + i)).replace('\x00','_'));
			}
			console.log('\nSTOP',this.reader.version, s.join(''));
		}
		throw new Error(`STOP!!!!`);
	}
}