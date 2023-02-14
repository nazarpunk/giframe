// noinspection JSUnusedGlobalSymbols

const response = await fetch('7x7sprite.mdx');
const buffer = await response.arrayBuffer();

let data = new DataView(buffer);

let byteOffset = 0;

const DWORD = () => {
	const d = data.getUint32(byteOffset, true);
	byteOffset += 4;
	return d;
};
const FLOAT = () => {
	const d = data.getFloat32(byteOffset, true);
	byteOffset += 4;
	return d;
};

const CHAR = num => {
	const s = [];
	for (let i = 0; i < num; i++) {
		s.push(String.fromCharCode(data.getUint8(byteOffset)));
		byteOffset++;
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

// DATA
const MDLX = DWORD();

const VersionChunk = {
	VERS: DWORD(),
	ChunkSize: DWORD(),
	Version: DWORD(),
};

const ModelChunk = {
	MODL: DWORD(),
	ChunkSize: DWORD(),
	Name: CHAR(80),
	AnimationFileName: CHAR(260),
	BoundsRadius: FLOAT(),
	MinimumExtent: [FLOAT(), FLOAT(), FLOAT()],
	MaximumExtent: [FLOAT(), FLOAT(), FLOAT()],
	BlendTime: DWORD(),
};

class SequenceChunk {
	/** @type {Sequence[]} */
	sequences = [];

	constructor() {
		this.SEQS = DWORD();
		this.ChunkSize = DWORD();
		const n = this.ChunkSize / 132;
		for (let i = 0; i < n; i++) {
			this.sequences.push(new Sequence());
		}
	}
}

class Sequence {
	constructor() {
		this.Name = CHAR(80, 'sName');
		this.IntervalStart = DWORD();
		this.IntervalEnd = DWORD();
		this.MoveSpeed = FLOAT();

		this.Flags = DWORD();
		// 0 - Looping
		// 1 - NonLooping

		this.Rarity = FLOAT();
		this.SyncPoint = DWORD();
		this.BoundsRadius = FLOAT();
		this.MinimumExtent = [FLOAT(), FLOAT(), FLOAT()];
		this.MaximumExtent = [FLOAT(), FLOAT(), FLOAT()];
	}
}

const sequenceChunk = new SequenceChunk();

class GlobalSequenceChunk {
	/** @type {GlobalSequence[]} */
	sequences = [];

	constructor() {
		this.GLBS = DWORD();
		this.ChunkSize = DWORD();

		const n = this.ChunkSize / 4;
		for (let i = 0; i < n; i++) {
			this.sequences.push(new GlobalSequence());
		}
	}
}

class GlobalSequence {
	constructor() {
		this.Duration = DWORD();
	}
}

const globalSequenceChunk = new GlobalSequenceChunk();

class TextureChunk {
	/** @type {Texture[]} */
	textures = [];

	constructor() {
		this.TEXS = DWORD();
		this.ChunkSize = DWORD();
		const n = this.ChunkSize / 268;
		for (let i = 0; i < n; i++) {
			this.textures.push(new Texture());
		}
	}
}

class Texture {
	constructor() {
		this.ReplaceableId = DWORD();
		this.FileName = CHAR(260);

		this.Flags = DWORD();
		// 1 - WrapWidth
		// 2 - WrapHeight
	}
}

const textureChunk = new TextureChunk();


console.log(MDLX);
console.log(VersionChunk);
console.log(ModelChunk);
console.log(sequenceChunk);
console.log(globalSequenceChunk);
console.log(textureChunk);


export {}