/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {KEY} from "../type/KEY.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {Interpolation} from "../model/Interpolation.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class NodeData {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.Name = new CHAR(reader, 80);
		this.ObjectId = new DWORD(reader);
		this.ParentId = new DWORD(reader);
		this.Flags = new DWORD(reader);

		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KGTR':
					this.translations = new Interpolation(key, FLOAT, 3);
					break;
				case 'KGRT':
					this.rotations = new Interpolation(key, FLOAT, 4);
					break;
				case 'KGSC':
					this.scalings = new Interpolation(key, FLOAT, 3);
					break;
				default:
					throw new Error(`NodeData key error: ${key.name}`);
			}
		}

		this.inclusiveSize.check();
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
	 * @type {DWORD}
	 */
	Flags;

	/** @type {Interpolation} */ translations;
	/** @type {Interpolation} */ rotations;
	/** @type {Interpolation} */ scalings;

	write() {
		this.inclusiveSize.save();
		this.Name.write();
		this.ObjectId.write();
		this.ParentId.write();
		this.Flags.write();
		this.translations?.write();
		this.rotations?.write();
		this.scalings?.write();
		this.inclusiveSize.write();
	}
}

