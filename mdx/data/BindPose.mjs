/** @module MDX */

export class BindPose {

    /** @param {CDataView} view */
    read(view) {
        const l = view.byteLength / 4;
        if (l === 0) {
            return;
        }
        for (let i = 0; i < l; i++) {
            this.items.push(view.Float32);
        }
    }

    /** @param {CDataView} view */
    write(view) {
        for (const i of this.items) {
            view.Float32 = i;
        }
    }

    items = [];

    toJSON() {
        return {
            items: this.items,
        };
    }
}
