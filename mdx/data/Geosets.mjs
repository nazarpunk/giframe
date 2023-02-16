import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";
import {BYTE} from "../type/BYTE.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class Geosets {
	/** @param {DWORD} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.ChunkSize = new DWORD(r);
		const end = r.byteOffset + this.ChunkSize.value;
		while (r.byteOffset < end) {
			this.geosets.push(new Geoset(r));
		}
	}

	/** @type {Geoset[]} */ geosets = [];

	write() {
		this.key.write();
		this.ChunkSize.write();
		for (const g of this.geosets) {
			g.write();
		}
	}
}

class Geoset {
	/** @param {Reader} reader */
	constructor(reader) {
		this.InclusiveSize = new DWORD(reader);
		//const end = reader.byteOffset - 4 + this.InclusiveSize;

		let len;

		// TODO move to generic structure
		this.vertexPositionKey = new DWORD(reader, {valueName: 'VRTX'});
		len = new DWORD(reader).value;
		for (let i = 0; i < len; i++) {
			this.vertexPositions.push(new VECTOR(reader, 3));
		}

		this.vertexNormalsKey = new DWORD(reader, {valueName: 'NRMS'});
		len = new DWORD(reader).value;
		for (let i = 0; i < len; i++) {
			this.vertexNormals.push(new VECTOR(reader, 3));
		}

		this.faceTypeGroupsKey = new DWORD(reader, {valueName: 'PTYP'});
		len = new DWORD(reader).value;
		for (let i = 0; i < len; i++) {
			this.faceTypeGroups.push(new DWORD(reader));
		}

		this.faceGroupsKey = new DWORD(reader, {valueName: 'PCNT'});
		len = new DWORD(reader).value;
		for (let i = 0; i < len; i++) {
			this.faceGroups.push(new DWORD(reader));
		}

		this.faceKey = new DWORD(reader, {valueName: 'PVTX'});
		len = new DWORD(reader).value / 3;
		for (let i = 0; i < len; i++) {
			this.face.push(new VECTOR(reader, 3, {word: true}));
		}

		this.vertexGroupsKey = new DWORD(reader, {valueName: 'GNDX'});
		len = new DWORD(reader).value;
		for (let i = 0; i < len; i++) {
			this.vertexGroups.push(new BYTE(reader));
		}

		this.matrixGroupKey = new DWORD(reader, {valueName: 'MTGC'});
		len = new DWORD(reader).value;
		for (let i = 0; i < len; i++) {
			this.matrixGroup.push(new DWORD(reader));
		}

		this.matrixIndexKey = new DWORD(reader, {valueName: 'MATS'});
		len = new DWORD(reader).value;
		for (let i = 0; i < len; i++) {
			this.matrixIndex.push(new DWORD(reader));
		}

		this.MaterialId = new DWORD(reader);
		this.SelectionGroup = new DWORD(reader);
		this.SelectionFlags = new DWORD(reader);
		this.BoundsRadius = new FLOAT(reader);
		this.MinimumExtent = new VECTOR(reader, 3);
		this.MaximumExtent = new VECTOR(reader, 3);

		this.extentLength = new DWORD(reader);
		for (let i = 0; i < this.extentLength.value; i++) {
			this.extent.push([new VECTOR(reader, 3), new VECTOR(reader, 3)]);
		}

		this.NrOfTextureVertexGroupsKey = new DWORD(reader, {valueName: 'UVAS'});
		this.NrOfTextureVertexGroups = new DWORD(reader);

		this.vertexTexturePositionKey = new DWORD(reader, {valueName: 'UVBS'});
		len = new DWORD(reader).value;
		for (let i = 0; i < len; i++) {
			this.vertexTexturePosition.push(new VECTOR(reader, 2));
		}
	}

	/** @type {VECTOR[]} */ vertexPositions = [];
	/** @type {VECTOR[]} */ vertexNormals = [];

	/**
	 * 4   - Triangles
	 * ??? - Triangle fan
	 * ??? - Triangle strip
	 * ??? - Quads
	 * ??? - Quad strip
	 * @type {DWORD[]}
	 */
	faceTypeGroups = [];

	/** @type {DWORD[]} */ faceGroups = [];
	/** @type {VECTOR[]} */ face = [];
	/** @type {BYTE[]} */ vertexGroups = [];
	/** @type {DWORD[]} */ matrixGroup = [];
	/** @type {DWORD[]} */ matrixIndex = [];

	/**
	 * 0  - None
	 * 1 - ???
	 * 2 - ???
	 * 4 - Unselectable
	 * @type {DWORD}
	 */
	SelectionFlags;
	/** @type {[VECTOR,VECTOR][]} */ extent = [];


	/** @type {VECTOR[]} */ vertexTexturePosition = [];

	write() {
		this.InclusiveSize.write();

		/**
		 * @param {DWORD} key
		 * @param {*[]} list
		 * @param multiply
		 */
		const simpleList = (key, list, multiply = 1) => {
			key.write();
			key.writeInt(list.length * multiply);
			for (const v of list) {
				v.write();
			}
		};

		simpleList(this.vertexPositionKey, this.vertexPositions);
		simpleList(this.vertexNormalsKey, this.vertexNormals);
		simpleList(this.faceTypeGroupsKey, this.faceTypeGroups);
		simpleList(this.faceGroupsKey, this.faceGroups);
		simpleList(this.faceKey, this.face, 3);
		simpleList(this.vertexGroupsKey, this.vertexGroups);
		simpleList(this.matrixGroupKey, this.matrixGroup);
		simpleList(this.matrixIndexKey, this.matrixIndex);

		this.MaterialId.write();
		this.SelectionGroup.write();
		this.SelectionFlags.write();
		this.BoundsRadius.write();
		this.MinimumExtent.write();
		this.MaximumExtent.write();

		this.extentLength.writeValue(this.extent.length);
		for (const list of this.extent) {
			for (const e of list) {
				e.write();
			}
		}

		this.NrOfTextureVertexGroupsKey.write();
		this.NrOfTextureVertexGroups.write();

		simpleList(this.vertexTexturePositionKey, this.vertexTexturePosition);
	}
}
