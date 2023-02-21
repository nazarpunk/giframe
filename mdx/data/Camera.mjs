/** @module MDX */
import {StructSizeOld} from "../type/StructSizeOld.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {InterpolationOld} from "../parser/InterpolationOld.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class Camera {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSizeOld(reader, {inclusive: true});
		this.Name = new CHAR(reader, 80);
		this.Position = new FLOAT(reader, 3);
		this.FieldOfView = new DWORD(reader);
		this.FarClippingPlane = new DWORD(reader);
		this.NearClippingPlane = new DWORD(reader);
		this.TargetPosition = new FLOAT(reader, 3);
		this.positionTranslation = InterpolationOld.fromKey(reader, 'KCTR', FLOAT, 3);
		this.targetTranslation = InterpolationOld.fromKey(reader, 'KTTR', FLOAT, 3);
		this.rotation = InterpolationOld.fromKey(reader, 'KCRL', FLOAT);
		this.inclusiveSize.check();
	}

	write() {
		this.inclusiveSize.save();
		this.Name.write();
		this.Position.write();
		this.FieldOfView.write();
		this.FarClippingPlane.write();
		this.NearClippingPlane.write();
		this.TargetPosition.write();
		this.positionTranslation?.write();
		this.targetTranslation?.write();
		this.rotation?.write();
		this.inclusiveSize.write();
	}
}
