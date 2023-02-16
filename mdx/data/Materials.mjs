import {DWORD} from "../type/DWORD.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {KEY} from "../type/KEY.mjs";
import {InclusiveSize} from "../type/InclusiveSize.mjs";

export class Materials {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.ChunkSize = new DWORD(r);
		const end = r.byteOffset + this.ChunkSize.value;
		while (r.byteOffset < end) {
			this.materials.push(new Material(r));
		}
	}

	/** @type {Material[]} */
	materials = [];

	write() {
		this.key.write();
		//const offset = this.key.reader.byteOffset;
		//FIXME
		this.ChunkSize.write();
		for (const m of this.materials) {
			m.write();
		}
	}
}

class Material {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new InclusiveSize(reader);
		this.PriorityPlane = new DWORD(reader);
		this.Flags = new DWORD(reader);

		parse: while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.valueName) {
				case 'LAYS':
					this.layers = new Layers(key);
					break;
				default:
					console.error('Material:', key.valueName);
					break parse;
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

	/** @type {Layers} */ layers;

	write() {
		this.inclusiveSize.save();
		this.PriorityPlane.write();
		this.Flags.write();
		this.layers?.write();
		this.inclusiveSize.write();
	}
}

class Layers {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.NrOfLayers = new DWORD(r);
		for (let i = 0; i < this.NrOfLayers.value; i++) {
			this.layers.push(new Layer(r));
		}
	}

	/** @type {Layer[]} */ layers = [];

	write() {
		this.key.write();
		this.NrOfLayers.writeValue(this.layers.length);
		for (const l of this.layers) {
			l.write();
		}
	}
}

class Layer {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new InclusiveSize(reader);
		const end = reader.byteOffset - 4 + this.inclusiveSize.value;
		this.FilterMode = new DWORD(reader);
		this.ShadingFlags = new DWORD(reader);
		this.TextureId = new DWORD(reader);
		this.TextureAnimationId = new DWORD(reader);
		this.CoordId = new DWORD(reader);
		this.Alpha = new FLOAT(reader);
		// noinspection LoopStatementThatDoesntLoopJS
		while (reader.byteOffset < this.inclusiveSize.end) {
			//FIXME
			console.error('Layer Parser Uncomplete');
			break;
		}

		this.inclusiveSize.check();
	}

	/**
	 * 0 - None
	 * 1 - Transparent
	 * 2 - Blend
	 * 3 - Additive
	 * 4 - AddAlpha
	 * 5 - Modulate
	 * 6 - Modulate2x
	 * @type {DWORD}
	 */
	FilterMode;

	/**
	 * 1   - Unshaded
	 * 2   - SphereEnvironmentMap
	 * 4   - ???
	 * 8   - ???
	 * 16  - TwoSided
	 * 32  - Unfogged
	 * 64  - NoDepthTest
	 * 128 - NoDepthSet
	 * @type {DWORD}
	 */
	ShadingFlags;

	write() {
		this.inclusiveSize.save();
		this.FilterMode.write();
		this.ShadingFlags.write();
		this.TextureId.write();
		this.TextureAnimationId.write();
		this.CoordId.write();
		this.Alpha.write();
		this.inclusiveSize.write();
	}
}

/*
struct LayerChunk
{
  DWORD 'LAYS';
  DWORD NrOfLayers;

  struct Layer[NrOfLayers]
  {
    DWORD InclusiveSize;

    DWORD FilterMode;                  //0 - None
                                       //1 - Transparent
                                       //2 - Blend
                                       //3 - Additive
                                       //4 - AddAlpha
                                       //5 - Modulate
                                       //6 - Modulate2x

    DWORD ShadingFlags;                //#1   - Unshaded
                                       //#2   - SphereEnvironmentMap
                                       //#4   - ???
                                       //#8   - ???
                                       //#16  - TwoSided
                                       //#32  - Unfogged
                                       //#64  - NoDepthTest
                                       //#128 - NoDepthSet

    DWORD TextureId;
    DWORD TextureAnimationId;
    DWORD CoordId;
    FLOAT Alpha;

    {MaterialAlpha}
    {MaterialTextureId}
  };
};
 */


/*
 struct MaterialAlpha
{
  DWORD 'KMTA';

  DWORD NrOfTracks;
  DWORD InterpolationType;             //0 - None
                                       //1 - Linear
                                       //2 - Hermite
                                       //3 - Bezier
  DWORD GlobalSequenceId;

  struct ScalingTrack[NrOfTracks]
  {
    DWORD Time;
    FLOAT Alpha;

    if(InterpolationType > 1)
    {
      FLOAT InTan;
      FLOAT OutTan;
    }
  };
};
 */

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
