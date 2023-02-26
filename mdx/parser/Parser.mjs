/** @module MDX */

export class Parser {

	items = [];

	add(item) {
		const p = typeof item === 'object' ? item : new item();
		this.items.push(p);
		return p;
	}

	/** @param {DataView} view */
	read(view) {
		for (const i of this.items) {
			i.read(view);
		}
	}

	/** @param {DataView} view */
	write(view) {
		for (const i of this.items) {
			i.write(view);
		}
	}
}