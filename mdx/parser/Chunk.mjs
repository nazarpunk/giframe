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
				const size = this.view.getUint32(this.view.cursor, true) - 4;
				this.view.cursor += 4;
				if (size <= 0) {
					throw new Error('Chunk inclusive size is 0!');
				}
				if (this.view.cursor + size > this.view.byteLength) {
					throw new Error('Chunk inclusive size out of range!');
				}

				const view = new DataView(this.view.buffer, this.view.byteOffset + this.view.cursor, size);
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
				let size = view.cursor;
				view.cursor += 4;
				(i.write ? i : i.parser).write(view);
				view.setUint32(size, view.cursor - size, true);
			} else {
				(i.write ? i : i.parser).write(view);
			}
		}
		view.setUint32(so, view.cursor - so - 4, true);
	}

	static MDLX = 0x584c444d;
	static INFO = 0x4f464e49;
	static VERS = 0x53524556;
	static MODL = 0x4c444f4d;
	static SEQS = 0x53514553;
	static MTLS = 0x534c544d;
	static LAYS = 0x5359414c;

	// Layer
	static KMTE = 0x45544d4b; // float emissiveGain
	static KMTF = 0x46544d4b; // uint32 textureId
	static KMTA = 0x41544d4b; // float alpha
	static KFC3 = 0x3343464b; // float[3] fresnelColor
	static KFCA = 0x4143464b; // float fresnelAlpha
	static KFTC = 0x4354464b; // float fresnelTeamColor
}

/*

// Node
KGTR: float[3] translation
KGRT: float[4] rotation
KGSC: float[3] scaling
// Texture animation
KTAT: float[3] translation
KTAR: float[4] rotation
KTAS: float[3] scaling
//Geoset animation
KGAO: float alpha
KGAC: float[3] color
// Light
KLAS: float attenuationStart
KLAE: float attenuationStartEnd
KLAC: float[3] color
KLAI: float intensity
KLBI: float ambientIntensity
KLBC: float[3] ambientColor
KLAV: float visibility
// Attachment
KATV: float visibility
// Particle emitter
KPEE: float emissionRate
KPEG: float gravity
KPLN: float longitude
KPLT: float latitude
KPEL: float lifespan
KPES: float speed
KPEV: float visibility
// Particle emitter 2
KP2E: float emissionRate
KP2G: float gravity
KP2L: float latitude
KP2S: float speed
KP2V: float visibility
KP2R: float variation
KP2N: float length
KP2W: float width
// Ribbon emitter
KRVS: float visibility
KRHA: float heightAbove
KRHB: float heightBelow
KRAL: float alpha
KRCO: float[3] color
KRTX: uint32 textureSlot
// Camera
KCTR: float[3] translation
KCRL: float rotation
KTTR: float[3] targetTranslation
// Corn emitter
KPPA: float alpha
KPPC: float[3] color
KPPE: float emissionRate
KPPL: float lifespan
KPPS: float speed
KPPV: float visibility
 */