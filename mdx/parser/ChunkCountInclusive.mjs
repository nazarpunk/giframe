/** @module MDX */
import {Reader} from "./Reader.mjs";

export class ChunkCountInclusive {

	/** @type {MDX} */ mdx;

	constructor(id, child) {
		this.id = id;
		this.child = child;
	}

	items = [];

	/** @param {DataView} view */
	read(view) {
		const id = view.getUint32(view.cursor, true);
		if (id !== this.id) {
			throw new Error(`ChunkCountInclusive wrong id: ${Reader.int2s(this.id)} != ${Reader.int2s(id)}`);
		}
		const count = view.getUint32(view.cursor += 4, true);
		view.cursor += 4;
		for (let i = 0; i < count; i++) {
			const size = view.getUint32(view.cursor, true) - 4;
			view.cursor += 4;

			if (size <= 0) {
				throw new Error('ChunkCountInclusive size is 0!');
			}
			if (view.cursor + size > view.byteLength) {
				throw new Error(`ChunkCountInclusive out of range: ${view.cursor + size} > ${view.byteLength}`);
			}

			const v = new DataView(view.buffer, view.byteOffset + view.cursor, size);
			v.cursor = 0;

			const parser = new this.child();
			parser.mdx = this.mdx;
			this.items.push(parser);
			parser.read(v);

			view.cursor += size;
		}
		if (view.cursor !== view.byteLength) {
			throw new Error('ChunkCountInclusive inclusive wrong count!');
		}
	}

	/** @param {DataView} view */
	write(view) {
		view.setUint32(view.cursor, this.id, true);
		view.setUint32(view.cursor += 4, this.items.length, true);
		view.cursor += 4;
		for (const i of this.items) {
			let size = view.cursor;
			view.cursor += 4;
			(i.write ? i : i.parser).write(view);
			view.setUint32(size, view.cursor - size, true);
		}
	}
}