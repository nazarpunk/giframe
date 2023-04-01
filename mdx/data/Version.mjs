/** @module MDX */

export class Version {

    /** @type {Vers} */ vers;

    /** @param {CDataView} view */
    read(view) {
        this.version = view.Uint32;
        this.vers.version = this.version;
    }

    /** @param {CDataView} view */
    write(view) {
        view.Uint32 = this.version;
    }

    toJSON() {
        return {
            version: this.version,
        };
    }
}
