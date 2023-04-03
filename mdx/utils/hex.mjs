/** @module MDX */

export const int2s = number => String.fromCharCode(
	number & 0xff,
	number >> 8 & 0xff,
	number >> 16 & 0xff,
	number >> 24 & 0xff,
);