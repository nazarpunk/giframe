/** @module MDX */
// noinspection JSUnusedGlobalSymbols

/**
 * @param {String} s
 * @return {string}
 */
export const s2s = s => {
	return `0x${s.charCodeAt(3).toString(16)}${s.charCodeAt(2).toString(16)}${s.charCodeAt(1).toString(16)}${s.charCodeAt(0).toString(16)}/*${s}*/`;
};

export const int2s = number => String.fromCharCode(
	number & 0xff,
	number >> 8 & 0xff,
	number >> 16 & 0xff,
	number >> 24 & 0xff,
);