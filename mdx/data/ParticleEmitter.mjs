/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {KEY} from "../type/KEY.mjs";
import {Alpha} from "./Alpha.mjs";

export class ParticleEmitter {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.node = new NodeData(reader);
		this.EmissionRate = new FLOAT(reader);
		this.Gravity = new FLOAT(reader);
		this.Longitude = new FLOAT(reader);
		this.Latitude = new FLOAT(reader);
		this.SpawnModelFileName = new CHAR(reader, 260);

		this.LifeSpan = new FLOAT(reader);
		this.InitialVelocity = new FLOAT(reader);

		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KPEV':
					this.visibility = new Alpha(key);
					break;
				default:
					throw `ParticleEmitter wrong key: ${key.name}`;
			}
		}

		this.inclusiveSize.check();
	}

	write() {
		this.inclusiveSize.save();
		this.node.write();
		this.EmissionRate.write();
		this.Gravity.write();
		this.Longitude.write();
		this.Latitude.write();
		this.SpawnModelFileName.write();
		this.LifeSpan.write();
		this.InitialVelocity.write();
		this.visibility.write();
		this.inclusiveSize.write();
	}
}
