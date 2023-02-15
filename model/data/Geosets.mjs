import {ModelData} from "../ModelData.mjs";

export class Geosets extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.readDWORD();

		const end = model.byteOffset + this.ChunkSize;
		let i = 0;
		while (model.byteOffset < end) {
			i++;
			if (i > 1) {
				break;
			}
			this.geosets.push(new Geoset(model));
		}
	}

	/** @type {Geoset[]} */ geosets = [];
}

class Geoset {
	/** @param {Model} model */
	constructor(model) {
		this.InclusiveSize = model.readDWORD();
		const end = model.byteOffset - 4 + this.InclusiveSize;
		let len;

		/** @param {string} key */
		const keyCheck = key => {
			const keyName = model.keyName();
			if (key !== keyName) {
				console.error('Geoset Error:', keyName);
				return;
			}
			model.byteOffset += 4;
		};

		keyCheck('VRTX');
		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.vertexPositions.push([model.float(), model.float(), model.float()]);
		}

		keyCheck('NRMS');
		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.vertexNormals.push([model.float(), model.float(), model.float()]);
		}

		keyCheck('PTYP');
		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.faceTypeGroups.push(model.readDWORD());
		}

		keyCheck('PCNT');
		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.faceGroups.push(model.readDWORD());
		}

		keyCheck('PVTX');
		len = model.readDWORD() / 3;
		for (let i = 0; i < len; i++) {
			this.face.push([model.word(), model.word(), model.word()]);
		}

		keyCheck('GNDX');
		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.vertexGroups.push(model.byte());
		}

		keyCheck('MTGC');
		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.matrixGroup.push(model.readDWORD());
		}

		keyCheck('MATS');
		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.matrixIndex.push(model.readDWORD());
		}

		this.MaterialId = model.readDWORD();
		this.SelectionGroup = model.readDWORD();
		this.SelectionFlags = model.readDWORD();
		this.BoundsRadius = model.float();
		this.MinimumExtent = [model.float(), model.float(), model.float()];
		this.MaximumExtent = [model.float(), model.float(), model.float()];

		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.extent.push([[model.float(), model.float(), model.float()], [model.float(), model.float(), model.float()]]);
		}

		keyCheck('UVAS');
		this.NrOfTextureVertexGroups = model.readDWORD();

		keyCheck('UVBS');
		len = model.readDWORD();
		for (let i = 0; i < len; i++) {
			this.vertexTexturePosition.push([model.float(),model.float()]);
		}
	}

	/** @type {[number,number,number][]} */ vertexPositions = [];
	/** @type {[number,number,number][]} */ vertexNormals = [];

	/**
	 * 4   - Triangles
	 * ??? - Triangle fan
	 * ??? - Triangle strip
	 * ??? - Quads
	 * ??? - Quad strip
	 * @type {number[]}
	 */
	faceTypeGroups = [];

	/** @type {number[]} */ faceGroups = [];
	/** @type {[number,number,number][]} */ face = [];
	/** @type {number[]} */ vertexGroups = [];
	/** @type {number[]} */ matrixGroup = [];
	/** @type {number[]} */ matrixIndex = [];

	/**
	 * 0  - None
	 * 1 - ???
	 * 2 - ???
	 * 4 - Unselectable
	 * @type {number}
	 */
	SelectionFlags;
	/** @type {[[number,number,number],[number,number,number]][]} */ extent = [];


	/** @type {[number,number][]} */ vertexTexturePosition = [];
}
