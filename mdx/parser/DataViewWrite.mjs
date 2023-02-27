/** @module MDX */

// noinspection JSClosureCompilerSyntax
/** @extends DataView */
export class DataViewWrite {
	/** @type {number} */ cursor = 0;

	setFloat32(byteOffset, value, littleEndian) {}

	setUint8(byteOffset, value) {}

	setUint16(byteOffset, value, littleEndian) {}

	setUint32(byteOffset, value, littleEndian) {}
}