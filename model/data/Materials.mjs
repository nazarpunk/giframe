import {ModelData} from "../ModelData.mjs";

export class Materials extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.readDWORD();

		const end = model.byteOffset + this.ChunkSize;

		while (model.byteOffset < end) {
			this.materials.push(new Material(model));
		}

	}

	/** @type {Material[]} */
	materials = [];
}

class Material {
	/** @param {Model} model */
	constructor(model) {
		this.InclusiveSize = model.readDWORD();
		this.PriorityPlane = model.readDWORD();
		this.Flags = model.readDWORD();
		const keyName = model.keyName();
		if (model.keyName() === 'LAYS') {
			this.layer = new Layers(model.readDWORD(), model);
		}
	}

	/**
	 * 1  - ConstantColor
	 * 2  - ???
	 * 4  - ???
	 * 8  - SortPrimitivesNearZ
	 * 16 - SortPrimitivesFarZ
	 * 32 - FullResolution
	 * @type {number}
	 */
	Flags;

	/** @type {Layers} */
	layer;
}

class Layers extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.NrOfLayers = model.readDWORD();
		for (let i = 0; i < this.NrOfLayers; i++) {
			this.layers.push(new Layer(model));
		}
	}

	/** @type {Layer[]} */
	layers = [];
}

class Layer {
	/** @param {Model} model */
	constructor(model) {
		this.InclusiveSize = model.readDWORD();
		const end = model.byteOffset - 4 + this.InclusiveSize;
		this.FilterMode = model.readDWORD();
		this.ShadingFlags = model.readDWORD();
		this.TextureId = model.readDWORD();
		this.TextureAnimationId = model.readDWORD();
		this.CoordId = model.readDWORD();
		this.Alpha = model.float();

		if (model.byteOffset !== end) {
			//FIXME
			console.error('Layer Parser Uncomplete');
		}
	}

	/**
	 * 0 - None
	 * 1 - Transparent
	 * 2 - Blend
	 * 3 - Additive
	 * 4 - AddAlpha
	 * 5 - Modulate
	 * 6 - Modulate2x
	 * @type {number}
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
	 * @type {number}
	 */
	ShadingFlags
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
