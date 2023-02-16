import {Translations} from "./Translations.mjs";
import {Rotations} from "./Rotations.mjs";
import {Scalings} from "./Scalings.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";

export class NodeData {
	/** @param {Reader} reader */
	constructor(reader) {
		this.InclusiveSize = new DWORD(reader);
		const end = reader.byteOffset - 4 + this.InclusiveSize.value;
		this.Name = new CHAR(reader, 80);
		this.ObjectId = new DWORD(reader);
		this.ParentId = new DWORD(reader);
		this.Flags = new DWORD(reader);

		parse: while (reader.byteOffset < end) {
			const key = new DWORD(reader, {byteOffset: 0});
			switch (key.valueName) {
				case 'KGTR':
					this.translations = new Translations(new DWORD(reader));
					break;
				case 'KGRT':
					this.rotations = new Rotations(new DWORD(reader));
					break;
				case 'KGSC':
					this.scalings = new Scalings(new DWORD(reader));
					break;
				default:
					console.error('NodeData Parse:', key.valueName);
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
	 * @type {DWORD}
	 */
	Flags;

	/** @type {Translations} */ translations;
	/** @type {Rotations} */ rotations;
	/** @type {Scalings} */ scalings;

	write(){
		this.InclusiveSize.write();
		this.Name.write();
		this.ObjectId.write();
		this.ParentId.write();
		this.Flags.write();
		this.translations?.write();
		this.rotations?.write();
		this.scalings?.write();
	}
}

