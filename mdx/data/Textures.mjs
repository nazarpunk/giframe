import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";

export class Textures {
	/** @param {DWORD} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.ChunkSize = new DWORD(r);
		const n = this.ChunkSize.value / 268;
		for (let i = 0; i < n; i++) {
			this.textures.push(new Texture(r));
		}
	}

	/** @type {Texture[]} */
	textures = [];

	write() {
		this.key.write();
		this.ChunkSize.writeValue(this.textures.length * 268);
		for (const t of this.textures) {
			t.write();
		}
	}
}

class Texture {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.ReplaceableId = new DWORD(reader);
		this.FileName = new CHAR(reader, 260);
		this.Flags = new DWORD(reader);
	}

	/**
	 * 1 - WrapWidth
	 * 2 - WrapHeight
	 * @type {DWORD}
	 */
	Flags;

	write() {
		this.ReplaceableId.write();
		this.FileName.write();
		this.Flags.write();
	}
}