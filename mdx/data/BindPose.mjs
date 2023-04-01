/** @module MDX */

export class BindPose {

	/** @param {CDataView} view */
	read(view) {
		const l = view.byteLength / 4;
		if (l === 0) {
			return;
		}
		for (let i = 0; i < l; i++) {
			this.items.push(view.getFloat32(view.cursor + i * 4, true));
		}
		view.cursor += l * 4;
	}

	/** @param {CDataView} view */
	write(view) {
		for (let i = 0; i < this.items.length; i++) {
			view.setFloat32(view.cursor + i * 4, this.items[i], true);
		}
		view.cursor += this.items.length * 4;
	}

	items = [];

	toJSON() {
		return {
			items: this.items,
		}
	}
}
