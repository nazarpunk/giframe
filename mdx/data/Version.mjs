/** @module MDX */

export class Version {

	/** @type {Vers} */ vers;

	/** @param {DataView} view */
	read(view) {
		this.version = view.getUint32(view.cursor, true);
		view.cursor += 4;
		this.vers.version = this.version;
	}

	/** @param {DataView} view */
	write(view) {
		view.setUint32(view.cursor, this.version, true);
		view.cursor += 4;
	}

	toJSON() {
		return {
			version: this.version,
		}
	}
}
