/** @module MDX */
import {StructSize} from "../type/StructSize.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";
import {Interpolation} from "../model/Interpolation.mjs";
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
		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KCTR':
					this.positionTranslation = new Interpolation(key, FLOAT, 3);
					break;
				case 'KTTR':
					this.targetTranslation = new Interpolation(key, FLOAT, 3);
					break;
				case 'KCRL':
					this.rotation = new Interpolation(key, FLOAT);
					break;
				default:
					throw new Error(`Camera wrong key: ${key.name}`);
			}
		}
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
