import {ModelData} from "../ModelData.mjs";

export class Bone extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.dword();
		const end = model.byteOffset + this.ChunkSize;

	}

}


/*
struct BoneChunk
{
  DWORD 'BONE';
  DWORD ChunkSize;

  struct Bone[NrOfBones]
  {
    Node;

    DWORD GeosetId;
    DWORD GeosetAnimationId;
  };
};

 */