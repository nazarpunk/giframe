export class Node {

	/** @param {Model} model */
	constructor(model) {
		this.InclusiveSize = model.dword();
		const end = model.byteOffset - 4 + this.InclusiveSize;
		this.Name = model.char(80);
		this.ObjectId = model.dword();
		this.ParentId = model.dword();
		this.Flags = model.dword();
	}

	/**
	 * 0       - Helper
	 * 1       - DontInheritTranslation
	 * 2       - DontInheritRotation
	 * 4       - DontInheritScaling
	 * 8       - Billboarded
	 * 16      - BillboardedLockX
	 * 32      - BillboardedLockY
	 * 64      - BillboardedLockZ
	 * 128     - CameraAnchored
	 * 256     - Bone
	 * 512     - Light
	 * 1024    - EventObject
	 * 2048    - Attachment
	 * 4096    - ParticleEmitter
	 * 8192    - CollisionShape
	 * 16384   - RibbonEmitter
	 * 32768   - Unshaded / EmitterUsesMdl
	 * 65536   - SortPrimitivesFarZ / EmitterUsesTga
	 * 131072  - LineEmitter
	 * 262144  - Unfogged
	 * 524288  - ModelSpace
	 * 1048576 - XYQuad
	 * @type {number}
	 */
	Flags;
}

/*
  {GeosetTranslation}
  {GeosetRotation}
  {GeosetScaling}
};
 */

/*
//+-----------------------------------------------------------------------------
//| Animated geoset translation
//+-----------------------------------------------------------------------------
struct GeosetTranslation
{
  DWORD 'KGTR';

  DWORD NrOfTracks;
  DWORD InterpolationType;             //0 - None
                                       //1 - Linear
                                       //2 - Hermite
                                       //3 - Bezier
  DWORD GlobalSequenceId;

  struct TranslationTrack[NrOfTracks]
  {
    DWORD Time;
    FLOAT3 Translation;

    if(InterpolationType > 1)
    {
      FLOAT3 InTan;
      FLOAT3 OutTan;
    }
  };
};

 */