/** @module MDX */

export class Chunk {
	/** @type {MDX} */ mdx;

	/**
	 * @param {number} byteOffset
	 * @param {number} byteLength
	 * @param {number} key
	 * @param {ArrayBuffer} buffer
	 * @param child
	 * @param {MDX} mdx
	 * @param {boolean} inclusive
	 */
	constructor(byteOffset, byteLength, key, buffer, child, mdx, inclusive) {
		this.key = key;
		this.view = new DataView(buffer, byteOffset, byteLength);
		this.view.cursor = 0;
		this.child = child;
		this.mdx = mdx;
		this.inclusive = inclusive;
	}

	items = [];

	/**
	 * @param {DataView} view
	 * @private
	 */
	_read(view) {
		const parser = new this.child();
		parser.mdx = this.mdx;
		this.items.push(parser);
		parser.read(view);
	}

	read() {
		if (this.inclusive) {
			while (this.view.cursor < this.view.byteLength) {
				const size = this.view.getUint32(this.view.cursor, true);
				if (size <= 0) {
					throw new Error('Chunk inclusive size is 0!');
				}
				if (this.view.cursor + size > this.view.byteLength) {
					throw new Error('Chunk inclusive size out of range!');
				}

				const view = new DataView(this.view.buffer, this.view.byteOffset + this.view.cursor + 4, size);
				view.cursor = 0;

				this._read(view);

				this.view.cursor += size;
			}
			if (this.view.cursor !== this.view.byteLength) {
				throw new Error('Chunk inclusive wrong count!');
			}
			return;
		}

		while (this.view.cursor < this.view.byteLength) {
			const offset = this.view.cursor;

			this._read(this.view);

			if (offset === this.view.cursor) {
				throw new Error('Chunk infinity read!');
			}
		}
	}

	/** @param {DataView} view */
	write(view) {
		view.setUint32(view.cursor, this.key, true);
		const so = view.cursor += 4;
		view.cursor += 4;
		for (const i of this.items) {
			if (this.inclusive) {
				view.cursor += 4;
			}
			(i.write ? i : i.parser).write(view)
		}
		view.setUint32(so, view.cursor - so - 4, true);
	}

	static MDLX = 0x584c444d;
	static INFO = 0x4f464e49;
	static VERS = 0x53524556;
	static MODL = 0x4c444f4d;
	static SEQS = 0x53514553;
	static MTLS = 0x534c544d;
}