import {W3ABDHQTU} from './W3ABDHQTU.mjs';

export class W3U extends W3ABDHQTU {
    /** @param {Buffer|ArrayBuffer} buffer */
    constructor(buffer) {
        super(buffer, false);
    }
}