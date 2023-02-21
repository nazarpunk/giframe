/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {CountList} from "../parser/CountList.mjs";
import {Float32List} from "../parser/Float32List.mjs";
import {Uint16, Uint32, Uint8} from "../parser/Uint.mjs";
import {Char} from "../parser/Char.mjs";
import {Extent} from "./Extent.mjs";

export class Geoset {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.vertexPositions = this.parser.add(new CountList(0x58545256/*VRTX*/, new Float32List(3)));
		this.vertexNormals = this.parser.add(new CountList(0x534d524e/*NRMS*/, new Float32List(3)));
		this.faceTypeGroups = this.parser.add(new CountList(0x50595450/*PTYP*/, Uint32));
		this.faceGroups = this.parser.add(new CountList(0x544e4350/*PCNT*/, Uint32));
		this.faces = this.parser.add(new CountList(0x58545650/*PVTX*/, Uint16));
		this.vertexGroups = this.parser.add(new CountList(0x58444e47/*GNDX*/, Uint8));
		this.matrixGroups = this.parser.add(new CountList(0x4347544d/*MTGC*/, Uint32));
		this.matrixIndices = this.parser.add(new CountList(0x5354414d/*MATS*/, Uint32));
		this.materialId = this.parser.add(Uint32);
		this.selectionGroup = this.parser.add(Uint32);
		this.selectionFlags = this.parser.add(Uint32);
		if (this.reader.version > 800) {
			this.lod = this.parser.add(Uint32);
			this.lodName = this.parser.add(new Char(80));
		}
		this.parser.add(Extent);
		this.sequenceExtents = this.parser.add(new CountList(null, Extent));
		if (this.reader.version > 800) {
			this.tangents = this.parser.add(new CountList(0x474e4154/*TANG*/, new Float32List(4)));
			this.skins = this.parser.add(new CountList(0x4e494b53/*SKIN*/, Uint8));
		}
		this.textureCoordinateSets = this.parser.add(new CountList(0x53415655/*UVAS*/, new CountList(0x53425655/*UVBS*/, new Float32List(2))));

		//this.parser.add(Stop);
		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			vertexPositions: this.vertexPositions,
			vertexNormals: this.vertexNormals,
			faceTypeGroups: this.faceTypeGroups,
			faceGroups: this.faceGroups,
			faces: this.faces,
			vertexGroups: this.vertexGroups,
			matrixGroups: this.matrixGroups,
			matrixIndices: this.matrixIndices,
			materialId: this.materialId,
			selectionGroup: this.selectionGroup,
			selectionFlags: this.selectionFlags,
			lod: this.lod,
			lodName: this.lodName,
			sequenceExtents: this.sequenceExtents,
			tangents: this.tangents,
			skins: this.skins,
			textureCoordinateSets: this.textureCoordinateSets,
		}
	}
}


/*
Geoset {
  uint32 inclusiveSize
  char[4] "VRTX"
  uint32 vertexCount
  float[vertexCount * 3] vertexPositions
  char[4] "NRMS"
  uint32 normalCount
  float[normalCount * 3] vertexNormals
  char[4] "PTYP"
  uint32 faceTypeGroupsCount
  uint32[faceTypeGroupsCount] faceTypeGroups
  char[4] "PCNT"
  uint32 faceGroupsCount
  uint32[faceGroupsCount] faceGroups
  char[4] "PVTX"
  uint32 facesCount
  uint16[facesCount] faces
  char[4] "GNDX"
  uint32 vertexGroupsCount
  uint8[vertexGroupsCount] vertexGroups
  char[4] "MTGC"
  uint32 matrixGroupsCount
  uint32[matrixGroupsCount] matrixGroups
  char[4] "MATS"
  uint32 matrixIndicesCount
  uint32[matrixIndicesCount] matrixIndices
  uint32 materialId
  uint32 selectionGroup
  uint32 selectionFlags

  if (version > 800) {
    uint32 lod
    char[80] lodName
  }

  Extent extent
  uint32 extentsCount
  Extent[extentsCount] sequenceExtents

  if (version > 800) {
    (Tangents)
    (Skin)
  }

  char[4] "UVAS"
  uint32 textureCoordinateSetsCount
  TextureCoordinateSet[textureCoordinateSetsCount] textureCoordinateSets
}
 */