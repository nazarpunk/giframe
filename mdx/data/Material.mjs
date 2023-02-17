/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {CountedList} from "../model/CountedList.js";
import {Layer} from "./Layer.mjs";

export class Material {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.PriorityPlane = new DWORD(reader);
		this.Flags = new DWORD(reader);

		if (reader.version > 800) {
			this.shader = new CHAR(reader, 80);
		}

		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'LAYS':
					this.layers = new CountedList(key, Layer, {count: true});
					break;
				default:
					throw new Error(`Material wrong key: ${key.name}`);
			}
		}

		this.inclusiveSize.check();
	}

	/**
	 * 1  - ConstantColor
	 * 2  - ???
	 * 4  - ???
	 * 8  - SortPrimitivesNearZ
	 * 16 - SortPrimitivesFarZ
	 * 32 - FullResolution
	 * @type {DWORD}
	 */
	Flags;

	/** @type {CountedList} */ layers;

	write() {
		this.inclusiveSize.save();
		this.PriorityPlane.write();
		this.Flags.write();
		this.shader?.write();
		this.layers?.write();
		this.inclusiveSize.write();
	}
}

/*
 struct MaterialTextureId
{
  DWORD 'KMTF';

  DWORD NrOfTracks;
  DWORD InterpolationType;             //0 - None
                                       //1 - Linear
                                       //2 - Hermite
                                       //3 - Bezier
  DWORD GlobalSequenceId;

  struct ScalingTrack[NrOfTracks]
  {
    DWORD Time;
    DWORD TextureId;

    if(InterpolationType > 1)
    {
      DWORD InTan;
      DWORD OutTan;
    }
  };
};
*/
