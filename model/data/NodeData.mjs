import {Translations} from "./Translations.mjs";
import {Rotations} from "./Rotations.mjs";
import {Scalings} from "./Scalings.mjs";

export class NodeData {

	/** @param {Model} model */
	constructor(model) {
		this.InclusiveSize = model.readDWORD();
		const end = model.byteOffset - 4 + this.InclusiveSize;
		this.Name = model.readCHAR(80);
		this.ObjectId = model.readDWORD();
		this.ParentId = model.readDWORD();
		this.Flags = model.readDWORD();

		let i = 0;
		parse: while (model.byteOffset < end) {
			i++;
			//if (i > 1) break;
			const keyName = model.keyName();

			switch (keyName) {
				case 'KGTR':
					this.translations = new Translations(model.readDWORD(), model);
					break;
				case 'KGRT':
					this.rotations = new Rotations(model.readDWORD(), model);
					break;
				case 'KGSC':
					this.scalings = new Scalings(model.readDWORD(), model);
					break;
				default:
					console.error('NodeData Parse:', keyName);
					break parse;
			}
		}
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

	/** @type {Translations} */ translations;
	/** @type {Rotations} */ rotations;
	/** @type {Scalings} */ scalings;
}

