/**
 * @param {number} number
 * @return {string}
 */
export const HexInt2StringBE = number => String.fromCharCode(
    number >> 24 & 0xff,
    number >> 16 & 0xff,
    number >> 8 & 0xff,
    number & 0xff,
);

/**
 * @param {number} number
 * @return {string}
 * @constructor
 */
export const HexInt2StringLE = number => String.fromCharCode(
    number & 0xff,
    number >> 8 & 0xff,
    number >> 16 & 0xff,
    number >> 24 & 0xff,
);

/**
 * @param {string} string
 * @return {number}
 */
export const HexString2IntLE = string =>
    string.charCodeAt(3) |
    string.charCodeAt(2) << 8 |
    string.charCodeAt(1) << 16 |
    string.charCodeAt(0) << 24;


/**
 * @param {string} string
 * @return {string}
 */
export const HexString2HexLE = string => {
    let out = '';
    for (let i = string.length - 1; i >= 0; i--) {
        out += string.charCodeAt(i).toString(16);
    }
    return out;
};