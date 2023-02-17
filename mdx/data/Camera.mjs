/** @module MDX */
import {StructSize} from "../type/StructSize.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {VECTOR} from "../type/VECTOR.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";
import {Translations} from "./Translations.mjs";
import {Alpha} from "./Alpha.mjs";

export class Camera {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.Name = new CHAR(reader, 80);
		this.Position = new VECTOR(reader, 3);
		this.FieldOfView = new DWORD(reader);
		this.FarClippingPlane = new DWORD(reader);
		this.NearClippingPlane = new DWORD(reader);
		this.TargetPosition = new VECTOR(reader, 3);
		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KCTR':
					this.positionTranslation = new Translations(key);
					break;
				case 'KTTR':
					this.targetTranslation = new Translations(key);
					break;
				case 'KCRL':
					this.rotation = new Alpha(key);
					break;
				default:
					throw `Camera wrong key: ${key.name}`;
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
