import {W3ABDHQTU} from './abstract/W3ABDHQTU.mjs';

export class W3A extends W3ABDHQTU {
    /** @param {Buffer|ArrayBuffer} buffer */
    constructor(buffer) {
        super(buffer, true);
    }
}