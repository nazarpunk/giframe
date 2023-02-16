import {DWORD} from "../type/DWORD.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {KEY} from "../type/KEY.mjs";
import {StructSize} from "../type/StructSize.mjs";

export class Materials {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.chunkSize.end) {
			this.materials.push(new Material(r));
		}
		this.chunkSize.check();
	}

	/** @type {Material[]} */
	materials = [];

	write() {
		this.key.write();
		this.chunkSize.save();
		for (const m of this.materials) {
			m.write();
		}
		this.chunkSize.write();
	}
}

class Material {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.PriorityPlane = new DWORD(reader);
		this.Flags = new DWORD(reader);

		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'LAYS':
					this.layers = new Layers(key);
					break;
				default:
					throw `Material wrong key: ${key.name}`;
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
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.FilterMode = new DWORD(reader);
		this.ShadingFlags = new DWORD(reader);
		this.TextureId = new DWORD(reader);
		this.TextureAnimationId = new DWORD(reader);
		this.CoordId = new DWORD(reader);
		this.Alpha = new FLOAT(reader);
		// noinspection LoopStatementThatDoesntLoopJS
		while (reader.byteOffset < this.inclusiveSize.end) {
			//FIXME Material Layer Parse
			throw `Layer Parser Uncomplete`;
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
