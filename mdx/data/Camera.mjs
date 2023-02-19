/** @module MDX */
import {StructSize} from "../type/StructSize.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class Camera {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.Name = new CHAR(reader, 80);
		this.Position = new FLOAT(reader, 3);
		this.FieldOfView = new DWORD(reader);
		this.FarClippingPlane = new DWORD(reader);
		this.NearClippingPlane = new DWORD(reader);
		this.TargetPosition = new FLOAT(reader, 3);
		this.positionTranslation = Interpolation.fromKey(reader, 'KCTR', FLOAT, 3);
		this.targetTranslation = Interpolation.fromKey(reader, 'KTTR', FLOAT, 3);
		this.rotation = Interpolation.fromKey(reader, 'KCRL', FLOAT);
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
