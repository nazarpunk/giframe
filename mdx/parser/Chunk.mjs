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
	static TEXS = 0x53584554;
	static BONE = 0x454e4f42;
	static PIVT = 0x54564950;
	static GLBS = 0x53424c47;
	static HELP = 0x504c4548;
	static PREM = 0x4d455250;
	static PRE2 = 0x32455250;
	static EVTS = 0x53545645;
	static CLID = 0x44494c43;
	static FAFX = 0x58464146;
	static TXAN = 0x4e415854;
	static RIBB = 0x42424952;
	static LITE = 0x4554494c;
	static KEVT = 0x5456454b;

	// Camera
	static CAMS = 0x534d4143;
	static KCRL = 0x4c52434b; // float rotation
	static KCTR = 0x5254434b; // float[3] translation
	static KTTR = 0x5254544b; // float[3] targetTranslation

	// Corn emitter
	static CORN = 0x4e524f43;
	static KPPA = 0x4150504b;// float alpha
	static KPPC = 0x4350504b;// float[3] color
	static KPPE = 0x4550504b;// float emissionRate
	static KPPL = 0x4c50504b;// float lifespan
	static KPPS = 0x5350504b;// float speed
	static KPPV = 0x5650504b;// float visibility

	// Node
	static KGTR = 0x5254474b; // float[3] translation
	static KGRT = 0x5452474b; // float[4] rotation
	static KGSC = 0x4353474b; // float[3] scaling

	// Material
	static MTLS = 0x534c544d;
	static LAYS = 0x5359414c;

	// Layer
	static KMTE = 0x45544d4b; // float emissiveGain
	static KMTF = 0x46544d4b; // uint32 textureId
	static KMTA = 0x41544d4b; // float alpha
	static KFC3 = 0x3343464b; // float[3] fresnelColor
	static KFCA = 0x4143464b; // float fresnelAlpha
	static KFTC = 0x4354464b; // float fresnelTeamColor

	// Geoset animation
	static GEOA = 0x414f4547;
	static KGAO = 0x4f41474b; // float alpha
	static KGAC = 0x4341474b; // float[3] color

	// Geoset
	static GEOS = 0x534f4547;
	static VRTX = 0x58545256;
	static NRMS = 0x534d524e;
	static PTYP = 0x50595450;
	static PCNT = 0x544e4350;
	static PVTX = 0x58545650;
	static GNDX = 0x58444e47;
	static MTGC = 0x4347544d;
	static MATS = 0x5354414d;
	static TANG = 0x474e4154;
	static SKIN = 0x4e494b53;
	static UVAS = 0x53415655;
	static UVBS = 0x53425655;

	// Attachment
	static ATCH = 0x48435441;
	static KATV = 0x5654414b; // float visibility

}

/*

// Texture animation
KTAT: float[3] translation
KTAR: float[4] rotation
KTAS: float[3] scaling
// Light
KLAS: float attenuationStart
KLAE: float attenuationStartEnd
KLAC: float[3] color
KLAI: float intensity
KLBI: float ambientIntensity
KLBC: float[3] ambientColor
KLAV: float visibility
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
 */